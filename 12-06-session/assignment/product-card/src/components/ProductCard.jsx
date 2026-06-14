export default function ProductCard({ name, category, price, stock }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3 flex flex-col justify-between">
      <div className="space-y-1.5">
        <h3 className="text-gray-900 font-bold text-lg">{name}</h3>
        <p className="text-gray-500 text-sm">
          Kategori:{" "}
          <span className="font-semibold text-gray-700">{category}</span>
        </p>
        <p className="text-blue-600 font-bold text-base">Fiyat: {price} TL</p>

        <div className="pt-1">
          <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-100 px-2.5 py-0.5 rounded text-xs font-semibold">
            Stok: {stock} adet
          </span>
        </div>
      </div>

      <div className="pt-2">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-md text-sm transition-colors duration-150 cursor-pointer">
          Sepete Ekle
        </button>
      </div>
    </div>
  );
}
