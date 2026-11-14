import { useState, useEffect } from "react";
import { Briefcase, Building2, Calendar, CheckCircle2, Clock, FileText, XCircle, Eye } from "lucide-react";
import API from "../services/axios";
import { useLanguage } from "../context/LanguageContext";

export default function MyApplications() {
  const { t } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // حالات الطلب القادمة من الباك إند: Pending / Reviewed / Accepted / Rejected
  const statusStyles = {
    Pending: { label: t.underReview, cls: "bg-amber-50 text-amber-600 border border-amber-100", Icon: Clock },
    Reviewed: { label: t.reviewed, cls: "bg-sky-50 text-sky-600 border border-sky-100", Icon: Eye },
    Accepted: { label: t.accepted, cls: "bg-emerald-50 text-emerald-600 border border-emerald-100", Icon: CheckCircle2 },
    Rejected: { label: t.rejected, cls: "bg-red-50 text-red-600 border border-red-100", Icon: XCircle },
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // الطلبات الفعلية من الباك إند (حتى لو القائمة فاضية نعرضها زي ما هي)
        const response = await API.get("/jobapplications");
        setApplications(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.warn("Backend not reachable, falling back to local storage.", err);
        // Fallback: الطلبات المحفوظة محلياً لو السيرفر مش متصل
        const savedApps = JSON.parse(localStorage.getItem("jobApplications") || "[]");
        setApplications(savedApps);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 w-full">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-3">
          {t.appsTitle}
        </h1>
        <p className="text-sky-100 text-sm md:text-base font-medium max-w-xl mx-auto">
          {t.appsSubtitle}
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-16 bg-[#FDFDFE]/80 backdrop-blur-md rounded-3xl border border-white/80 shadow-xl text-slate-600 font-bold">
            {t.loadingApps}
          </div>
        ) : applications.length > 0 ? (
          applications.map((app, index) => {
            // الباك إند بيرجّع JobApplication فيه job.title و job.company.name و appliedAt
            const title = app.jobTitle || app.job?.title || app.title;
            const company = app.companyName || app.job?.company?.name || app.company?.name;
            const date = (app.appliedDate || app.appliedAt || "").split("T")[0];
            const st = statusStyles[app.status] || statusStyles.Pending;

            return (
              <div
                key={app.id || index}
                className="bg-[#FDFDFE]/95 backdrop-blur-md border border-white/80 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition hover:shadow-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-sky-100 text-[#0099FF] p-3.5 rounded-2xl shrink-0">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-950 mb-1">{title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#0099FF]" />
                        {company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span dir="ltr">{date}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <span
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${st.cls}`}
                  >
                    <st.Icon className="w-3.5 h-3.5" />
                    <span>{st.label}</span>
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-[#FDFDFE]/80 backdrop-blur-md rounded-3xl border border-white/80 shadow-xl">
            <FileText className="w-16 h-16 text-sky-200 mx-auto mb-4 opacity-60" />
            <p className="text-slate-950 text-lg font-bold mb-2">{t.noApps}</p>
            <p className="text-slate-500 text-sm">{t.noAppsHint}</p>
          </div>
        )}
      </div>
    </div>
  );
}