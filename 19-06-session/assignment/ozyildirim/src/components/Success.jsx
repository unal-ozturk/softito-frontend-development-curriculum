import { Check, Car } from 'lucide-react';

export default function Success({ 
  vehicle,
  onHomeClick, 
  setView }) {
    
  if (!vehicle) {
    setView('home');
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-16">
      <div className="card w-full p-12 flex flex-col items-center text-center">
        
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8 border-4 border-[#0056b3]/10">
          <Check className="w-12 h-12 text-[#0056b3] stroke-[3]" />
        </div>

        <h1 className="page-title mb-4">Rezervasyonunuz Onaylandı</h1>
        
        <p className="text-gray-600 mb-8 max-w-md">
          {vehicle.title} aracınız için talebiniz alınmıştır. Müşteri temsilcilerimiz en kısa sürede sizinle iletişime geçecektir.
        </p>

        <div className="bg-gray-50 w-full max-w-md p-6 rounded-xl border border-gray-100 flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-[#0056b3]">
              <Car className="w-6 h-6" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Rezerve Edilen Araç</span>
              <span className="text-lg font-bold text-gray-900">{vehicle.title}</span>
            </div>
          </div>
          <span className="bg-blue-100 text-[#0056b3] text-xs font-bold px-3 py-1.5 rounded-full">
            Onay Bekliyor
          </span>
        </div>

        <button onClick={onHomeClick} className="btn-primary min-w-[200px]">
          Ana Sayfaya Dön
        </button>

      </div>
    </div>
  );
}
