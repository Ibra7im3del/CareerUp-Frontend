import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import API from "../services/axios";
import { useLanguage } from "../context/LanguageContext";

const inputCls =
  "bg-transparent border-none outline-none text-slate-800 text-xs w-full font-medium";
const boxCls =
  "flex items-center gap-2 bg-slate-100 px-3.5 py-3 rounded-xl border border-slate-200 focus-within:border-[#0099FF]";
const labelCls = "block text-slate-700 text-xs font-bold mb-1.5";

export default function PostJob() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [companyLocked, setCompanyLocked] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    companyName: "",
    location: "",
    jobType: "Full-time",
    salaryRange: "",
    description: "",
    requirements: "",
  });

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  // لو صاحب العمل عنده شركة بالفعل، نعبّي اسمها ونقفل الحقل
  useEffect(() => {
    API.get("/companies/mine")
      .then(({ data }) => {
        if (data?.name) {
          setFormData((prev) => ({ ...prev, companyName: data.name }));
          setCompanyLocked(true);
        }
      })
      .catch(() => {});
  }, []);

  const getErrorMessage = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) return t.notAllowedPost;
    const data = err.response?.data;
    if (typeof data?.message === "string") return data.message;
    if (data?.errors) return Object.values(data.errors).flat().join(" - ");
    return t.postError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/jobs", formData);
    } catch (err) {
      // رد حقيقي من السيرفر (صلاحيات/تحقق): نعرض الخطأ ومنكملش
      if (err.response) {
        setError(getErrorMessage(err));
        setLoading(false);
        return;
      }
      // السيرفر مش متصل: حفظ محلي للتجربة
      console.warn("Backend not connected, saving locally for simulation.");
      const existingJobs = JSON.parse(localStorage.getItem("customJobs") || "[]");
      const newJob = {
        id: Date.now(),
        title: formData.title,
        company: { name: formData.companyName },
        location: formData.location,
        jobType: formData.jobType,
        salaryRange: formData.salaryRange,
        description: formData.description,
        requirements: formData.requirements,
      };
      localStorage.setItem("customJobs", JSON.stringify([...existingJobs, newJob]));
    }

    setLoading(false);
    setSuccess(true);
    setTimeout(() => navigate("/jobs"), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          {t.postTitle}
        </h1>
        <p className="text-sky-100 text-sm md:text-base font-medium max-w-xl mx-auto">
          {t.postSubtitle}
        </p>
      </div>

      <div className="bg-[#FDFDFE] border border-sky-100 p-8 rounded-[2.5rem] shadow-2xl relative">
        {success ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-black text-slate-950 mb-2">{t.postedOk}</h3>
            <p className="text-slate-600 text-sm font-medium">{t.redirecting}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm p-3 rounded-xl text-center font-medium">
                {error}
              </div>
            )}

            <div>
              <label className={labelCls}>{t.jobTitleLabel}</label>
              <div className={boxCls}>
                <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                <input type="text" required placeholder={t.titlePh} value={formData.title} onChange={set("title")} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t.companyLabel}</label>
                <div className={`${boxCls} ${companyLocked ? "opacity-70" : ""}`}>
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    required
                    readOnly={companyLocked}
                    placeholder={t.companyPh}
                    value={formData.companyName}
                    onChange={set("companyName")}
                    className={inputCls}
                  />
                </div>
                {companyLocked && (
                  <p className="text-slate-400 text-[11px] font-medium mt-1">{t.companyLockedHint}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>{t.locationLabel}</label>
                <div className={boxCls}>
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="text" required placeholder={t.locationPh} value={formData.location} onChange={set("location")} className={inputCls} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{t.jobTypeLabel}</label>
                <select
                  value={formData.jobType}
                  onChange={set("jobType")}
                  className="w-full bg-slate-100 px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#0099FF] outline-none text-slate-800 text-xs font-medium"
                >
                  <option value="Full-time">{t.fullTime}</option>
                  <option value="Part-time">{t.partTime}</option>
                  <option value="Remote">{t.remote}</option>
                  <option value="Hybrid">{t.hybrid}</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>{t.salaryLabel}</label>
                <div className={boxCls}>
                  <DollarSign className="w-4 h-4 text-slate-400 shrink-0" />
                  <input type="text" required placeholder={t.salaryPh} value={formData.salaryRange} onChange={set("salaryRange")} className={inputCls} />
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>{t.descriptionLabel}</label>
              <div className="flex items-start gap-2 bg-slate-100 px-3.5 py-3 rounded-xl border border-slate-200 focus-within:border-[#0099FF]">
                <FileText className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                <textarea
                  rows="3"
                  required
                  placeholder={t.descriptionPh}
                  value={formData.description}
                  onChange={set("description")}
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>{t.requirementsLabel}</label>
              <input
                type="text"
                required
                placeholder={t.requirementsPh}
                value={formData.requirements}
                onChange={set("requirements")}
                className="w-full bg-slate-100 px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#0099FF] outline-none text-slate-800 text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-full text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              <span>{loading ? t.posting : t.publishJob}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}