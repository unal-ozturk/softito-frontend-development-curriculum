import { useMemo } from "react";

export default function SepetGezgini({
  sepet,
  isOpen,
  onClose,
  onAdetGuncelle,
  onUrunCikar
}) {
// setState gibi sıfırdan veri üretip hafızada tutmak yerine useMemo kullanarak mevcut veriyi işleyip yeni sonuç oluşturuyoruz ([sepet]). [sepet] -> kullanmazsak varsayılan olarak bir veri olmayacağı için ne eklersek ekleyelim uygun sonuç dönmeyecek. bu yapıyla sepet içindeki değişikliklerde fiyat hesaplamasını yapıyoruz ve hafıazada tutuyoruz. reduce kısmı ile fiyatları topluyoruz
  const toplamFiyat = useMemo(() => {
    return sepet.reduce((toplam, item) => toplam + item.fiyat * item.adet, 0);
  }, [sepet]);

  const kargoLimit = 1500;
  const kargoUcreti = toplamFiyat >= kargoLimit || toplamFiyat === 0 ? 0 : 50;
  const kalanTutar = Math.max(0, kargoLimit - toplamFiyat);
  const ilerlemeYuzdesi = Math.min((toplamFiyat / kargoLimit) * 100, 100);
    // sınıf toggle durumu. açıksa göster, değil ise gizle
  const drawerClass = `sepet-drawer ${isOpen ? "sepet-drawer-visible" : "sepet-drawer-hidden"}`;

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="drawer-arka-plan"></div>
      {/* X dışındaki alana da basıldığında ekran kapatılması için div elementine onclick atanmış*/}
      <div className={drawerClass}>
        <div>
          <div className="drawer-ust">
            <h3 className="app-card-title">Sepetim ({sepet.reduce((sum, item) => sum + item.adet, 0)} Ürün)</h3>
            <button onClick={onClose} className="drawer-kapat-btn">✕</button>
          </div>
          {/* koşulu sağlayan duruma göre görsel çıktı sağlanıyor */}
          {sepet.length > 0 && (
            <div className="sepet-kargo-ilerleme-kutusu">
              {toplamFiyat >= kargoLimit ? (
                <span className="sepet-kargo-ilerleme-metni">🎉 Kargonuz Bedava!</span>
              ) : (
                <span className="sepet-kargo-ilerleme-metni">
                  🚚 Kargo bedava için <strong>{kalanTutar.toFixed(2)} TL</strong> daha ekleyin!
                </span>
              )}
              <div className="ilerleme-bar-yolu">
                <div
                  className="ilerleme-bar-doluluk"
                  style={{ width: `${ilerlemeYuzdesi}%` }}
                ></div>
              </div>
            </div>
          )}
            {/* Ürün sepet/liste bilgisi - conditional rendering. sepet boşsa (length === 0) boş olduğu gözükecek ama dolu ise ona ait bilgiler listelenecek */}
          <div className="sepet-liste-alani">
            {sepet.length === 0 ? (
              <div className="sepet-bos-etiket">
                <span>Sepetiniz şu anda boş.</span>
              </div>
            ) : (
              sepet.map((item) => (
                <div key={item.id} className="sepet-urun-satir">
                  <div className="sepet-eleman-bilgi">
                    <span className="sepet-urun-ad">{item.ad}</span>
                    <span className="sepet-urun-fiyat">{item.fiyat.toFixed(2)} TL</span>
                    {/* ürün artırma/eksiltme işlemleri. o ürüne ait id ve adet bilgisi üzerinden işlem yapılıyor */}
                    <div className="sepet-adet-kontrolleri">
                      <button
                        onClick={() => onAdetGuncelle(item.id, item.adet - 1)}
                        className="sepet-adet-btn"
                      >
                        -
                      </button>
                      <span className="sepet-adet-yazi">{item.adet}</span>
                      <button
                        onClick={() => onAdetGuncelle(item.id, item.adet + 1)}
                        className="sepet-adet-btn"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* eşyanın toplam fiyatı ve eşyayı sepetten kaldırma butonu için oluşturulan yapı */}
                  <div className="sepet-satir-sag">
                    <span className="sepet-satir-toplam-fiyat">
                      {(item.fiyat * item.adet).toFixed(2)} TL
                    </span>
                    <button
                      onClick={() => onUrunCikar(item.id)}
                      className="sepet-satir-sil-btn"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
              {/* sepet doluysa fatura/ödeme ekranına dair bilgileri göster ve alışverişi tamamla */}
        {sepet.length > 0 && (
          <div className="sepet-alt-odeme-paneli">
            <div className="odeme-detay-satiri">
              <span className="detail-meta-label">Ara Toplam</span>
              <span className="detail-meta-val font-mono">{toplamFiyat.toFixed(2)} TL</span>
            </div>
            <div className="odeme-detay-satiri">
              <span className="detail-meta-label">Kargo Ücreti</span>
              <span className="detail-meta-val font-mono">
                {kargoUcreti === 0 ? "Bedava" : `${kargoUcreti.toFixed(2)} TL`}
              </span>
            </div>
            <div className="odeme-detay-satiri border-t border-slate-100 pt-3">
              <span className="app-card-title">Genel Toplam</span>
              <span className="odeme-genel-toplam">
                {(toplamFiyat + kargoUcreti).toFixed(2)} TL
              </span>
            </div>
            <div className="terminal-header">
              <button
                onClick={() => alert("Siparişiniz başarıyla alındı! (Simülasyon)")}
                className="btn btn-primary w-full"
              >
                Alışverişi Tamamla
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
