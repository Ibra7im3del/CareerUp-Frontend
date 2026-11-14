import { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  Users,
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  Link2,
  GitBranch,
  Download,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Calendar,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import API, { API_BASE_URL } from "../services/axios";
import { useLanguage } from "../context/LanguageContext";

// الـ CV بيتخدم كملف ثابت من نفس السيرفر (من غير /api)
const FILES_BASE = API_BASE_URL.replace(/\/api\/?$/, "");

// نعرض اللينكات اللي http/https بس
const safeUrl = (url) => (/^https?:\/\//i.test(url || "") ? url : null);

export default function EmployerDashboard() {
  const { t } = useLanguage();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [editForm, setEditForm] = useState(null); // الوظيفة اللي بتتعدل
  const [savingEdit, setSavingEdit] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const statusStyles = {
    Pending: {
      label: t.underReview,
      cls: "bg-amber-50 text-amber-600 border border-amber-100",
      Icon: Clock,
    },
    Reviewed: {
      label: t.reviewed,
      cls: "bg-sky-50 text-sky-600 border border-sky-100",
      Icon: Eye,
    },
    Accepted: {
      label: t.accepted,
      cls: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      Icon: CheckCircle2,
    },
    Rejected: {
      label: t.rejected,
      cls: "bg-red-50 text-red-600 border border-red-100",
      Icon: XCircle,
    },
  };

  const experienceLabels = {
    fresh: t.expFresh,
    "1-2": t.exp12,
    "3-5": t.exp35,
    "5+": t.exp5,
  };

  useEffect(() => {
    API.get("/employer/jobs")
      .then(({ data }) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setError(t.loadError))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openJob = async (job) => {
    setSelectedJob(job);
    setApplicants([]);
    setError("");
    setLoadingApplicants(true);
    try {
      const { data } = await API.get(`/employer/jobs/${job.id}/applications`);
      setApplicants(Array.isArray(data) ? data : []);
    } catch {
      setError(t.loadError);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    setError("");
    try {
      await API.put(`/employer/applications/${id}/status`, { status });
      setApplicants((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a)),
      );
    } catch {
      setError(t.statusError);
    } finally {
      setUpdatingId(null);
    }
  };

  const openEdit = (job, e) => {
    e.stopPropagation();
    setError("");
    setEditForm({
      id: job.id,
      title: job.title || "",
      location: job.location || "",
      jobType: job.jobType || "Full-time",
      salaryRange: job.salaryRange || "",
      description: job.description || "",
      requirements: job.requirements || "",
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    setError("");
    try {
      const { id, ...body } = editForm;
      await API.put(`/jobs/${id}`, body);
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...body } : j)));
      setEditForm(null);
    } catch {
      setError(t.updateError);
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await API.delete(`/jobs/${jobToDelete.id}`);
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id));
      setJobToDelete(null);
    } catch {
      setError(t.deleteError);
      setJobToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d) => (d || "").split("T")[0];

  const card =
    "bg-[#FDFDFE]/95 backdrop-blur-md border border-white/80 rounded-3xl shadow-xl";

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          {t.dashTitle}
        </h1>
        <p className="text-sky-100 text-sm md:text-base font-medium max-w-xl mx-auto">
          {t.dashSubtitle}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-500 text-sm p-3 rounded-xl mb-6 text-center font-medium">
          {error}
        </div>
      )}

      {/* قائمة الوظائف */}
      {!selectedJob &&
        (loading ? (
          <div className={`${card} text-center py-16 text-slate-600 font-bold`}>
            {t.loadingGeneric}
          </div>
        ) : jobs.length === 0 ? (
          <div className={`${card} text-center py-16`}>
            <Briefcase className="w-16 h-16 text-sky-200 mx-auto mb-4 opacity-60" />
            <p className="text-slate-950 text-lg font-bold mb-2">
              {t.noJobsPosted}
            </p>
            <p className="text-slate-500 text-sm">{t.noJobsPostedHint}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => openJob(job)}
                className={`${card} p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:shadow-2xl transition`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-sky-100 text-[#0099FF] p-3.5 rounded-2xl shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-950 mb-1">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span dir="ltr">{formatDate(job.createdAt)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="bg-sky-50 text-[#0099FF] text-xs font-extrabold px-4 py-2 rounded-full border border-sky-100 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {t.applicantsCount}: {job.applicationsCount}
                  </span>
                  <button
                    onClick={(e) => openEdit(job, e)}
                    title={t.editJob}
                    className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setJobToDelete(job);
                    }}
                    title={t.deleteJob}
                    className="p-2.5 rounded-full bg-red-50 hover:bg-red-100 text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      {/* المتقدمون على وظيفة */}
      {selectedJob && (
        <div>
          <button
            onClick={() => {
              setSelectedJob(null);
              setError("");
            }}
            className="flex items-center gap-1.5 text-sm font-bold text-white hover:underline mb-5"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t.backToJobs}</span>
          </button>

          <h2 className="text-white text-xl font-black mb-4">
            {selectedJob.title} · {t.applicantsTitle}
          </h2>

          {loadingApplicants ? (
            <div
              className={`${card} text-center py-16 text-slate-600 font-bold`}
            >
              {t.loadingGeneric}
            </div>
          ) : applicants.length === 0 ? (
            <div
              className={`${card} text-center py-16 text-slate-600 font-bold`}
            >
              {t.noApplicants}
            </div>
          ) : (
            <div className="space-y-4">
              {applicants.map((a) => {
                const st = statusStyles[a.status] || statusStyles.Pending;
                const links = [
                  {
                    url: safeUrl(a.linkedinUrl),
                    label: "LinkedIn",
                    Icon: Link2,
                  },
                  {
                    url: safeUrl(a.githubUrl),
                    label: "GitHub",
                    Icon: GitBranch,
                  },
                  {
                    url: safeUrl(a.portfolioUrl),
                    label: "Portfolio",
                    Icon: Globe,
                  },
                ].filter((l) => l.url);

                return (
                  <div key={a.id} className={`${card} p-6`}>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-950">
                          {a.fullName}
                        </h3>
                        <p className="text-slate-400 text-xs font-semibold flex items-center gap-1 mt-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span dir="ltr">{formatDate(a.appliedAt)}</span>
                        </p>
                      </div>
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${st.cls}`}
                      >
                        <st.Icon className="w-3.5 h-3.5" />
                        <span>{st.label}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-semibold text-slate-600 mb-4">
                      <span className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                        <span dir="ltr">{a.email}</span>
                      </span>
                      {a.phone && (
                        <span className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                          <span dir="ltr">{a.phone}</span>
                        </span>
                      )}
                      {a.country && (
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                          {a.country}
                        </span>
                      )}
                      {a.experience && (
                        <span className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                          {experienceLabels[a.experience] || a.experience}
                        </span>
                      )}
                    </div>

                    {a.coverLetter && (
                      <div className="mb-4">
                        <h4 className="text-slate-900 font-bold text-xs mb-1">
                          {t.coverLetter}
                        </h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap bg-slate-50 rounded-xl p-3 border border-slate-100">
                          {a.coverLetter}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      {links.map(({ url, label, Icon }) => (
                        <a
                          key={label}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-full transition"
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </a>
                      ))}
                      {a.cvUrl && (
                        <a
                          href={`${FILES_BASE}${a.cvUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-[#0099FF] hover:bg-[#0088EE] text-white text-xs font-bold px-3 py-1.5 rounded-full transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          {t.downloadCv}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
                      <button
                        disabled={
                          updatingId === a.id || a.status === "Reviewed"
                        }
                        onClick={() => updateStatus(a.id, "Reviewed")}
                        className="bg-sky-50 hover:bg-sky-100 text-sky-600 text-xs font-bold px-4 py-2 rounded-full transition disabled:opacity-40"
                      >
                        {t.markReviewed}
                      </button>
                      <button
                        disabled={
                          updatingId === a.id || a.status === "Accepted"
                        }
                        onClick={() => updateStatus(a.id, "Accepted")}
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold px-4 py-2 rounded-full transition disabled:opacity-40"
                      >
                        {t.acceptBtn}
                      </button>
                      <button
                        disabled={
                          updatingId === a.id || a.status === "Rejected"
                        }
                        onClick={() => updateStatus(a.id, "Rejected")}
                        className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-4 py-2 rounded-full transition disabled:opacity-40"
                      >
                        {t.rejectBtn}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* نافذة تعديل الوظيفة */}
      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <form
            onSubmit={saveEdit}
            className="bg-[#FDFDFE] w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] p-6 md:p-8 shadow-2xl relative border border-sky-100 space-y-4"
          >
            <button
              type="button"
              onClick={() => setEditForm(null)}
              className="absolute top-6 end-6 text-slate-400 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-slate-950 font-black text-lg pe-12">
              {t.editJob}
            </h3>

            {[
              ["title", t.jobTitleLabel],
              ["location", t.locationLabel],
              ["salaryRange", t.salaryLabel],
              ["requirements", t.requirementsLabel],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-slate-700 text-xs font-bold mb-1.5">
                  {label}
                </label>
                <input
                  type="text"
                  required={key !== "requirements" && key !== "salaryRange"}
                  value={editForm[key]}
                  onChange={(e) =>
                    setEditForm({ ...editForm, [key]: e.target.value })
                  }
                  className="w-full bg-slate-100 px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#0099FF] outline-none text-slate-800 text-xs font-medium"
                />
              </div>
            ))}

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1.5">
                {t.jobTypeLabel}
              </label>
              <select
                value={editForm.jobType}
                onChange={(e) =>
                  setEditForm({ ...editForm, jobType: e.target.value })
                }
                className="w-full bg-slate-100 px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#0099FF] outline-none text-slate-800 text-xs font-medium"
              >
                <option value="Full-time">{t.fullTime}</option>
                <option value="Part-time">{t.partTime}</option>
                <option value="Remote">{t.remote}</option>
                <option value="Hybrid">{t.hybrid}</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold mb-1.5">
                {t.descriptionLabel}
              </label>
              <textarea
                rows="4"
                required
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
                className="w-full bg-slate-100 px-3.5 py-3 rounded-xl border border-slate-200 focus:border-[#0099FF] outline-none text-slate-800 text-xs font-medium resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={savingEdit}
                className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-bold py-3 rounded-full text-xs transition disabled:opacity-50"
              >
                {savingEdit ? t.saving : t.saveChanges}
              </button>
              <button
                type="button"
                onClick={() => setEditForm(null)}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs transition"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* تأكيد الحذف */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-[#FDFDFE] w-full max-w-md rounded-[2rem] p-8 shadow-2xl border border-sky-100 text-center">
            <div className="bg-red-50 text-red-500 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-slate-950 font-black text-lg mb-1">
              {t.deleteConfirmTitle}
            </h3>
            <p className="text-slate-900 font-bold text-sm mb-3">
              {jobToDelete.title}
            </p>
            <p className="text-slate-500 text-xs leading-relaxed mb-1">
              {t.deleteConfirmText}
            </p>
            <p className="text-slate-500 text-xs font-bold mb-6">
              {t.applicantsCount}: {jobToDelete.applicationsCount}
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-full text-xs transition disabled:opacity-50"
              >
                {deleting ? t.deleting : t.deleteConfirmBtn}
              </button>
              <button
                onClick={() => setJobToDelete(null)}
                disabled={deleting}
                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-full text-xs transition"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
