import { Settings, Fuel, Armchair, Luggage, CheckCircle2 } from 'lucide-react';

export default function VehicleDetail({
  vehicle, 
  onReserveClick, 
  setView }) {

  if (!vehicle) {
    setView('home');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      <div className="card overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="detail-image-wrapper">
            <img 
              src={vehicle.image} 
              alt={vehicle.title} 
              className="vehicle-image"
            />
          </div>
          <div className="p-8 flex-1 flex flex-col justify-center">
            <span className="inline-block bg-blue-50 text-[#0056b3] text-xs font-bold px-3 py-1 rounded-full w-max mb-4 border border-blue-100">
              {vehicle.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{vehicle.title}</h1>
            <p className="text-sm text-gray-500 mb-8">Ekonomik, geniş ve konforlu.</p>
            
            <div className="mt-auto">
              <div className="mb-4">
                <span className="price-text">{vehicle.price} ₺</span>
                <span className="price-label">/ Günlük</span>
              </div>
              <button onClick={onReserveClick} className="btn-primary w-full text-base">
                Rezervasyon Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card p-8 flex flex-col gap-6">
          <h3 className="section-title border-b border-gray-100 pb-4 mb-0">Araç Özellikleri & Hakkında</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="badge justify-center py-3"><Settings className="w-4 h-4 text-[#0056b3]" /> {vehicle.transmission}</div>
            <div className="badge justify-center py-3"><Fuel className="w-4 h-4 text-[#0056b3]" /> {vehicle.fuel}</div>
            <div className="badge justify-center py-3"><Armchair className="w-4 h-4 text-[#0056b3]" /> {vehicle.seats} Koltuk</div>
            <div className="badge justify-center py-3"><Luggage className="w-4 h-4 text-[#0056b3]" /> {vehicle.luggage}</div>
          </div>

          <p className="text-gray-600 leading-relaxed mt-2">
            {vehicle.description}
          </p>
        </div>

        <div className="card p-8 flex flex-col gap-6">
          <h3 className="section-title border-b border-gray-100 pb-4 mb-0">Ek Hizmetler</h3>
          <div className="flex flex-col gap-3">
            {vehicle.services.map((service, idx) => (
              <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="text-sm font-medium text-gray-700">{service}</span>
                <CheckCircle2 className="w-5 h-5 text-[#0056b3]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
