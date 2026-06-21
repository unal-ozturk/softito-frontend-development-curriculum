import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Phone, MapPin, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = (data) => {
    setIsSubmitted(true);
    reset();
  };

  return (
    <div className="layout-contact">
      
      <div className="page-header">
        <h1 className="page-title">İletişim</h1>
        <p className="page-subtitle">Bize ulaşmak için aşağıdaki formu doldurabilirsiniz. Size en kısa sürede dönüş yapacağız.</p>
      </div>

      <div className="card p-8 md:p-12 mb-8">
        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center text-center py-10">
            <CheckCircle2 className="w-16 h-16 text-[#0056b3] mb-4" />
            <h2 className="section-title mb-2">Mesajınız Alındı</h2>
            <p className="text-gray-600 mb-8">En kısa sürede müşteri temsilcilerimiz sizinle iletişime geçecektir.</p>
            <button onClick={() => setIsSubmitted(false)} className="btn-secondary">Yeni Mesaj Gönder</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="form-group max-w-2xl mx-auto w-full">
            <div>
              <label className="form-label">Ad Soyad</label>
              <input 
                type="text" 
                placeholder="Adınız Soyadınız" 
                className={`input-field ${errors.fullName ? 'input-error' : ''}`}
                {...register('fullName', { required: 'Ad Soyad alanı zorunludur' })}
              />
              {errors.fullName && <span className="form-error-text">⚠ {errors.fullName.message}</span>}
            </div>
            
            <div>
              <label className="form-label">E-posta Adresi</label>
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
              <label className="form-label">Mesajınız</label>
              <textarea 
                placeholder="Size nasıl yardımcı olabiliriz?" 
                className={`input-field min-h-[150px] resize-none ${errors.message ? 'input-error' : ''}`}
                {...register('message', { required: 'Mesaj alanı zorunludur' })}
              />
              {errors.message && <span className="form-error-text">⚠ {errors.message.message}</span>}
            </div>

            <button type="submit" className="btn-primary mt-2 flex justify-center items-center gap-2">
              Gönder
            </button>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full">
        <div className="card p-6 flex items-center gap-4">
          <div className="icon-wrapper">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Müşteri Hizmetleri</h3>
            <p className="text-gray-600 text-sm mt-1">0850 123 45 67</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="icon-wrapper">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Merkez Ofis</h3>
            <p className="text-gray-600 text-sm mt-1">Levent, İstanbul</p>
          </div>
        </div>
      </div>

    </div>
  );
}
