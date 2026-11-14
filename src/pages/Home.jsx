import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  // حالات لتخزين قيم البحث
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  // دالة التعامل مع إرسال البحث
  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchTerm)}&city=${encodeURIComponent(selectedCity)}`);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center px-4 py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center">

        {/* Title: أبيض بالكامل وكلمة CAREERS بنفس لون زرار البحث (slate-950) */}
        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 drop-shadow-md">
          {lang === 'ar' ? (
            <>
              نصنع مسارات <span className="text-slate-950">مهنية</span>،<br />
              وليس مجرد أرقام
            </>
          ) : (
            <>
              WE GROW <span className="text-slate-950">CAREERS</span>,<br />
              NOT JUST NUMBERS
            </>
          )}
        </h1>

        <p className="text-sky-100 text-base md:text-lg max-w-xl mx-auto mb-10 font-medium leading-relaxed">
          {t.desc}
        </p>

        {/* Search Bar Container */}
        <form onSubmit={handleSearch} className="bg-[#FDFDFE] p-3 rounded-2xl md:rounded-full border border-sky-100 shadow-2xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2 items-center text-slate-800">
          <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-3.5 rounded-xl md:rounded-full w-full">
            <Search className="text-[#0099FF] w-5 h-5 shrink-0" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-800 w-full placeholder-slate-400 text-sm font-medium"
            />
          </div>

          <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-3.5 rounded-xl md:rounded-full w-full">
            <MapPin className="text-[#0099FF] w-5 h-5 shrink-0" />
            <input
              type="text"
              placeholder={t.cityPlaceholder}
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-800 w-full placeholder-slate-400 text-sm font-medium"
            />
          </div>

          <button type="submit" className="w-full md:w-auto bg-slate-950 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-xl md:rounded-full transition flex items-center justify-center gap-2 shrink-0 shadow-lg active:scale-95">
            <span>{t.searchBtn}</span>
            {/* في العربي السهم بيتقلب عشان يشاور لاتجاه القراءة */}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
}