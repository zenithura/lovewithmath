import React, { useState, useEffect } from 'react';
import { Settings, User, Check, X, ChevronRight, ChevronLeft, RefreshCw, Info } from 'lucide-react';
import SetupPhase from './components/SetupPhase';
import ObservationPhase from './components/ObservationPhase';
import SelectionPhase from './components/SelectionPhase';
import ResultsPhase from './components/ResultsPhase';
import InfoModal from './components/InfoModal';
import CandidateSetupModal from './components/CandidateSetupModal';
import Rules from './components/Rules';
import { supabase, type Candidate, type Session } from './lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// App phases
enum Phase {
  SETUP,
  OBSERVATION,
  SELECTION,
  RESULTS
}

function App() {
  // Main state
  const [phase, setPhase] = useState<Phase>(Phase.SETUP);
  const [totalCandidates, setTotalCandidates] = useState<number>(10); // Start with 10 instead of 100
  const [criteria, setCriteria] = useState<string[]>(['Kişilik', 'İlgi Alanları', 'Güzellik']);
  const [currentCandidateIndex, setCurrentCandidateIndex] = useState<number>(0);
  const [observationThreshold, setObservationThreshold] = useState<number>(0);
  const [bestObservationScore, setBestObservationScore] = useState<number>(0);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [showCandidateSetupModal, setShowCandidateSetupModal] = useState<boolean>(false);
  const [customizeCandidates, setCustomizeCandidates] = useState<boolean>(false);
  const [criteriaChanged, setCriteriaChanged] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate observation threshold (37% rule)
  useEffect(() => {
    setObservationThreshold(Math.floor(totalCandidates / Math.E));
  }, [totalCandidates]);

  // Create a new session in Supabase
  const createSession = async (): Promise<string> => {
    try {
      const newSessionId = uuidv4();
      const sessionData: Session = {
        id: newSessionId,
        total_candidates: totalCandidates,
        criteria: criteria,
        observation_threshold: Math.floor(totalCandidates / Math.E)
      };

      const { error } = await supabase
        .from('sessions')
        .insert([sessionData]);

      if (error) throw error;
      
      setSessionId(newSessionId);
      return newSessionId;
    } catch (error) {
      console.error('Error creating session:', error);
      return sessionId; // Return current session ID if there's an error
    }
  };

  // Save candidates to Supabase
  const saveCandidatesToSupabase = async (candidatesToSave: any[], sid: string) => {
    try {
      const candidatesForDb: Candidate[] = candidatesToSave.map(candidate => {
        // Extract criteria values into a separate object
        const criteriaValues: Record<string, number> = {};
        criteria.forEach(criterion => {
          criteriaValues[criterion] = candidate[criterion];
        });

        return {
          name: candidate.name,
          criteria_values: criteriaValues,
          session_id: sid
        };
      });

      const { error } = await supabase
        .from('candidates')
        .insert(candidatesForDb);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving candidates:', error);
    }
  };

  // Save candidates after customization
  const handleSaveCustomCandidates = async (customizedCandidates: any[]) => {
    setIsLoading(true);
    try {
      const sid = await createSession();

      // Delete existing candidates
      await supabase.from('candidates').delete().neq('id', 0);

      // Save new customized candidates
      await saveCandidatesToSupabase(customizedCandidates, sid);

      // Update state with new candidates
      const randomizedCandidates = [...customizedCandidates]
        .sort(() => Math.random() - 0.5);
      
      setCandidates(randomizedCandidates);
      setCurrentCandidateIndex(0);
      setBestObservationScore(0);
      setSelectedCandidate(null);
      setShowCandidateSetupModal(false);
      startObservation();
    } catch (error) {
      console.error('Error saving custom candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate random candidates
  const generateCandidates = async () => {
    setIsLoading(true);
    
    try {
      const sid = await createSession();

      // First check if we have candidates in the database
      const { data: existingCandidates, error: fetchError } = await supabase
        .from('candidates')
        .select('*')
        .order('created_at', { ascending: false }) // Get latest first
        .limit(totalCandidates);

      if (fetchError) throw fetchError;

      if (customizeCandidates) {
        // If customizing candidates, show modal with existing or empty candidates
        const candidatesToCustomize = existingCandidates?.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          ...candidate.criteria_values
        })) || Array.from({ length: totalCandidates }, (_, i) => ({
          id: i + 1,
          name: `Aday ${i + 1}`,
          ...Object.fromEntries(criteria.map(c => [c, 5])) // Default value of 5 for each criterion
        }));
        
        // Make sure all criteria exist in the candidates
        candidatesToCustomize.forEach(candidate => {
          criteria.forEach(criterion => {
            if (!(criterion in candidate)) {
              candidate[criterion] = 5; // Default value for new criteria
            }
          });
        });
        
        setCandidates(candidatesToCustomize);
        setShowCandidateSetupModal(true);
        setIsLoading(false);
        return;
      }

      let candidatesToUse;

      if (existingCandidates && existingCandidates.length > 0) {
        // Use existing candidates with their exact values
        candidatesToUse = existingCandidates.map((candidate, i) => {
          const candidateData: any = {
            id: i + 1,
            name: candidate.name,
            ...candidate.criteria_values
          };

          // Add any missing criteria with default values
          criteria.forEach(criterion => {
            if (!(criterion in candidateData)) {
              candidateData[criterion] = Math.floor(Math.random() * 10) + 1;
            }
          });

          candidateData.score = calculateScore(candidateData, criteria);
          return candidateData;
        });

        // If we have new criteria, update the database
        const hasNewCriteria = criteria.some(criterion => 
          !existingCandidates[0].criteria_values.hasOwnProperty(criterion)
        );

        if (hasNewCriteria) {
          await supabase.from('candidates').delete().neq('id', 0);
          await saveCandidatesToSupabase(candidatesToUse, sid);
        }
      } else {
        // No existing candidates, generate completely new ones
        candidatesToUse = Array.from({ length: totalCandidates }, (_, i) => {
          const candidateData: any = {
            id: i + 1,
            name: `Aday ${i + 1}`
          };
          
          // Add random values for each criterion
          const criteriaValues: Record<string, number> = {};
          criteria.forEach(criterion => {
            const value = Math.floor(Math.random() * 10) + 1;
            candidateData[criterion] = value;
            criteriaValues[criterion] = value;
          });

          candidateData.score = calculateScore(criteriaValues, criteria);
          return candidateData;
        });

        // Save new candidates to database
        await saveCandidatesToSupabase(candidatesToUse, sid);
      }
      
      // Randomize candidates order
      const randomizedCandidates = [...candidatesToUse]
        .sort(() => Math.random() - 0.5);
      
      setCandidates(randomizedCandidates);
      setCurrentCandidateIndex(0);
      setBestObservationScore(0);
      setSelectedCandidate(null);
      startObservation();
    } catch (error) {
      console.error('Error generating candidates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate overall score based on criteria
  const calculateScore = (criteriaValues: Record<string, number>, criteriaList: string[]) => {
    if (criteriaList.length === 0) return 0;
    
    const sum = criteriaList.reduce((total, criterion) => {
      return total + (criteriaValues[criterion] || 0);
    }, 0);
    
    return Math.round((sum / criteriaList.length) * 10) / 10;
  };

  // Start the observation phase
  const startObservation = () => {
    setPhase(Phase.OBSERVATION);
  };

  // Move to next candidate
  const nextCandidate = () => {
    if (currentCandidateIndex < totalCandidates - 1) {
      // Update best score during observation phase
      if (phase === Phase.OBSERVATION && candidates[currentCandidateIndex].score > bestObservationScore) {
        setBestObservationScore(candidates[currentCandidateIndex].score);
      }
      
      // Check if we need to transition from observation to selection phase
      if (currentCandidateIndex + 1 === observationThreshold) {
        setPhase(Phase.SELECTION);
      }
      
      setCurrentCandidateIndex(currentCandidateIndex + 1);
    } else {
      // End of candidates, show results
      setPhase(Phase.RESULTS);
    }
  };

  // Select current candidate
  const selectCandidate = () => {
    setSelectedCandidate(candidates[currentCandidateIndex]);
    setPhase(Phase.RESULTS);
  };

  // Reset the application
  const resetApp = () => {
    setPhase(Phase.SETUP);
    setCurrentCandidateIndex(0);
    setBestObservationScore(0);
    setSelectedCandidate(null);
    setSessionId(uuidv4());
    setCustomizeCandidates(false);
    setCriteriaChanged(false); // Reset criteria change status
  };

  // Add new criterion
  const addCriterion = (criterionName: string) => {
    if (criterionName.trim() && !criteria.includes(criterionName.trim())) {
      setCriteria([...criteria, criterionName.trim()]);
      setCustomizeCandidates(true);
      setCriteriaChanged(true);
    }
  };

  // Remove criterion
  const removeCriterion = (criterionToRemove: string) => {
    const defaultCriteria = ['Kişilik', 'İlgi Alanları', 'Güzellik'];
    if (defaultCriteria.includes(criterionToRemove)) {
      return; // Don't allow removal of default criteria
    }
    setCriteria(criteria.filter(c => c !== criterionToRemove));
    setCustomizeCandidates(true);
    setCriteriaChanged(true);
  };

  // Start game
  const startGame = async () => {
    setIsLoading(true);
    try {
      if (customizeCandidates) {
        setShowCandidateSetupModal(true);
      } else {
        await generateCandidates();
      }
      setCriteriaChanged(false); // Reset criteria change status after starting game
    } catch (error) {
      console.error('Error starting game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the current phase
  const renderPhase = () => {
    switch (phase) {
      case Phase.SETUP:
        return (
          <>
            <Rules />
            <SetupPhase 
              totalCandidates={totalCandidates}
              setTotalCandidates={setTotalCandidates}
              criteria={criteria}
              setCriteria={setCriteria}
              onStart={startGame}
              customizeCandidates={customizeCandidates}
              setCustomizeCandidates={setCustomizeCandidates}
              isLoading={isLoading}
              addCriterion={addCriterion}
              removeCriterion={removeCriterion}
              criteriaChanged={criteriaChanged}
            />
          </>
        );
      case Phase.OBSERVATION:
        return (
          <ObservationPhase 
            candidate={candidates[currentCandidateIndex]}
            currentIndex={currentCandidateIndex}
            totalCandidates={totalCandidates}
            threshold={observationThreshold}
            onNext={nextCandidate}
            criteria={criteria}
          />
        );
      case Phase.SELECTION:
        return (
          <SelectionPhase 
            candidate={candidates[currentCandidateIndex]}
            currentIndex={currentCandidateIndex}
            totalCandidates={totalCandidates}
            bestScore={bestObservationScore}
            onSelect={selectCandidate}
            onSkip={nextCandidate}
            isOptimal={candidates[currentCandidateIndex].score > bestObservationScore}
            criteria={criteria}
          />
        );
      case Phase.RESULTS:
        return (
          <ResultsPhase 
            selectedCandidate={selectedCandidate}
            candidates={candidates}
            sessionId={sessionId}
            onReset={resetApp}
            criteria={criteria}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <img src="/logo.svg" alt="Optimal Durma Problemi" className="w-16 h-16" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Optimal Durma Problemi</h1>
        </header>

        {renderPhase()}

        {/* Footer */}
        <footer className="bg-white p-4 shadow-inner mt-8">
          <div className="container mx-auto text-center text-gray-500 text-sm">
            <p>Optimal Durma Problemi (Sekreter Problemi) Algoritması &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>

        {/* Info Modal */}
        {showInfoModal && (
          <InfoModal onClose={() => setShowInfoModal(false)} />
        )}

        {/* Candidate Setup Modal */}
        {showCandidateSetupModal && (
          <CandidateSetupModal
            onClose={() => {
              setShowCandidateSetupModal(false);
              setCustomizeCandidates(false);
            }}
            onSave={handleSaveCustomCandidates}
            totalCandidates={totalCandidates}
            criteria={criteria}
            initialCandidates={candidates}
          />
        )}
      </div>
    </div>
  );
}

export default App;