import { useState, useEffect } from "react";
import { Briefcase, Building2, MapPin, Heart } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { fetchSavedJobs, unsaveJob } from "../services/api";
import JobModal from "../components/JobModal";

export default function SavedJobs() {
  const { t } = useLanguage();
  const [savedJobsList, setSavedJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchSavedJobs()
      .then(setSavedJobsList)
      .catch((err) => console.error("Failed to load saved jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  const removeSavedJob = async (job, e) => {
    e.stopPropagation();
    const previous = savedJobsList;
    setSavedJobsList((list) => list.filter((j) => j.id !== job.id));
    try {
      await unsaveJob(job.id);
    } catch (err) {
      console.error("Failed to remove saved job:", err);
      setSavedJobsList(previous);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          {t.savedTitle}
        </h1>
        <p className="text-sky-100 text-sm md:text-base font-medium max-w-xl mx-auto">
          {t.savedSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-16 text-white font-bold">{t.loadingGeneric}</div>
        ) : savedJobsList.length > 0 ? (
          savedJobsList.map((job) => (
            <div
              key={job.id}
              onClick={() => setSelectedJob(job)}
              className="bg-[#FDFDFE]/95 backdrop-blur-md border border-white/80 p-6 rounded-3xl shadow-xl hover:shadow-2xl transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-sky-100 text-[#0099FF] p-3 rounded-2xl group-hover:scale-110 transition">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <button
                    onClick={(e) => removeSavedJob(job, e)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                    title={t.removeSaved}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <h3 className="text-lg font-black text-slate-950 mb-1">{job.title}</h3>
                <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold mb-4">
                  <Building2 className="w-3.5 h-3.5 text-[#0099FF]" />
                  <span>{job.company?.name}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-6">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-950 font-black text-sm" dir="auto">{job.salaryRange}</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  {t.savedLabel}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16">
            <Heart className="w-16 h-16 text-sky-200 mx-auto mb-4 opacity-50" />
            <p className="text-white text-lg font-bold mb-2">{t.noSaved}</p>
            <p className="text-sky-100 text-sm">{t.noSavedHint}</p>
          </div>
        )}
      </div>

      {selectedJob && (
        <JobModal key={selectedJob.id} job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}