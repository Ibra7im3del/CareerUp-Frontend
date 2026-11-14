import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";
import API from "../services/axios";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem("token", response.data.token);

      // الاسم الحقيقي القادم من الباك إند (ولو مش موجود نستخدم أول جزء من الإيميل)
      const userName = response.data.fullName || formData.email.split("@")[0];

      const currentUser = {
        name: userName,
        email: formData.email,
        userType: response.data.userType,
      };
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      navigate("/");
      window.location.reload();
    } catch (err) {
      if (!err.response) {
        setError(t.serverError);
      } else {
        setError(err.response?.data?.message || t.loginError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 w-full flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-[#FDFDFE] border border-sky-100 p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl shadow-sky-900/5">
        <div className="text-center mb-8">
          <div className="bg-sky-50 text-[#0099FF] w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <LogIn className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">{t.loginTitle}</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium">{t.loginSubtitle}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-500 text-sm p-3 rounded-xl mb-6 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              {t.emailLabel}
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-11 pe-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0099FF] focus:bg-white text-sm font-medium transition"
                placeholder={t.emailPlaceholder}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl ps-11 pe-11 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0099FF] focus:bg-white text-sm font-medium transition"
                placeholder={t.passwordPlaceholder}
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
            {loading ? t.loggingIn : t.submitLogin}
          </button>
        </form>

        <p className="text-center text-xs font-medium text-slate-500 mt-6">
          {t.noAccount}{" "}
          <Link to="/register" className="text-[#0099FF] font-bold hover:underline">
            {t.createAccount}
          </Link>
        </p>
      </div>
    </div>
  );
}