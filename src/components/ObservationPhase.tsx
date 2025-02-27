import React from 'react';
import { Eye, ChevronRight } from 'lucide-react';

interface ObservationPhaseProps {
  candidate: any;
  currentIndex: number;
  totalCandidates: number;
  threshold: number;
  onNext: () => void;
  criteria: string[];
}

const ObservationPhase: React.FC<ObservationPhaseProps> = ({
  candidate,
  currentIndex,
  totalCandidates,
  threshold,
  onNext,
  criteria
}) => {
  // Calculate progress percentage
  const progress = (currentIndex / (totalCandidates - 1)) * 100;
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Phase info */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <Eye className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Gözlem Aşaması</h3>
            <p className="text-sm text-blue-700 mt-1">
              İlk {threshold} adayı (%37) sadece gözlemliyorsunuz. Bu aşamada seçim yapamazsınız.
              Kalan aday: {threshold - currentIndex - 1}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Candidate card */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
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
            
            <div className="flex justify-end">
              <button
                onClick={onNext}
                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 flex items-center"
              >
                Sonraki
                <ChevronRight size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservationPhase;