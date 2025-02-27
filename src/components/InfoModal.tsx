import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Optimal Durma Problemi Hakkında</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="prose max-w-none">
            <h3>Optimal Durma Problemi (Sekreter Problemi) Nedir?</h3>
            <p>
              Optimal Durma Problemi, sırayla gelen seçenekler arasından en iyi seçimi yapmak için matematiksel bir stratejidir. 
              Bu problem, "Sekreter Problemi", "Evlilik Problemi" veya "En İyi Seçim Problemi" olarak da bilinir.
            </p>
            
            <h3>Problem Tanımı</h3>
            <p>
              Bir dizi aday (n adet) sırayla değerlendirilir. Her adayı gördükten sonra, o adayı seçme veya reddetme kararı verilmelidir. 
              Bir aday reddedildikten sonra bir daha geri dönülemez. Amaç, en iyi adayı seçmektir.
            </p>
            
            <h3>Optimal Strateji: %37 Kuralı</h3>
            <p>
              Matematiksel olarak kanıtlanmıştır ki, en iyi strateji şudur:
            </p>
            <ol>
              <li>İlk n/e (%37) adayı sadece gözlemleyin ve hiçbirini seçmeyin.</li>
              <li>Bu gözlem aşamasında gördüğünüz en iyi adayın puanını belirleyin.</li>
              <li>Gözlem aşamasından sonra, bu eşik değerini aşan ilk adayı seçin.</li>
            </ol>
            <p>
              Bu strateji, büyük sayılar için en iyi adayı seçme olasılığını yaklaşık %37'ye çıkarır, 
              ki bu rastgele seçimden çok daha iyidir.
            </p>
            
            <h3>Gerçek Hayatta Uygulamalar</h3>
            <p>
              Bu algoritma şu durumlarda kullanılabilir:
            </p>
            <ul>
              <li>İş başvurularında aday seçimi</li>
              <li>Ev veya araba alımında en iyi seçeneği bulma</li>
              <li>Romantik ilişkilerde partner seçimi</li>
              <li>Yatırım kararları</li>
            </ul>
            
            <h3>Bu Uygulamanın Kullanımı</h3>
            <p>
              Bu uygulama, optimal durma algoritmasını interaktif bir şekilde deneyimlemenizi sağlar:
            </p>
            <ol>
              <li><strong>Ayarlar:</strong> Toplam aday sayısını ve değerlendirme kriterlerini belirleyin.</li>
              <li><strong>Gözlem Aşaması:</strong> İlk %37 adayı sadece gözlemleyin.</li>
              <li><strong>Seçim Aşaması:</strong> Gözlem aşamasında gördüğünüz en iyi adaydan daha iyi bir aday gördüğünüzde, algoritma size bu adayı seçmenizi önerecektir.</li>
              <li><strong>Sonuçlar:</strong> Seçiminizin kalitesini ve tüm adaylar arasındaki sıralamasını görün.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;