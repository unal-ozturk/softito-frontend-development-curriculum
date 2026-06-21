import { useForm } from 'react-hook-form';

export default function Reservation({ 
  vehicle, 
  onSuccess, 
  setView }) {
    
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (!vehicle) {
    setView('home');
    return null;
  }

  const onSubmit = (data) => {
    onSuccess();
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 items-start">
      
      <div className="w-full md:w-1/3 flex flex-col gap-6">
        <div className="card overflow-hidden">
          <div className="aspect-[4/3] bg-gray-100 items-center overflow-hidden w-full flex">
            <img src={vehicle.image} alt={vehicle.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-6">
            <h3 className="card-title mb-1">{vehicle.title}</h3>
            <p className="text-sm text-gray-500 mb-6">{vehicle.category} • {vehicle.fuel}</p>
            
            <div className="grid grid-cols-2 gap-2 mb-6">
              <span className="badge"><span className="text-gray-400">Vites:</span> {vehicle.transmission}</span>
              <span className="badge"><span className="text-gray-400">Kapasite:</span> {vehicle.seats}</span>
            </div>

            <div className="border-t border-gray-100 pt-4">
              <span className="text-xs font-semibold text-gray-400 block mb-1">Günlük Kiralama Bedeli</span>
              <span className="text-3xl font-bold text-[#0056b3]">{vehicle.price} ₺</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        <div className="card p-8 md:p-12">
          <h2 className="section-title mb-2">Rezervasyon Bilgileri</h2>
          <p className="text-sm text-gray-500 mb-8">Lütfen kiralama işlemini tamamlamak için bilgilerinizi giriniz.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="form-group">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label">Adınız</label>
                <input 
                  type="text" 
                  placeholder="Örn: Ünal" 
                  className={`input-field ${errors.firstName ? 'input-error' : ''}`}
                  {...register('firstName', { 
                    required: 'Ad alanı zorunludur',
                    minLength: { value: 2, message: 'En az 2 karakter giriniz' }
                  })}
                />
                {errors.firstName && <span className="form-error-text">⚠ {errors.firstName.message}</span>}
              </div>
              
              <div>
                <label className="form-label">Soyadınız</label>
                <input 
                  type="text" 
                  placeholder="Örn: Öztürk" 
                  className={`input-field ${errors.lastName ? 'input-error' : ''}`}
                  {...register('lastName', { 
                    required: 'Soyad alanı zorunludur',
                    minLength: { value: 2, message: 'En az 2 karakter giriniz' }
                  })}
                />
                {errors.lastName && <span className="form-error-text">⚠ {errors.lastName.message}</span>}
              </div>
            </div>

            <div>
              <label className="form-label">E-Posta Adresi</label>
              <input 
                type="email" 
                placeholder="ornek@eposta.com" 
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                {...register('email', { 
                  required: 'E-posta adresi zorunludur',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Geçerli bir e-posta adresi giriniz"
                  }
                })}
              />
              {errors.email && <span className="form-error-text">⚠ {errors.email.message}</span>}
            </div>

            <div>
              <label className="form-label">Telefon Numarası</label>
              <input 
                type="tel" 
                placeholder="0 (555) 000 00 00" 
                className={`input-field ${errors.phone ? 'input-error' : ''}`}
                {...register('phone', { 
                  required: 'Telefon numarası zorunludur',
                  pattern: {
                    value: /^[0-9\-\+]{9,15}$/,
                    message: "Geçerli bir telefon numarası giriniz"
                  }
                })}
              />
              {errors.phone && <span className="form-error-text">⚠ {errors.phone.message}</span>}
            </div>

            <button type="submit" className="btn-primary mt-6 py-4 text-base">
              Rezervasyonu Tamamla
            </button>
            <p className="text-center text-xs text-gray-500 mt-2">Devam ederek kiralama şartlarını kabul etmiş olursunuz.</p>
          </form>
        </div>
      </div>
    </div>
  );
}
