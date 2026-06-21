export default function Footer({ setView }) {
  return (
    <footer className="mt-16 bg-white border-t border-gray-200 text-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="text-2xl font-bold tracking-tight text-gray-900 select-none">
            ÖzYıldırım
          </div>
          <div className="text-xs font-semibold text-[#0056b3] tracking-widest uppercase mb-4 mt-[-2px]">
            Rent A Car
          </div>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            Güvenilir ve modern araç kiralama deneyimi.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 text-sm font-medium text-gray-600">
          <span onClick={() => setView('about')} className="hover:text-[#0056b3] transition-colors cursor-pointer">Hakkımızda</span>
          <span onClick={() => setView('contact')} className="hover:text-[#0056b3] transition-colors cursor-pointer">İletişim</span>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col items-center md:flex-row justify-between text-xs text-gray-500">
          <div>© 2026 ÖzYıldırım Rent A Car. Tüm hakları saklıdır.</div>
        </div>
      </div>
    </footer>
  );
}
