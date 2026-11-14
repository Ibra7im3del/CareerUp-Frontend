import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import API from "../services/axios";
import { useLanguage } from "../context/LanguageContext";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    userType: "JobSeeker",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const ar = lang === "ar";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/register", {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      const currentUser = {
        name: response.data.fullName || formData.name,
        email: formData.email,
        userType: response.data.userType || formData.userType,
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error("Register Error:", err.response);
      const data = err.response?.data;
      if (!err.response) {
        setError(t.serverError);
      } else if (typeof data?.message === "string" && data.message) {
        setError(data.message);
      } else if (typeof data === "string") {
        setError(data);
      } else if (data?.errors) {
        // أخطاء الـ ModelState: object فيه arrays
        setError(Object.values(data.errors).flat().join(" - "));
      } else {
        setError(ar ? "حدث خطأ أثناء إنشاء الحساب (تأكد من شروط كلمة المرور)" : "Registration error");
      }
    } finally {
      setLoading(false);
    }
  };

  const typeCls = (type) =>
    `flex items-center justify-center gap-2.5 p-3 rounded-xl border cursor-pointer transition text-xs font-bold ${
      formData.userType === type
        ? "border-[#0099FF] bg-sky-50 text-[#0099FF] shadow-sm"
        : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-[#FDFDFE] border border-sky-100 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl shadow-sky-900/5">
        <div className="text-center mb-8">
          <div className="bg-sky-50 text-[#0099FF] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <UserPlus className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {ar ? "إنشاء حساب جديد" : "Create Account"}
          </h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">
            {ar ? "أدخل بياناتك للبدء معنا" : "Enter your details to get started"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              {ar ? "الاسم الكامل" : "Full Name"}
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-11 pe-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0099FF] focus:bg-white text-sm font-medium transition"
                placeholder={ar ? "أدخل اسمك الكامل" : "John Doe"}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              {ar ? "البريد الإلكتروني" : "Email Address"}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-11 pe-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0099FF] focus:bg-white text-sm font-medium transition"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              {ar ? "نوع الحساب" : "Account Type"}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className={typeCls("JobSeeker")}>
                <input
                  type="radio"
                  name="userType"
                  value="JobSeeker"
                  checked={formData.userType === "JobSeeker"}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="accent-[#0099FF] w-4 h-4"
                />
                <span>{ar ? "باحث عن عمل" : "Job Seeker"}</span>
              </label>

              <label className={typeCls("Employer")}>
                <input
                  type="radio"
                  name="userType"
                  value="Employer"
                  checked={formData.userType === "Employer"}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="accent-[#0099FF] w-4 h-4"
                />
                <span>{ar ? "صاحب عمل" : "Employer"}</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              {ar ? "كلمة المرور" : "Password"}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-11 pe-11 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0099FF] focus:bg-white text-sm font-medium transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0099FF] hover:bg-[#0088EE] text-white font-bold py-3.5 rounded-full transition duration-200 mt-3 shadow-md shadow-sky-500/25 disabled:opacity-50 active:scale-95"
          >
            {loading
              ? ar ? "جاري إنشاء الحساب..." : "Creating account..."
              : ar ? "تسجيل الحساب" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-slate-500 mt-6">
          {ar ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
          <Link to="/login" className="text-[#0099FF] font-bold hover:underline">
            {ar ? "تسجيل الدخول" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}