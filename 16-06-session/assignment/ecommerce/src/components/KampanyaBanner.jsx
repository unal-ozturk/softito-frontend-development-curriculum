import { useState, useEffect } from "react";
// Burası kampanya kısmımız. 
export default function KampanyaBanner() {
  const [secondsLeft, setSecondsLeft] = useState(3600 * 3 + 1200);

  //Timer yapısından dolayı useEffect kullandık ve timer için üstteki state yaptığımız süre 1in altına düşünce otomatik olarak tekrar başlayacak
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          return 3600 * 3 + 1200;
        }
        return prev - 1;
      });
    }, 1000);
// removeEventListener yapısına benzer bir mantık kullandık. Hem performans için hem de bu durum sayfada render edilmiyorsa, arka planda devam etmemesini sağlıyoruz (mount/unmount)
    return () => {
      clearInterval(timer);
    };
  }, []);

  // Saniye cinsinden verinin daha düzgün bir formata dökülmüş hali. 05:02:09 gibi bir yapıya sahip olacak 
  const formatCountdown = (totalSecs) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="slider-banner">
      <div className="slider-bilgi">
        <span className="slider-etiket">GÜNÜN FIRSATI</span>
        <h2 className="slider-baslik">Büyük Yaz İndirimleri Başladı!</h2>
        <p className="slider-detay">
          Tüm Elektronik, Giyim ve Kitaplarda sepette anında %40'a varan indirimleri kaçırmayın.
        </p>
      </div>
      {/* burada üstteki fonksiyon yapısına state verimizi gönderdik ve işledik */}
      <div className="slider-sayac">
        <span>⏰ Kalan Süre:</span>
        <span>{formatCountdown(secondsLeft)}</span>
      </div>
    </div>
  );
}
