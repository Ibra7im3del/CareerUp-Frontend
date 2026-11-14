import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, User, Globe, Home as HomeIcon, Compass, Heart, PlusCircle, FileCheck, LogOut, LayoutDashboard } from "lucide-react";
import { TabBar } from "glisse";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
  const role = currentUser?.userType;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  let currentTab = "home";
  if (location.pathname.startsWith("/jobs")) currentTab = "jobs";
  if (location.pathname.startsWith("/savedJobs")) currentTab = "savedJobs";
  if (location.pathname.startsWith("/post-job")) currentTab = "postJob";
  if (location.pathname.startsWith("/applications")) currentTab = "applications";
  if (location.pathname.startsWith("/dashboard")) currentTab = "dashboard";

  const tabItems = [
    { value: "home", label: t.home, icon: <HomeIcon /> },
    { value: "jobs", label: t.jobs, icon: <Compass /> },
    { value: "savedJobs", label: t.saved, icon: <Heart /> },
    { value: "postJob", label: t.postJob, icon: <PlusCircle /> },
    { value: "dashboard", label: t.dashboard, icon: <LayoutDashboard /> },
    { value: "applications", label: t.applied, icon: <FileCheck /> },
  ];

  // التابات المقيّدة بنوع الحساب
  const tabRoles = { savedJobs: "JobSeeker", applications: "JobSeeker", postJob: "Employer", dashboard: "Employer" };
  const visibleTabs = tabItems.filter((i) => !tabRoles[i.value] || tabRoles[i.value] === role);
  // في العربي نعكس الترتيب عشان "الرئيسية" تبقى على اليمين
  const orderedItems = lang === "ar" ? [...visibleTabs].reverse() : visibleTabs;

  const routes = {
    home: "/", jobs: "/jobs", savedJobs: "/savedJobs",
    postJob: "/post-job", applications: "/applications", dashboard: "/dashboard",
  };

  return (
    <header className="pt-2 px-6 sticky top-0 z-50 w-full bg-transparent">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-1.5">
        <Link to="/" className="flex items-center gap-2.5 text-slate-950 font-black text-xl tracking-tight shrink-0 group">
          <div className="bg-gradient-to-tr from-[#0099FF] to-sky-400 text-white p-2 rounded-xl shadow-md group-hover:scale-105 transition duration-300">
            <Search className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span dir="ltr" className="text-slate-950 font-black tracking-wider">CareerUp</span>
        </Link>

        <div className="hidden md:block" dir="ltr">
          <TabBar
            key={`${lang}-${role}`}
            aria-label="Main navigation"
            items={orderedItems}
            value={currentTab}
            onValueChange={(v) => navigate(routes[v] || "/")}
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {role === "JobSeeker" && (
            <>
              <Link to="/applications" className="md:hidden flex items-center justify-center bg-sky-100 text-[#0099FF] p-2 rounded-full transition shadow-sm hover:bg-sky-200" title={t.applied}>
                <FileCheck className="w-4 h-4" />
              </Link>
              <Link to="/savedJobs" className="md:hidden flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-rose-500 p-2 rounded-full transition shadow-sm" title={t.saved}>
                <Heart className="w-4 h-4 fill-current" />
              </Link>
            </>
          )}
          {role === "Employer" && (
            <>
              <Link to="/dashboard" className="md:hidden flex items-center justify-center bg-sky-100 text-[#0099FF] p-2 rounded-full transition shadow-sm hover:bg-sky-200" title={t.dashboard}>
                <LayoutDashboard className="w-4 h-4" />
              </Link>
              <Link to="/post-job" className="md:hidden flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full transition shadow-sm" title={t.postJob}>
                <PlusCircle className="w-4 h-4" />
              </Link>
            </>
          )}

          <button onClick={toggleLang} className="flex items-center gap-1.5 text-slate-950 text-xs font-bold transition-colors">
            <Globe className="w-3.5 h-3.5 text-slate-950" />
            <span className="text-slate-950 font-bold">{lang === "en" ? "عربي" : "English"}</span>
          </button>

          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-950 bg-white/60 px-3 py-1.5 rounded-full border border-sky-100 shadow-sm">
                {t.hi}, {currentUser.name || currentUser.fullName}
              </span>
              <button onClick={handleLogout} className="bg-rose-50 hover:bg-rose-100 text-rose-600 p-2 rounded-full transition shadow-sm" title={t.logout}>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="text-slate-950 text-xs font-bold transition-colors">{t.loginNav}</Link>
              <Link to="/register" className="bg-slate-950 hover:bg-slate-800 text-white px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold transition-colors shadow-md">
                <User className="w-3.5 h-3.5" />
                <span>{t.startFree}</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}