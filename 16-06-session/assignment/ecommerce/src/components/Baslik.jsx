import { useState, useEffect } from "react";
// burada ve app.jsx kısmında kullanacağımız props yapısını burada belirtiyoruz. React kullanımında props parent-child ilişkisinden ötürü props yapısının parent yapısından child/ren a aktarılması gerekir
export default function Baslik({ env, sepetAdedi, onSepetAc, searchVal, onSearchChange }) {
  // window en/boy durumuna dair bilgileri state yapısı ile hafızada tutuyoruz
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // burada useEffect durumu bir durumu veya olayı dinlemek için kullanılmış,cihazın farklı boyuta göre çözünürlüğü takip edilmiş ve üstteki state yapısı içerisinde aktarılmış
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
// burada handleResize fonksiyonunun hangi durumda çalışacağını belirledik (addEventListener -resize durumunda). Sonrasında ise hem useEffectin addEventListener ile kullanımından dolayı performans kaybı (memory leak) yaşanmaması için (çünkü işimiz tamamlandı), hem de bu durumun sistem tarafından sürekli tetiklenmemesi için removeEventListener ile durumu bitirmiş olduk
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // burada kategorileri sayfada yansıtırken uygun görünüme kavuşacak şekilde çıktılanmasını sağlıyoruz. örn: giyim yerine GİYİM olması gibi
  const getEnvName = (cat) => {
    if (cat === "all") return "TÜM KATEGORİLER";
    return cat.toUpperCase();
  };

  // burası bizim header dediğimiz başlık yapımız. burada hem başlık kısmının nasıl görüneceğine dair yapıyı ve stili yapılandırıyoruz, hem de props yapısını child/ren yapılarına aktarıyoruz
  return (
    <header className="eticaret-header">
      <div className="header-ust-alan">
        <div className="logo-alani">
          <div className="site-logo-link">HEPSİAL</div>
          <span className="site-logo-badge">STORE</span>
        </div>
        {/*anlık arama filtreleme ve bileşen dışına aktarımı için onChange ve value kullanıldı böylelikle app.jsx içinde iletişim halinde olup veri akışı sağlanacak (aynı zamanda gerçek zamanlı aramayı sağlıyor)  */}
        <div className="arama-alani">
          <input
            type="text"
            placeholder="Ürün, kategori veya marka ara..."
            value={searchVal}
            onChange={(e) => onSearchChange(e.target.value)}
            className="arama-input"
          />
          <button className="arama-butonu">Ara</button>
        </div>

        <div className="kullanici-kontrolleri">
          <div className="menu-linki">Giriş Yap</div>
          <div className="menu-linki">Siparişlerim</div>
          {/*sepetim butonuna tıklanınca aktif olacak ve sepet ekranı açılacak (tabi sepetAdedi geçerli ise) */}
          <button onClick={onSepetAc} className="sepet-tetikleyici">
            <span>🛒 Sepetim</span>
            {/* Conditional Rendering - sepetAdedi var ise görüntülenecek */}
            {sepetAdedi > 0 && (
              <span className="sepet-sayac-rozet">{sepetAdedi}</span>
            )}
          </button>
        </div>
      </div>
            {/* Ürün kategorisi ve ekran çözünürlüğü */}
      <div className="kategori-seridi">
        <span className="badge badge-gray">{getEnvName(env)}</span>
        <span className="detail-meta-label">| Çözünürlük: {windowSize.width}px</span>
      </div>
    </header>
  );
}
