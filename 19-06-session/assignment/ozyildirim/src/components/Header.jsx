import { Search, Moon, Sun } from 'lucide-react';

export default function Header({
  setView,
  searchQuery,
  setSearchQuery,
  darkMode,
  setDarkMode
}) {

  const handleLogoClick = () => {
    setView('home');
    setSearchQuery('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setView('home');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">

        <div
          onClick={handleLogoClick}
          className="cursor-pointer select-none group"
        >
          <div className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-[#0056b3] transition-colors">
            ÖzYıldırım
          </div>
          <div className="text-[10px] font-semibold text-[#0056b3] tracking-widest uppercase mt-[-2px]">
            Rent A Car
          </div>
        </div>

        <div className="flex-1 max-w-2xl hidden md:block px-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-gray-900 focus:bg-white focus:border-[#0056b3] outline-none transition-all"
              placeholder="Araç arayın (Örn: Fiat, Otomatik, Benzin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>


        <nav className="hidden md:flex gap-6 text-sm font-semibold text-gray-700 items-center">

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          <button onClick={() => setView('about')} className="hover:text-[#0056b3] transition-colors">
            Hakkımızda
          </button>

          <button onClick={() => setView('contact')} className="hover:text-[#0056b3] transition-colors">
            İletişim
          </button>

        </nav>

      </div>

      <div className="md:hidden px-4 pb-4 bg-white border-b border-gray-200">
        <form onSubmit={handleSearchSubmit} className="relative mb-3">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-12 pr-4 text-gray-900 focus:bg-white focus:border-[#0056b3] outline-none transition-all"
            placeholder="Araç arayın..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        <nav className="flex gap-4 text-sm font-semibold text-gray-700 justify-center">
          <button onClick={() => setView('about')} className="hover:text-[#0056b3] transition-colors">Hakkımızda</button>
          <button onClick={() => setView('contact')} className="hover:text-[#0056b3] transition-colors">İletişim</button>
        </nav>
      </div>
    </header>
  );
}
