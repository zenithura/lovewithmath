import React, { useState } from 'react';
import { Settings, Plus, Trash2, ChevronRight, Users, Loader } from 'lucide-react';

interface SetupPhaseProps {
  totalCandidates: number;
  setTotalCandidates: (value: number) => void;
  criteria: string[];
  setCriteria: (criteria: string[]) => void;
  onStart: () => void;
  customizeCandidates: boolean;
  setCustomizeCandidates: (value: boolean) => void;
  isLoading: boolean;
  addCriterion: (criterionName: string) => void;
  removeCriterion: (criterion: string) => void;
  criteriaChanged: boolean;
}

const SetupPhase: React.FC<SetupPhaseProps> = ({ 
  totalCandidates, 
  setTotalCandidates, 
  criteria, 
  onStart,
  customizeCandidates,
  setCustomizeCandidates,
  isLoading,
  addCriterion,
  removeCriterion,
  criteriaChanged
}) => {
  const [newCriterion, setNewCriterion] = useState<string>('');

  const handleAddCriterion = () => {
    if (newCriterion.trim()) {
      addCriterion(newCriterion);
      setNewCriterion('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddCriterion();
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex items-center mb-6">
        <Settings className="text-indigo-600 mr-3" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Ayarlar</h2>
      </div>

      <div className="space-y-6">
        {/* Total candidates */}
        <div>
          <label htmlFor="totalCandidates" className="block text-sm font-medium text-gray-700 mb-1">
            Toplam Aday Sayısı
          </label>
          <input
            type="number"
            id="totalCandidates"
            min="10"
            max="1000"
            value={totalCandidates}
            onChange={(e) => setTotalCandidates(Math.max(10, parseInt(e.target.value) || 10))}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Değerlendirmek istediğiniz toplam aday sayısı (minimum 10)
          </p>
        </div>

        {/* Criteria */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Değerlendirme Kriterleri
          </label>
          <div className="space-y-2 mb-4">
            {criteria.map((criterion, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span>{criterion}</span>
                {index > 2 && (
                  <button 
                    onClick={() => removeCriterion(criterion)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Yeni kriter ekle"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={handleAddCriterion}
              className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 flex items-center"
            >
              <Plus size={16} className="mr-1" />
              Ekle
            </button>
          </div>
        </div>

        {/* Customize candidates option */}
        <div className="mt-8 flex flex-col space-y-4">
          <div className="flex items-center bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
            <div className="flex items-center flex-1">
              <input
                type="checkbox"
                id="customizeCandidates"
                checked={customizeCandidates}
                onChange={(e) => !criteriaChanged && setCustomizeCandidates(e.target.checked)}
                disabled={criteriaChanged}
                className={`h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-colors ${
                  criteriaChanged ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              />
              <div className="ml-3">
                <label 
                  htmlFor="customizeCandidates" 
                  className={`text-base font-medium text-gray-700 ${criteriaChanged ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  Adayları özelleştir
                </label>
                {criteriaChanged && (
                  <p className="text-sm text-gray-500 mt-1">
                    Kriter değişikliği yapıldığı için zorunlu
                  </p>
                )}
              </div>
            </div>
            <Users size={20} className="text-purple-600 ml-2" />
          </div>

          <div className="flex justify-center w-full">
            <button
              onClick={onStart}
              disabled={isLoading}
              className={`w-full max-w-md px-8 py-4 rounded-xl transition-all flex items-center justify-center space-x-3 font-medium text-lg shadow-lg hover:shadow-xl ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  <span>İşleniyor...</span>
                </>
              ) : (
                <>
                  <span>Oyuna Başla</span>
                  <ChevronRight size={24} />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Observation threshold info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Love with Math algoritmasına göre, ilk {Math.floor(totalCandidates / Math.E)} adayı (%37) sadece gözlemleyeceksiniz. 
                Bu süreçte seçim yapamazsınız, ancak bu adaylar arasındaki en iyi puanı belirleyerek sonraki adayları değerlendirmek için bir eşik oluşturacaksınız.
              </p>
            </div>
          </div>
        </div>

        {customizeCandidates && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <Users className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  "Başla" düğmesine tıkladığınızda, adayları özelleştirmek için bir pencere açılacaktır.
                  Burada her adayın adını ve kriter puanlarını ayarlayabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupPhase;