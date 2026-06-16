import { useState, useMemo, useEffect, useCallback } from "react";
import Baslik from "./components/Baslik";
import KampanyaBanner from "./components/KampanyaBanner";
import UrunListesi from "./components/UrunListesi";
import UrunDetayi from "./components/UrunDetayi";
import SepetGezgini from "./components/SepetGezgini";

export default function App() {
  const [products, setProducts] = useState([]); // gelecek tüm ürün listesi
  const [sepet, setSepet] = useState([]); //sepete eklenen ürünleri ve adetlerini tutan dizi
  const [sepetAcik, setSepetAcik] = useState(false); // sepet penceresi açık/kapalı
  const [loading, setLoading] = useState(true); // sayfa yüklenmesi durum kontrolü
  const [error, setError] = useState(null); //hata ihtimaline karşı saklanan veriler
  const [selectedProductId, setSelectedProductId] = useState(null); //detaya bakılmak istenen ürünün IDsi
  const [currentCategory, setCurrentCategory] = useState("all"); //seçilen ürün kategorisi (default: all)
  const [searchTerm, setSearchTerm] = useState(""); //arama kutusuna yazılan veri burada tutuluyor

  // useEffect ile veri
  useEffect(() => {
    fetch("/urunler.json")
      .then((res) => { //veri çekilemezse hata ver
        if (!res.ok) {
          throw new Error(`Katalog yüklenemedi. Sunucu hata kodu: ${res.status}`); 
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data); //ürünleri kaydet
        setLoading(false); //sayfa yüklenme yapısı durum bilgisini sonlandır
      })
      .catch((err) => {
        setError(err.message); //hata oluştuysa hata mesajını kayıtta tut
        setLoading(false);
      });
  }, []); // [] işlem olmazsa boş dönsün VE bu yapı toplamda bir kere çalışsın (sayfa açılışında)

  const displayProducts = useMemo(() => {
    const filtered = currentCategory === "all" //kategoriye göre ürün listele
      ? products
      : products.filter((item) => item.kategori === currentCategory);

    return filtered.map((item) => { //kalan stok durumunu sepet durumuna göre güncelle
      const sepetUrun = sepet.find((c) => c.id === item.id); //ürün sepette mi kontrol ediyoruz
      const sepetAdet = sepetUrun ? sepetUrun.adet : 0; //urun varsa adet ver yoksa 0 yaz
      return {
        ...item,
        stok: Math.max(0, item.stok - sepetAdet)
      };
    });
  }, [products, currentCategory, sepet]); //3 durum/yapı için değişiklikleri takip et ve hesapla

  const selectedProduct = useMemo(() => { //seçili ürünün detaylarını getir (id ile eşleştir/bul)
    return displayProducts.find((p) => p.id === selectedProductId) || null;
  }, [displayProducts, selectedProductId]);

  const handleSepeteEkle = useCallback((urun) => { //sepete yeni ürün ekleme
    if (urun.stok <= 0) return; 

    setSepet((prevSepet) => {
      const varOlan = prevSepet.find((item) => item.id === urun.id);
      if (varOlan) { //bir ürün varsa (prev ile urun idleri eşleşen ürün), onun adet bilgisini arttır
        return prevSepet.map((item) =>
          item.id === urun.id ? { ...item, adet: item.adet + 1 } : item
        );
      }
      return [...prevSepet, { id: urun.id, ad: urun.ad, fiyat: urun.fiyat, adet: 1 }]; //yoksa sepete yeni bir yapı olarak ekle (1 adet)
    });
  }, []);


  const handleAdetGuncelle = useCallback((productId, yeniAdet) => { //sepetteki ürün miktarını güncelleme
    const anaUrun = products.find((p) => p.id === productId); //orijinal stok durumu kontrolü
    if (!anaUrun) return;

    if (yeniAdet <= 0) {
      setSepet((prev) => prev.filter((item) => item.id !== productId));
      return; //adet 0 altındaysa ürünü filtrele(sil)
    }

    if (yeniAdet > anaUrun.stok) {
      alert(`Üzgünüz, bu üründen en fazla ${anaUrun.stok} adet ekleyebilirsiniz.`);
      return; //ürünün sepetteki sayısı, orijinal sayıyı geçerse bununla ilgili uyarı ver
    }

    setSepet((prev) => //üstteki durumlardan sonra sepet adet bilgisini güncelle
      prev.map((item) =>
        item.id === productId ? { ...item, adet: yeniAdet } : item
      )
    );
  }, [products]); //ilk verilerin tutulduğu yerdeki bilgiler değiştikçe bu yapı güncellenir

  const handleUrunCikar = useCallback((productId) => {
    setSepet((prev) => prev.filter((item) => item.id !== productId));
  }, []); //ürün kaldırma yöntemi (filter-sil) id uyuşmayan ürünler listelenecek ve id uyuşan veri gösterilmeyecek

  const handleCategoryChange = useCallback((newCat) => {
    setCurrentCategory(newCat); //kategori değişimi durumunda ilgili kategorinin atanmasını sağlayan yapı
  }, []);

  // artık mantık ve yapı hazır, componentten gelen yapıları props ile ilgili yerlere işleyip çıktılama işlemini gerçekleştiriyoruz ve props için gereken bilgileri ilgili yerlere iletiyoruz
  return (
    <div className="app-container">
      <Baslik
        env={currentCategory}
        sepetAdedi={sepet.reduce((sum, item) => sum + item.adet, 0)}
        onSepetAc={() => setSepetAcik(true)}
        searchVal={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <KampanyaBanner />

      <UrunListesi
        products={displayProducts}
        loading={loading}
        error={error}
        activeCategory={currentCategory}
        onCategoryChange={handleCategoryChange}
        onSelectProduct={(item) => setSelectedProductId(item.id)}
        onSepeteEkle={handleSepeteEkle}
        searchTerm={searchTerm}
      />

      <SepetGezgini
        sepet={sepet}
        isOpen={sepetAcik}
        onClose={() => setSepetAcik(false)}
        onAdetGuncelle={handleAdetGuncelle}
        onUrunCikar={handleUrunCikar}
      />

      {selectedProductId && (
        <UrunDetayi
          product={selectedProduct}
          onClose={() => setSelectedProductId(null)}
          onSepeteEkle={handleSepeteEkle}
        />
      )}
    </div>
  );
}
