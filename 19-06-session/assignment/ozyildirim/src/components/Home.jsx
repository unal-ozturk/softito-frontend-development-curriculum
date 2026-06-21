import { MOCK_CATEGORIES } from '../data.js';
import { Settings, Fuel } from 'lucide-react';

export default function Home({ 
  vehicles, 
  selectedCategory, 
  setSelectedCategory, 
  searchQuery, 
  onVehicleClick }) {
    
  
  const filteredVehicles = vehicles.filter(v => {
    const matchCat = selectedCategory === 'Tümü' || v.category === selectedCategory;
    const matchSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        v.transmission.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        v.fuel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <div className="card p-6 md:sticky md:top-28">
          <h2 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-4">Kategoriler</h2>
          <div className="flex flex-col gap-2">
            {MOCK_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`sidebar-item ${selectedCategory === cat ? 'sidebar-item-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex-1 w-full">
        <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
          <h1 className="section-title mb-0">Önerilen Araçlar</h1>
          <span className="text-sm font-medium text-gray-500">{filteredVehicles.length} araç bulundu</span>
        </div>

        {filteredVehicles.length === 0 ? (
          <div className="card p-12 text-center flex flex-col items-center justify-center text-gray-500">
            <p>Aradığınız kriterlere uygun araç bulunamadı.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="card flex flex-col">
                <div className="vehicle-image-wrapper">
                  <div className="absolute top-3 right-3 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-md shadow-sm z-10">
                    {vehicle.category}
                  </div>
                  <img 
                    src={vehicle.image} 
                    alt={vehicle.title} 
                    className="vehicle-image" 
                  />
                </div>
                
                <div className="card-body">
                  <h3 className="card-title mb-4">{vehicle.title}</h3>
                  
                  <div className="flex items-center gap-3 mb-6 flex-wrap">
                    <span className="badge"><Settings className="w-3.5 h-3.5 text-[#0056b3]" /> {vehicle.transmission}</span>
                    <span className="badge"><Fuel className="w-3.5 h-3.5 text-[#0056b3]" /> {vehicle.fuel}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="price-text">{vehicle.price} ₺</span>
                      <span className="price-label">/ gün</span>
                    </div>
                    
                    <button 
                      onClick={() => onVehicleClick(vehicle)}
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      İncele
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
