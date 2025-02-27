import React from 'react';
import { Check, X, ChevronRight } from 'lucide-react';

interface SelectionPhaseProps {
  candidate: any;
  currentIndex: number;
  totalCandidates: number;
  bestScore: number;
  onSelect: () => void;
  onSkip: () => void;
  isOptimal: boolean;
  criteria: string[];
}

const SelectionPhase: React.FC<SelectionPhaseProps> = ({
  candidate,
  currentIndex,
  totalCandidates,
  bestScore,
  onSelect,
  onSkip,
  isOptimal,
  criteria
}) => {
  // Calculate progress percentage
  const progress = (currentIndex / (totalCandidates - 1)) * 100;
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Candidate card */}
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${isOptimal ? 'ring-2 ring-green-500' : ''}`}>
        <div className="p-6">
          {/* Candidate details */}
          <div className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{candidate.name}</h2>
              <span className="text-sm bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">
                {currentIndex + 1} / {totalCandidates}
              </span>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Değerlendirme Kriterleri</h3>
              <div className="space-y-3">
                {criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center">
                    <span className="w-1/3 text-gray-600">{criterion}:</span>
                    <div className="w-2/3 flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${(candidate[criterion] / 10) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{candidate[criterion]}/10</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {isOptimal && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Optimal Seçim Bulundu!</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Bu aday, gözlem aşamasında gördüğünüz en iyi adaydan daha yüksek puana sahip. 
                      Optimal durma algoritmasına göre, bu adayı seçmeniz önerilir.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between">
              <button
                onClick={onSkip}
                className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-300 flex items-center"
              >
                <X size={20} className="mr-1" />
                Geç
              </button>
              <button
                onClick={onSelect}
                className={`${isOptimal ? 'bg-green-600 hover:bg-green-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 px-6 rounded-md flex items-center`}
              >
                <Check size={20} className="mr-1" />
                Seç
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPhase;