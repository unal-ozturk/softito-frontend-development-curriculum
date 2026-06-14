import { useState } from "react";
import ProductCard from "./components/ProductCard";

const PRODUCTS = [
  {
    id: 1,
    name: "Kablosuz Klavye",
    category: "Aksesuar",
    price: 750,
    stock: 12,
  },
  {
    id: 2,
    name: "Oyuncu Faresi",
    category: "Aksesuar",
    price: 600,
    stock: 5,
  },
  {
    id: 3,
    name: "Full HD Monitör",
    category: "Ekran",
    price: 3200,
    stock: 3,
  },
  {
    id: 4,
    name: "Bluetooth Kulaklık",
    category: "Ses",
    price: 900,
    stock: 8,
  },
  {
    id: 5,
    name: "Taşınabilir SSD",
    category: "Depolama",
    price: 1500,
    stock: 15,
  },
  {
    id: 6,
    name: "Oyuncu Kulaklığı",
    category: "Ses",
    price: 1200,
    stock: 4,
  },
];

export default function App() {
  // aramadaki kelimeyi tutmak için
  const [searchQuery, setSearchQuery] = useState("");
  // arama özelliği (aynı zamanda arama öncesi tüm ürünler çıkıyor)
  const filteredProducts = PRODUCTS.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      id="app-root"
      className="bg-[#fcfdfe] min-h-screen text-gray-800 font-sans py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-xl mx-auto space-y-6">
        <div id="header-section" className="border-b border-gray-100 pb-4">
          <h1 className="text-xl font-bold text-gray-900">
            Demo 11: E-Ticaret Sepet Paneli
          </h1>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">
            Bu projede JSX, props, eventler, listeler ve koşullu rendering
            konularını tek bir yapıda birleştiriyoruz.
          </p>
        </div>

        {/* arama yeri */}
        <div
          id="search-box"
          className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3"
        >
          <h2 className="text-sm font-bold text-gray-700">Ürün Ara</h2>

          <input
            id="search-input"
            type="text"
            placeholder="Ürün adı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50/50 border border-gray-200 rounded px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* ürün bölümü */}
        <div id="product-list-section" className="space-y-4">
          <h2 className="text-base font-bold text-gray-900 px-1">
            Ürün Listesi
          </h2>

          {filteredProducts.length > 0 ? (
            <div className="flex flex-col gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  category={product.category}
                  price={product.price}
                  stock={product.stock}
                />
              ))}
            </div>
          ) : (
            <div
              id="empty-state"
              className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-8 text-center text-gray-500 text-sm"
            >
              Aradığınız kriterlere uygun ürün bulunamadı.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
