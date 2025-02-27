import React from 'react';
import '../styles/main.css';

interface InfoProps {
  onClose: () => void;
}

const Info: React.FC<InfoProps> = ({ onClose }) => {
  return (
    <div className="info-container">
      <header className="info-header">
        <h1>Optimal Durma Problemi Hakkında</h1>
        <button className="close-button" onClick={onClose}>✕</button>
      </header>
      
      <div className="info-content">
        <section className="info-section">
          <h2>Optimal Durma Problemi (Sekreter Problemi) Nedir?</h2>
          <p>
            Optimal Durma Problemi, sırayla gelen seçenekler arasından en iyi seçimi yapmak için
            matematiksel bir stratejidir. Bu problem, "Sekreter Problemi", "Evlilik Problemi" veya
            "En İyi Seçim Problemi" olarak da bilinir.
          </p>
        </section>

        <section className="info-section">
          <h2>Problem Tanımı</h2>
          <p>
            Bir dizi aday (n adet) sırayla değerlendirilir. Her adayı gördükten sonra, o adayı seçme
            veya reddetme kararı verilmelidir. Bir aday reddedildikten sonra bir daha geri
            dönülemez. Amaç, en iyi adayı seçmektir.
          </p>
        </section>

        <section className="info-section">
          <h2>Optimal Strateji: %37 Kuralı</h2>
          <p>Matematiksel olarak kanıtlanmıştır ki, en iyi strateji şudur:</p>
          <ul className="info-list">
            <li>İlk n/e (%37) adayı sadece gözlemleyin ve hiçbirini seçmeyin.</li>
            <li>Bu gözlem aşamasında gördüğünüz en iyi adayın puanını belirleyin.</li>
            <li>Gözlem aşamasından sonra, bu eşik değerini aşan ilk adayı seçin.</li>
          </ul>
          <p>
            Bu strateji, büyük sayılar için en iyi adayı seçme olasılığını yaklaşık %37'ye çıkarır, ki bu
            rastgele seçimden çok daha iyidir.
          </p>
        </section>

        <section className="info-section">
          <h2>Gerçek Hayatta Uygulamalar</h2>
          <ul className="info-list">
            <li>İş başvurularında aday seçimi</li>
            <li>Ev veya araba alımında en iyi seçeneği bulma</li>
            <li>Romantik ilişkilerde partner seçimi</li>
            <li>Yatırım kararları</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>Bu Uygulamanın Kullanımı</h2>
          <p>Bu uygulama, optimal durma algoritmasını interaktif bir şekilde deneyimlemenizi sağlar. İşte adım adım nasıl kullanacağınız:</p>
          
          <h3>1. Başlangıç Ayarları</h3>
          <ul className="info-list">
            <li>Önce toplam aday sayısını belirleyin (örneğin: 10, 20, 30)</li>
            <li>Değerlendirme kriterlerini seçin (örneğin: tecrübe, eğitim, iletişim becerisi)</li>
            <li>"Başla" butonuna tıklayarak süreci başlatın</li>
          </ul>

          <h3>2. Gözlem Aşaması (%37)</h3>
          <ul className="info-list">
            <li>İlk %37'lik dilimde sadece adayları inceleyin</li>
            <li>Bu aşamada hiçbir adayı seçmeyin, sadece puanlarını aklınızda tutun</li>
            <li>Ekranda kaç aday daha gözlemlemeniz gerektiği gösterilecektir</li>
            <li>Her aday için verilen kriterlere göre puanları göreceksiniz</li>
          </ul>

          <h3>3. Seçim Aşaması</h3>
          <ul className="info-list">
            <li>Gözlem aşaması bittikten sonra, her aday için iki seçeneğiniz olacak:</li>
            <li>"Seç" butonu: Eğer aday, gözlem aşamasında gördüğünüz en iyi adaydan daha iyiyse</li>
            <li>"Geç" butonu: Eğer daha iyi bir aday beklemeye karar verirseniz</li>
            <li>Bir adayı seçtiğiniz anda süreç sona erer</li>
          </ul>

          <h3>4. Sonuçlar</h3>
          <ul className="info-list">
            <li>Seçiminizden sonra detaylı bir analiz göreceksiniz</li>
            <li>Seçtiğiniz adayın tüm adaylar arasındaki sıralaması</li>
            <li>Optimal stratejiyi ne kadar iyi uyguladığınız</li>
            <li>Seçiminizin başarı yüzdesi</li>
          </ul>

          <div className="info-tips">
            <h3>İpuçları</h3>
            <ul className="info-list">
              <li>Gözlem aşamasında gördüğünüz en yüksek puanlı adayı referans alın</li>
              <li>Acele etmeyin, her adayı dikkatle değerlendirin</li>
              <li>Son adaya kadar beklemeyin, çünkü son aday en iyi olmayabilir</li>
              <li>Stratejinizi tutarlı bir şekilde uygulayın</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Info;
