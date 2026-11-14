import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="bg-white/20 backdrop-blur-md border border-white/30 text-white w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
        <Compass className="w-10 h-10" />
      </div>
      <h1 className="text-7xl md:text-9xl font-black text-white tracking-tight drop-shadow-md" dir="ltr">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-black text-slate-950 mt-2 mb-3">{t.notFoundTitle}</h2>
      <p className="text-sky-100 text-sm md:text-base font-medium max-w-md mb-8">{t.notFoundText}</p>
      <Link
        to="/"
        className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-lg transition active:scale-95 flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>{t.backHome}</span>
      </Link>
    </div>
  );
}