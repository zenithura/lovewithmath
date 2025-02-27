import React from 'react';
import '../styles/main.css';

const Rules: React.FC = () => {
  return (
    <div className="rules-container">
      <div className="rules-content">
        <h2 className="rules-title">Oyun Kuralları</h2>
        
        <div className="rules-section">
          <h3>Temel Kurallar</h3>
          <ul className="rules-list">
            <li>Size sırayla adaylar gösterilecek</li>
            <li>Her adayı sadece bir kez göreceksiniz</li>
            <li>Her aday için ya "Seç" ya da "Geç" demelisiniz</li>
            <li>Bir adayı geçtikten sonra geri dönemezsiniz</li>
            <li>Bir adayı seçtiğinizde oyun biter</li>
          </ul>
        </div>

        <div className="rules-section">
          <h3>Kazanma Stratejisi</h3>
          <ul className="rules-list">
            <li>İlk %37 adayı sadece gözlemleyin</li>
            <li>Bu sürede gördüğünüz en iyi adayın puanını aklınızda tutun</li>
            <li>Kalan adaylardan, gözlem sürecinde gördüğünüz en iyi adaydan daha iyisini seçin</li>
          </ul>
        </div>

        <div className="rules-section highlight">
          <h3>Önemli Noktalar</h3>
          <ul className="rules-list">
            <li>Çok erken seçim yapmak risklidir</li>
            <li>Çok geç kalmak da risklidir</li>
            <li>Optimal strateji %37 kuralını takip etmektir</li>
            <li>Her adayı dikkatlice değerlendirin</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Rules;
