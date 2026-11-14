import { useState } from "react";
import {
  Briefcase,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Link2,
  FileText,
  Calendar,
  MessageSquare,
  Globe,
  GitBranch,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { submitJobApplication } from "../services/api";

const emptyForm = {
  fullName: "",
  email: "",
  phone: "",
  country: "",
  experience: "",
  linkedinUrl: "",
  githubUrl: "",
  portfolioUrl: "",
  cvFile: null,
  coverLetter: "",
};

function Field({ label, icon: Icon, children, top = false }) {
  return (
    <div>
      <label className="block text-slate-700 text-xs font-bold mb-1">{label}</label>
      <div
        className={`flex ${
          top ? "items-start" : "items-center"
        } gap-2 bg-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:border-[#0099FF]`}
      >
        <Icon className={`w-4 h-4 text-slate-400 shrink-0 ${top ? "mt-1" : ""}`} />
        {children}
      </div>
    </div>
  );
}

const inputCls =
  "bg-transparent border-none outline-none text-slate-800 text-xs w-full font-medium";

export default function JobModal({ job, onClose }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const role = (() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "null")?.userType;
    } catch {
      return null;
    }
  })();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(emptyForm);

  if (!job) return null;

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const finish = () => {
    setIsApplying(false);
    setIsApplied(true);
    setTimeout(() => {
      setIsApplied(false);
      setFormData(emptyForm);
      onClose();
    }, 2000);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsApplying(true);
    setError("");

    try {
      await submitJobApplication({ ...formData, jobId: job.id });
      finish();
    } catch (err) {
      // لو السيرفر رد بخطأ حقيقي نعرضه، والـ fallback المحلي لانقطاع الاتصال فقط
      if (err.response) {
        setIsApplying(false);
        setError(
          err.response.status === 403
            ? t.notAllowed
            : err.response.data?.message || t.applyError
        );
        return;
      }
      console.warn("Backend not connected, saving application locally.");
      const existingApps = JSON.parse(localStorage.getItem("jobApplications") || "[]");
      const newApp = {
        id: Date.now(),
        jobTitle: job.title,
        companyName: job.company?.name || "",
        appliedDate: new Date().toISOString().split("T")[0],
        status: "Under Review",
      };
      localStorage.setItem("jobApplications", JSON.stringify([...existingApps, newApp]));
      setTimeout(finish, 1000);
    }
  };

  const requirements = (job.requirements || "")
    .split(",")
    .map((r) => r.trim())
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-[#FDFDFE] w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative border border-sky-100 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full">
        <button
          onClick={onClose}
          className="absolute top-6 end-6 text-slate-400 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isApplied ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-black text-slate-950 mb-2">{t.appSubmitted}</h3>
            <p className="text-slate-600 text-sm font-medium">
              {t.appSentTo} {job.company?.name}
            </p>
          </div>
        ) : !showApplyForm ? (
          <div>
            <div className="flex items-center gap-3 mb-4 pe-12">
              <div className="bg-sky-100 text-[#0099FF] p-3.5 rounded-2xl">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-950">{job.title}</h2>
                <p className="text-slate-500 text-xs font-bold">
                  {job.company?.name} • {job.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="bg-sky-50 text-[#0099FF] text-xs font-extrabold px-3 py-1 rounded-full border border-sky-100">
                {job.jobType}
              </span>
              <span className="bg-slate-100 text-slate-800 text-xs font-extrabold px-3 py-1 rounded-full">
                {job.salaryRange}
              </span>
            </div>

            <div className="mb-6">
              <h4 className="text-slate-900 font-bold text-sm mb-2">{t.jobDescription}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{job.description}</p>
            </div>

            <div className="mb-8">
              <h4 className="text-slate-900 font-bold text-sm mb-2">{t.requirements}</h4>
              <ul className="space-y-2">
                {requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0099FF]" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {role !== "Employer" && (
              <button
                onClick={() => (role ? setShowApplyForm(true) : navigate("/login"))}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{t.applyNow}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setShowApplyForm(false)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0099FF] hover:underline mb-4"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{t.backToDetails}</span>
            </button>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <h3 className="text-slate-950 font-black text-lg mb-1">
                {t.applyFor} {job.title}
              </h3>
              <p className="text-slate-500 text-xs font-medium mb-4">{job.company?.name}</p>

              <Field label={t.fullName} icon={User}>
                <input type="text" required value={formData.fullName} onChange={set("fullName")} className={inputCls} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={t.emailLabel} icon={Mail}>
                  <input type="email" dir="ltr" required placeholder="name@example.com" value={formData.email} onChange={set("email")} className={`${inputCls} text-start`} />
                </Field>
                <Field label={t.phone} icon={Phone}>
                  <input type="tel" dir="ltr" required placeholder="+20 10xxxxxxxx" value={formData.phone} onChange={set("phone")} className={`${inputCls} text-start`} />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={t.country} icon={Globe}>
                  <input type="text" required value={formData.country} onChange={set("country")} className={inputCls} />
                </Field>
                <Field label={t.experience} icon={Calendar}>
                  <select required value={formData.experience} onChange={set("experience")} className={inputCls}>
                    <option value="">{t.selectExperience}</option>
                    <option value="fresh">{t.expFresh}</option>
                    <option value="1-2">{t.exp12}</option>
                    <option value="3-5">{t.exp35}</option>
                    <option value="5+">{t.exp5}</option>
                  </select>
                </Field>
              </div>

              <Field label={t.linkedin} icon={Link2}>
                <input type="url" dir="ltr" required placeholder="https://linkedin.com/in/username" value={formData.linkedinUrl} onChange={set("linkedinUrl")} className={`${inputCls} text-start`} />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label={t.github} icon={GitBranch}>
                  <input type="url" dir="ltr" required placeholder="https://github.com/username" value={formData.githubUrl} onChange={set("githubUrl")} className={`${inputCls} text-start`} />
                </Field>
                <Field label={t.portfolio} icon={Globe}>
                  <input type="url" dir="ltr" placeholder="https://myportfolio.com" value={formData.portfolioUrl} onChange={set("portfolioUrl")} className={`${inputCls} text-start`} />
                </Field>
              </div>

              <Field label={t.uploadResume} icon={FileText}>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setFormData({ ...formData, cvFile: e.target.files[0] })}
                  className={`${inputCls} file:me-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#0099FF] file:text-white hover:file:bg-sky-600 cursor-pointer`}
                />
              </Field>

              <Field label={t.coverLetter} icon={MessageSquare} top>
                <textarea
                  rows="3"
                  placeholder={t.coverPlaceholder}
                  value={formData.coverLetter}
                  onChange={set("coverLetter")}
                  className={`${inputCls} resize-none`}
                />
              </Field>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-500 text-xs p-3 rounded-xl text-center font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isApplying}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs shadow-lg transition active:scale-95 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                <span>{isApplying ? t.submitting : t.submitApp}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}