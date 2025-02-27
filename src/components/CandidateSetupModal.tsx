import React, { useState, useEffect } from 'react';
import { X, Save, ChevronLeft, ChevronRight, Loader } from 'lucide-react';

interface CandidateSetupModalProps {
  onClose: () => void;
  onSave: (candidates: any[]) => void;
  totalCandidates: number;
  criteria: string[];
  initialCandidates?: any[]; // New prop for existing candidates
}

const CandidateSetupModal: React.FC<CandidateSetupModalProps> = ({ 
  onClose, 
  onSave, 
  totalCandidates, 
  criteria,
  initialCandidates 
}) => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const candidatesPerPage = 5;
  const totalPages = Math.ceil(totalCandidates / candidatesPerPage);

  // Initialize candidates
  useEffect(() => {
    if (initialCandidates && initialCandidates.length > 0) {
      // Use existing candidates if provided
      setCandidates(initialCandidates);
    } else {
      // Create new candidates with default values
      const newCandidates = Array.from({ length: totalCandidates }, (_, i) => {
        const candidateData: any = {
          id: i + 1,
          name: `Aday ${i + 1}`,
        };
        
        // Initialize criteria values
        criteria.forEach(criterion => {
          candidateData[criterion] = 5; // Default middle value
        });
        
        return candidateData;
      });
      
      setCandidates(newCandidates);
    }
  }, [totalCandidates, criteria, initialCandidates]);

  // Update candidate name
  const updateCandidateName = (id: number, name: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, name } : candidate
    ));
  };

  // Update candidate criterion value
  const updateCandidateCriterion = (id: number, criterion: string, value: number) => {
    const numValue = Math.max(0, Math.min(10, parseInt(value.toString()) || 0));
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, [criterion]: numValue } : candidate
    ));
  };

  // Get current page candidates
  const getCurrentPageCandidates = () => {
    const startIndex = currentPage * candidatesPerPage;
    return candidates.slice(startIndex, startIndex + candidatesPerPage);
  };

  // Navigate to next page
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Navigate to previous page
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle save
  const handleSave = () => {
    setIsSaving(true);
    onSave(candidates);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Adayları Özelleştir</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSaving}
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-6">
            {getCurrentPageCandidates().map((candidate) => (
              <div key={candidate.id} className="border rounded-lg p-4">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <label className="font-medium min-w-[100px]">İsim:</label>
                    <input
                      type="text"
                      value={candidate.name}
                      onChange={(e) => updateCandidateName(candidate.id, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      disabled={isSaving}
                    />
                  </div>
                  
                  {criteria.map((criterion) => (
                    <div key={criterion} className="flex items-center space-x-4">
                      <label className="font-medium min-w-[100px]">{criterion}:</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={candidate[criterion]}
                        onChange={(e) => updateCandidateCriterion(candidate.id, criterion, e.target.value)}
                        className="w-24 p-2 border rounded"
                        disabled={isSaving}
                      />
                      <div className="flex-1 h-2 bg-gray-200 rounded">
                        <div 
                          className="h-full bg-purple-600 rounded"
                          style={{ width: `${(candidate[criterion] / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 0 || isSaving}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1 || isSaving}
                className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight size={20} />
              </button>
              <span className="p-2">
                Sayfa {currentPage + 1} / {totalPages}
              </span>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                disabled={isSaving}
                className="px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    <span>Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSetupModal;