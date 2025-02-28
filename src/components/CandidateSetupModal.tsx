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

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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

  // Smooth scroll to top when page changes
  useEffect(() => {
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      container.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [currentPage]);

  // Handle save
  const handleSave = () => {
    setIsSaving(true);
    onSave(candidates);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl m-4 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Adayları Özelleştir</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            disabled={isSaving}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              {getCurrentPageCandidates().map((candidate) => (
                <div key={candidate.id} className="bg-gray-50 border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <label className="font-medium text-gray-700 min-w-[100px]">İsim:</label>
                      <input
                        type="text"
                        value={candidate.name}
                        onChange={(e) => updateCandidateName(candidate.id, e.target.value)}
                        className="flex-1 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-shadow"
                        disabled={isSaving}
                      />
                    </div>
                    
                    {criteria.map((criterion) => (
                      <div key={criterion} className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <label className="font-medium text-gray-700 min-w-[100px]">{criterion}:</label>
                        <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                          <div className="flex items-center space-x-3 w-24">
                            <span className="font-medium text-purple-600 min-w-[24px]">{candidate[criterion]}</span>
                          </div>
                          <div className="flex-1 flex items-center space-x-4">
                            <input
                              type="range"
                              min="0"
                              max="10"
                              value={candidate[criterion]}
                              onChange={(e) => updateCandidateCriterion(candidate.id, criterion, parseInt(e.target.value))}
                              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              disabled={isSaving}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="sticky bottom-0 mt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-lg p-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0 || isSaving}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="px-4 py-2 font-medium">
                  Sayfa {currentPage + 1} / {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1 || isSaving}
                  className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications section if any */}
          <div className="px-6 py-4">
            {/* Notifications will be rendered here */}
          </div>

          {/* Start Game Button Section */}
          <div className="flex justify-center px-6 py-8 bg-gradient-to-t from-gray-50">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full max-w-md px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3 font-medium text-lg"
            >
              <span>Oyuna Başla</span>
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateSetupModal;