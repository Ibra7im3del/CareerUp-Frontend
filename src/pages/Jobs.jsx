import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase, Building2, ArrowRight, Heart, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { fetchJobs, fetchSavedJobs, saveJob, unsaveJob } from "../services/api";
import JobModal from "../components/JobModal";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 9;

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("currentUser") || "null");
  } catch {
    return null;
  }
}

export default function Jobs() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const user = getStoredUser();
  const role = user?.userType;

  // حقول الكتابة (فورية) وقيمها بعد التأخير (اللي بتتبعت للسيرفر)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [debouncedSearch, setDebouncedSearch] = useState((searchParams.get("search") || "").trim());
  const [debouncedCity, setDebouncedCity] = useState((searchParams.get("city") || "").trim());
  const [jobType, setJobType] = useState("all");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);

  // نتيجة آخر طلب نجح، ومعاها مفتاح الطلب اللي جابها.
  // "جاري التحميل" بتتحسب من الفرق بين المفتاح الحالي ومفتاح النتيجة (من غير setState جوه الـ effect)
  const requestKey = `${debouncedSearch}|${debouncedCity}|${jobType}|${sort}|${page}`;
  const [result, setResult] = useState({
    key: null,
    jobs: [],
    totalCount: 0,
    totalPages: 1,
    failed: false,
  });
  const { jobs: jobsList, totalCount, totalPages } = result;
  const loading = result.key !== requestKey;
  const loadFailed = result.failed && !loading;

  const [selectedJob, setSelectedJob] = useState(null);
  const [savedJobIds, setSavedJobIds] = useState([]);

  // ننتظر 400ms بعد آخر حرف قبل ما نسأل السيرفر
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setDebouncedCity(selectedCity.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [searchTerm, selectedCity]);

  // تحميل الوظائف من السيرفر عند أي تغيير في الفلاتر أو الصفحة
  useEffect(() => {
    let cancelled = false;

    fetchJobs({
      search: debouncedSearch,
      location: debouncedCity,
      jobType: jobType === "all" ? undefined : jobType,
      sort,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    }).then((data) => {
      if (cancelled) return;

      if (!data) {
        setResult((prev) => ({ ...prev, key: requestKey, failed: true }));
        return;
      }

      const list = data.jobs ?? [];
      // لو الصفحة الحالية بقت فاضية (مثلاً بعد حذف وظايف) نرجع لآخر صفحة موجودة
      if (list.length === 0 && page > 1 && data.totalPages > 0) {
        setPage(data.totalPages);
        return;
      }

      setResult({
        key: requestKey,
        jobs: list,
        totalCount: data.totalCount ?? 0,
        totalPages: data.totalPages ?? 1,
        failed: false,
      });
    });

    // لو جه طلب أحدث قبل ما ده يخلص، نتجاهل نتيجة القديم
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, debouncedCity, jobType, sort, page, requestKey]);

  // المحفوظات من السيرفر (للباحث عن عمل فقط)
  useEffect(() => {
    if (role !== "JobSeeker") return;
    fetchSavedJobs()
      .then((list) => setSavedJobIds(list.map((j) => j.id)))
      .catch((err) => console.error("Failed to load saved jobs:", err));
  }, [role]);

  const toggleSaveJob = async (jobId, e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    const wasSaved = savedJobIds.includes(jobId);
    setSavedJobIds((prev) => (wasSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]));
    try {
      if (wasSaved) await unsaveJob(jobId);
      else await saveJob(jobId);
    } catch (err) {
      console.error("Failed to update saved job:", err);
      setSavedJobIds((prev) => (wasSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId)));
    }
  };

  const changeJobType = (value) => {
    setJobType(value);
    setPage(1);
  };

  const changeSort = (value) => {
    setSort(value);
    setPage(1);
  };

  const changePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    searchTerm !== "" || selectedCity !== "" || jobType !== "all" || sort !== "newest";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCity("");
    setDebouncedSearch("");
    setDebouncedCity("");
    setJobType("all");
    setSort("newest");
    setPage(1);
  };

  const jobTypeOptions = [
    ["all", t.filterAll],
    ["Full-time", t.fullTime],
    ["Part-time", t.partTime],
    ["Remote", t.remote],
    ["Hybrid", t.hybrid],
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          {t.jobsTitle}
        </h1>
        <p className="text-sky-100 text-sm md:text-base font-medium max-w-xl mx-auto">
          {t.jobsSubtitle}
        </p>
      </div>

      <div className="bg-[#FDFDFE] p-3 rounded-2xl md:rounded-full border border-sky-100 shadow-xl max-w-3xl mx-auto flex flex-col md:flex-row gap-2 items-center text-slate-800 mb-6">
        <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-3 rounded-xl md:rounded-full w-full">
          <Search className="text-[#0099FF] w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-800 w-full placeholder-slate-400 text-sm font-medium"
          />
        </div>
        <div className="flex items-center gap-2.5 bg-slate-100 px-4 py-3 rounded-xl md:rounded-full w-full">
          <MapPin className="text-[#0099FF] w-5 h-5 shrink-0" />
          <input
            type="text"
            placeholder={t.cityPlaceholder}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-800 w-full placeholder-slate-400 text-sm font-medium"
          />
        </div>
      </div>

      {/* الفلاتر والترتيب */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {jobTypeOptions.map(([value, label]) => (
            <button
              key={value}
              onClick={() => changeJobType(value)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition shadow-sm ${
                jobType === value
                  ? "bg-slate-950 text-white"
                  : "bg-white/80 text-slate-700 hover:bg-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-white text-xs font-bold" htmlFor="sort">
            {t.sortLabel}
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => changeSort(e.target.value)}
            className="bg-white/90 text-slate-800 text-xs font-bold px-4 py-2 rounded-full outline-none shadow-sm"
          >
            <option value="newest">{t.sortNewest}</option>
            <option value="oldest">{t.sortOldest}</option>
          </select>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-white hover:underline text-xs font-bold"
            >
              <X className="w-3.5 h-3.5" />
              {t.clearFilters}
            </button>
          )}
        </div>
      </div>

      {!loadFailed && !loading && (
        <p className="text-sky-100 text-xs font-bold mb-4">
          {totalCount} {t.resultsFound}
        </p>
      )}

      {loadFailed ? (
        <div className="text-center py-12">
          <p className="text-white text-base font-bold">{t.jobsLoadError}</p>
        </div>
      ) : (
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          {jobsList.length > 0 ? (
            jobsList.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              return (
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
                      <div className="flex items-center gap-2">
                        {role !== "Employer" && (
                          <button
                            onClick={(e) => toggleSaveJob(job.id, e)}
                            className={`p-2 rounded-xl transition ${
                              isSaved
                                ? "bg-rose-50 text-rose-500"
                                : "bg-slate-100 text-slate-400 hover:text-slate-600"
                            }`}
                            title={isSaved ? t.savedLabel : t.saveJob}
                          >
                            <Heart className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                          </button>
                        )}
                        <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                          {job.jobType}
                        </span>
                      </div>
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
                    {role !== "Employer" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                        }}
                        className="bg-slate-950 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md"
                      >
                        <span>{t.applyBtn}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            !loading && (
              <div className="col-span-full text-center py-12">
                <p className="text-white text-base font-bold">{t.noJobs}</p>
              </div>
            )
          )}
        </div>
      )}

      {!loadFailed && <Pagination page={page} totalPages={totalPages} onChange={changePage} />}

      {selectedJob && (
        <JobModal key={selectedJob.id} job={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
}