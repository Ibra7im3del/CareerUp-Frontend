import { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

const translations = {
  en: {
    // nav
    home: "Home", jobs: "Explore Jobs", saved: "Saved", postJob: "Post Job",
    applied: "Applied", loginNav: "Sign in", startFree: "Start Free",
    hi: "Hi", logout: "Logout",
    // home
    badge: "Your premier platform for modern careers",
    title1: "WE GROW CAREERS,", title2: "NOT JUST NUMBERS",
    desc: "Find your dream job at top companies and connect with employers easily.",
    searchPlaceholder: "Job title or keyword...", cityPlaceholder: "City or location...",
    searchBtn: "Start Searching",
    // auth
    loginTitle: "Sign In", loginSubtitle: "Enter your account credentials to continue",
    emailLabel: "Email Address", passwordLabel: "Password",
    emailPlaceholder: "name@example.com", passwordPlaceholder: "••••••••",
    submitLogin: "Sign In", loggingIn: "Signing in...",
    noAccount: "Don't have an account?", createAccount: "Create Account",
    loginError: "Invalid email or password",
    serverError: "Cannot connect to the server",
    // jobs
    jobsTitle: "Explore Jobs", jobsSubtitle: "Find the opportunity that fits your skills",
    applyBtn: "Apply", noJobs: "No jobs found matching your criteria.",
    saveJob: "Save Job", savedLabel: "Saved", jobDescription: "Job Description",
    requirements: "Requirements", applyNow: "Apply Now", backToDetails: "Back to Job Details",
    applyFor: "Apply for", appSubmitted: "Application Submitted!",
    appSentTo: "Your application has been successfully sent to",
    fullName: "Full Name", phone: "Phone Number", country: "Country",
    experience: "Years of Experience", selectExperience: "Select experience",
    expFresh: "Fresh Graduate / Junior", exp12: "1 - 2 Years", exp35: "3 - 5 Years", exp5: "5+ Years",
    linkedin: "LinkedIn Profile URL", github: "GitHub Profile URL",
    portfolio: "Portfolio Website URL", uploadResume: "Upload Resume (PDF)",
    coverLetter: "Cover Letter / Bio",
    coverPlaceholder: "Briefly describe why you are a great fit for this role...",
    submitting: "Submitting Application...", submitApp: "Submit Application Now",
    notAllowed: "Only job seekers can apply for jobs.",
    applyError: "Could not submit your application.",
    // saved
    savedTitle: "Saved Jobs", savedSubtitle: "Your bookmarked career opportunities ready for review",
    noSaved: "No saved jobs yet!", noSavedHint: "Browse jobs and click the heart icon on any card to save it here.",
    removeSaved: "Remove from saved",
    // applications
    appsTitle: "My Applications",
    appsSubtitle: "Track the status of your submitted job applications and career progress",
    loadingApps: "Loading applications...", underReview: "Under Review", accepted: "Accepted",
    reviewed: "Reviewed", rejected: "Rejected",
    noApps: "No applications submitted yet!",
    noAppsHint: "Explore available jobs and apply to start tracking your career journey.",
    // post job
    postTitle: "Post a New Job", postSubtitle: "Create a career opportunity and attract top engineering talent",
    jobTitleLabel: "Job Title", companyLabel: "Company Name", locationLabel: "Location / City",
    jobTypeLabel: "Job Type", salaryLabel: "Salary Range", descriptionLabel: "Job Description",
    requirementsLabel: "Requirements (comma separated)",
    titlePh: "e.g. Senior .NET Developer", companyPh: "e.g. Tech Solutions",
    locationPh: "e.g. Mansoura, Egypt", salaryPh: "e.g. 15000 - 25000 EGP",
    descriptionPh: "Describe the role responsibilities...",
    requirementsPh: "C#, ASP.NET Core, React, SQL Server",
    fullTime: "Full-time", partTime: "Part-time", remote: "Remote", hybrid: "Hybrid",
    posting: "Posting Job...", publishJob: "Publish Job Post",
    postedOk: "Job Posted Successfully!", redirecting: "Redirecting you to the jobs board...",
    notAllowedPost: "Only employers can post jobs.",
    postError: "Could not publish the job.",
    companyLockedHint: "Jobs are posted under your registered company.",
    // dashboard
    dashboard: "Dashboard", dashTitle: "Employer Dashboard",
    dashSubtitle: "Manage your job posts and review applicants",
    loadingGeneric: "Loading...", loadError: "Could not load data.",
    noJobsPosted: "You haven't posted any jobs yet!",
    noJobsPostedHint: "Post your first job to start receiving applications.",
    applicantsCount: "Applicants", applicantsTitle: "Applicants",
    noApplicants: "No applications for this job yet.", backToJobs: "Back to my jobs",
    downloadCv: "Download CV", markReviewed: "Mark as reviewed",
    acceptBtn: "Accept", rejectBtn: "Reject", statusError: "Could not update the status.",
    editJob: "Edit job", deleteJob: "Delete job", saveChanges: "Save changes",
    saving: "Saving...", cancel: "Cancel", deleting: "Deleting...",
    deleteConfirmTitle: "Delete this job?",
    deleteConfirmText: "The job will be permanently deleted together with all its applications and uploaded CVs. This cannot be undone.",
    deleteConfirmBtn: "Yes, delete", updateError: "Could not save the changes.",
    deleteError: "Could not delete the job.",
    filterAll: "All", sortLabel: "Sort", sortNewest: "Newest first", sortOldest: "Oldest first",
    resultsFound: "jobs found", prevPage: "Previous", nextPage: "Next",
    clearFilters: "Clear filters",
    jobsLoadError: "Could not load jobs. Make sure the server is running.",
    notFoundTitle: "Page not found",
    notFoundText: "The page you are looking for does not exist or has been moved.",
    backHome: "Back to home",
  },
  ar: {
    home: "الرئيسية", jobs: "استكشاف الوظائف", saved: "المحفوظة", postJob: "نشر وظيفة",
    applied: "طلباتي", loginNav: "تسجيل الدخول", startFree: "ابدأ مجاناً",
    hi: "أهلاً", logout: "تسجيل الخروج",
    badge: "منصتك الأولى للفرص الوظيفية العصرية",
    title1: "نصنع مسارات مهنية،", title2: "وليس مجرد أرقام",
    desc: "ابحث عن وظيفة أحلامك في أفضل الشركات وتواصل مع أصحاب العمل بكل سهولة.",
    searchPlaceholder: "المسمى الوظيفي أو المهارة...", cityPlaceholder: "المدينة أو المكان...",
    searchBtn: "ابدأ البحث",
    loginTitle: "تسجيل الدخول", loginSubtitle: "أدخل بيانات حسابك للمتابعة",
    emailLabel: "البريد الإلكتروني", passwordLabel: "كلمة المرور",
    emailPlaceholder: "name@example.com", passwordPlaceholder: "••••••••",
    submitLogin: "تسجيل الدخول", loggingIn: "جاري الدخول...",
    noAccount: "ليس لديك حساب؟", createAccount: "إنشاء حساب جديد",
    loginError: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
    serverError: "تعذر الاتصال بالسيرفر",
    jobsTitle: "استكشاف الوظائف", jobsSubtitle: "اعثر على الفرصة المناسبة لمهاراتك",
    applyBtn: "قدّم", noJobs: "لا توجد وظائف مطابقة لبحثك.",
    saveJob: "حفظ الوظيفة", savedLabel: "تم الحفظ", jobDescription: "وصف الوظيفة",
    requirements: "المتطلبات", applyNow: "قدّم الآن", backToDetails: "العودة لتفاصيل الوظيفة",
    applyFor: "التقديم على", appSubmitted: "تم إرسال طلبك!",
    appSentTo: "تم إرسال طلبك بنجاح إلى",
    fullName: "الاسم الكامل", phone: "رقم الهاتف", country: "الدولة",
    experience: "سنوات الخبرة", selectExperience: "اختر الخبرة",
    expFresh: "حديث التخرج / مبتدئ", exp12: "من 1 إلى 2 سنة", exp35: "من 3 إلى 5 سنوات", exp5: "أكثر من 5 سنوات",
    linkedin: "رابط لينكدإن", github: "رابط جيت هاب",
    portfolio: "رابط موقع الأعمال", uploadResume: "ارفع السيرة الذاتية (PDF)",
    coverLetter: "خطاب التقديم / نبذة عنك",
    coverPlaceholder: "اكتب باختصار لماذا أنت مناسب لهذه الوظيفة...",
    submitting: "جاري إرسال الطلب...", submitApp: "إرسال الطلب الآن",
    notAllowed: "فقط الباحثون عن عمل يمكنهم التقديم على الوظائف.",
    applyError: "تعذر إرسال طلبك.",
    savedTitle: "الوظائف المحفوظة", savedSubtitle: "فرصك الوظيفية المفضلة جاهزة للمراجعة",
    noSaved: "لا توجد وظائف محفوظة بعد!", noSavedHint: "تصفح الوظائف واضغط على أيقونة القلب لحفظها هنا.",
    removeSaved: "إزالة من المحفوظات",
    appsTitle: "طلباتي", appsSubtitle: "تابع حالة طلبات التوظيف المقدمة وتقدمك المهني",
    loadingApps: "جاري تحميل الطلبات...", underReview: "قيد المراجعة", accepted: "مقبول",
    reviewed: "تمت المراجعة", rejected: "مرفوض",
    noApps: "لم تقدم على أي وظيفة بعد!",
    noAppsHint: "استكشف الوظائف المتاحة وقدّم عليها لتبدأ متابعة رحلتك المهنية.",
    postTitle: "نشر وظيفة جديدة", postSubtitle: "أنشئ فرصة عمل واجذب أفضل المواهب الهندسية",
    jobTitleLabel: "المسمى الوظيفي", companyLabel: "اسم الشركة", locationLabel: "الموقع / المدينة",
    jobTypeLabel: "نوع الوظيفة", salaryLabel: "نطاق الراتب", descriptionLabel: "وصف الوظيفة",
    requirementsLabel: "المتطلبات (مفصولة بفاصلة)",
    titlePh: "مثال: مطور .NET", companyPh: "مثال: شركة الحلول التقنية",
    locationPh: "مثال: المنصورة، مصر", salaryPh: "مثال: 15000 - 25000 جنيه",
    descriptionPh: "اكتب مسؤوليات الوظيفة...",
    requirementsPh: "C#, ASP.NET Core, React, SQL Server",
    fullTime: "دوام كامل", partTime: "دوام جزئي", remote: "عن بعد", hybrid: "هجين",
    posting: "جاري النشر...", publishJob: "نشر الوظيفة",
    postedOk: "تم نشر الوظيفة بنجاح!", redirecting: "جاري تحويلك للوظائف...",
    notAllowedPost: "فقط أصحاب العمل يمكنهم نشر الوظائف.",
    postError: "تعذر نشر الوظيفة.",
    companyLockedHint: "الوظائف بتتنشر باسم شركتك المسجلة.",
    // dashboard
    dashboard: "لوحة التحكم", dashTitle: "لوحة صاحب العمل",
    dashSubtitle: "أدر وظائفك وراجع المتقدمين",
    loadingGeneric: "جاري التحميل...", loadError: "تعذر تحميل البيانات.",
    noJobsPosted: "لم تنشر أي وظيفة بعد!",
    noJobsPostedHint: "انشر أول وظيفة لتبدأ باستقبال الطلبات.",
    applicantsCount: "المتقدمون", applicantsTitle: "المتقدمون",
    noApplicants: "لا توجد طلبات على هذه الوظيفة بعد.", backToJobs: "العودة لوظائفي",
    downloadCv: "تحميل السيرة الذاتية", markReviewed: "تمت المراجعة",
    acceptBtn: "قبول", rejectBtn: "رفض", statusError: "تعذر تحديث الحالة.",
    editJob: "تعديل الوظيفة", deleteJob: "حذف الوظيفة", saveChanges: "حفظ التعديلات",
    saving: "جاري الحفظ...", cancel: "إلغاء", deleting: "جاري الحذف...",
    deleteConfirmTitle: "حذف هذه الوظيفة؟",
    deleteConfirmText: "سيتم حذف الوظيفة نهائياً مع كل الطلبات المقدمة عليها والسير الذاتية المرفوعة. لا يمكن التراجع عن ذلك.",
    deleteConfirmBtn: "نعم، احذف", updateError: "تعذر حفظ التعديلات.",
    deleteError: "تعذر حذف الوظيفة.",
    filterAll: "الكل", sortLabel: "الترتيب", sortNewest: "الأحدث أولاً", sortOldest: "الأقدم أولاً",
    resultsFound: "وظيفة", prevPage: "السابق", nextPage: "التالي",
    clearFilters: "مسح الفلاتر",
    jobsLoadError: "تعذر تحميل الوظائف. تأكد من تشغيل السيرفر.",
    notFoundTitle: "الصفحة غير موجودة",
    notFoundText: "الصفحة التي تبحث عنها غير موجودة أو تم نقلها.",
    backHome: "العودة للرئيسية",
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

  const toggleLang = () => {
    setLang((prev) => {
      const next = prev === "en" ? "ar" : "en";
      localStorage.setItem("lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t: translations[lang] }}>
      <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);