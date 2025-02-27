import React, { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

interface ResultsPhaseProps {
  selectedCandidate: any;
  candidates: any[];
  onReset: () => void;
  criteria: string[];
  sessionId: string;
}

const ResultsPhase: React.FC<ResultsPhaseProps> = ({ 
  selectedCandidate, 
  candidates, 
  onReset,
  criteria,
  sessionId
}) => {
  const hasBeenSaved = useRef(false);

  useEffect(() => {
    if (selectedCandidate && !hasBeenSaved.current) {
      saveResults();
      hasBeenSaved.current = true;
    }
  }, [selectedCandidate]);

  const saveResults = async () => {
    try {
      // Calculate scores
      const criteriaScores = criteria.map(criterion => selectedCandidate?.[criterion] || 0);
      const totalScore = criteriaScores.reduce((a, b) => a + b, 0);
      const maxPossibleScore = criteria.length * 10;
      const successRate = ((totalScore / maxPossibleScore) * 100).toFixed(1);

      // Find candidate's rank
      const sortedCandidates = [...candidates].sort((a, b) => {
        const aTotal = criteria.reduce((sum, criterion) => sum + (a[criterion] || 0), 0);
        const bTotal = criteria.reduce((sum, criterion) => sum + (b[criterion] || 0), 0);
        return bTotal - aTotal;
      });
      const rank = sortedCandidates.findIndex(c => c.id === selectedCandidate.id) + 1;

      // Create scores object for each criterion
      const candidateScores = {};
      criteria.forEach(criterion => {
        candidateScores[criterion] = selectedCandidate[criterion];
      });

      // Save to results table
      const { error } = await supabase.from('results').insert({
        score: totalScore,
        total_questions: criteria.length,
        success_rate: parseFloat(successRate),
        selected_candidate_name: selectedCandidate.name,
        selected_candidate_scores: candidateScores,
        total_candidates: candidates.length,
        rank_position: rank
      });

      if (error) {
        console.error('Error saving results:', error);
        hasBeenSaved.current = false; // Reset flag if save fails
      }
    } catch (error) {
      console.error('Error saving results:', error);
      hasBeenSaved.current = false; // Reset flag if save fails
    }
  };

  // Calculate display values
  const criteriaScores = criteria.map(criterion => selectedCandidate?.[criterion] || 0);
  const totalScore = criteriaScores.reduce((a, b) => a + b, 0);
  const maxPossibleScore = criteria.length * 10;
  const successRate = ((totalScore / maxPossibleScore) * 100).toFixed(1);

  // Find the candidate's rank among all candidates
  const sortedCandidates = [...candidates].sort((a, b) => {
    const aTotal = criteria.reduce((sum, criterion) => sum + (a[criterion] || 0), 0);
    const bTotal = criteria.reduce((sum, criterion) => sum + (b[criterion] || 0), 0);
    return bTotal - aTotal;
  });
  const rank = selectedCandidate ? sortedCandidates.findIndex(c => c.id === selectedCandidate.id) + 1 : 0;

  if (!selectedCandidate) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6">
        <h2 className="text-2xl font-bold text-purple-600">Sonuçlar</h2>
        <p className="text-xl">Hiçbir aday seçilmedi</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Yeni Test
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      <h2 className="text-2xl font-bold text-purple-600">Sonuçlar</h2>
      
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800">{selectedCandidate.name}</h3>
            <p className="text-gray-600">Seçilen Aday</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">{successRate}%</p>
              <p className="text-sm text-gray-600">Başarı Oranı</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-3xl font-bold text-purple-600">#{rank}</p>
              <p className="text-sm text-gray-600">Sıralama</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-gray-700">Kriter Puanları:</h4>
            {criteria.map((criterion, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                <span className="text-gray-700">{criterion}</span>
                <span className="font-semibold text-purple-600">
                  {selectedCandidate[criterion] || 0}/10
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      >
        Yeni Test
      </button>
    </div>
  );
};

export default ResultsPhase;