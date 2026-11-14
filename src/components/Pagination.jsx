import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Pagination({ page, totalPages, onChange }) {
  const { t } = useLanguage();
  if (totalPages <= 1) return null;

  // 1 ... 4 5 6 ... 20 : الأولى والأخيرة والحالية وجيرانها
  const items = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) items.push(i);
    else if (items[items.length - 1] !== "...") items.push("...");
  }

  const navBtn =
    "flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold bg-white/90 text-slate-800 hover:bg-white shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 mt-10" aria-label="Pagination">
      <button className={navBtn} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
        <span>{t.prevPage}</span>
      </button>

      {items.map((item, idx) =>
        item === "..." ? (
          <span key={`dots-${idx}`} className="px-1 text-white font-bold">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={`w-9 h-9 rounded-full text-xs font-black transition shadow-md ${
              item === page
                ? "bg-slate-950 text-white"
                : "bg-white/90 text-slate-800 hover:bg-white"
            }`}
          >
            {item}
          </button>
        )
      )}

      <button className={navBtn} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        <span>{t.nextPage}</span>
        <ChevronRight className="w-4 h-4 rtl:rotate-180" />
      </button>
    </nav>
  );
}