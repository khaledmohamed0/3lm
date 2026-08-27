import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from "../../context/AuthContext"; 



export default function Login({ onNavigateToSignUp, onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setErrorMessage(''); // مسح الخطأ عند التعديل
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
        await login(formData.username, formData.password);
        navigate("/dashboard");
    } catch (err) {
        console.error("Login Error:", err);
        const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "اسم المستخدم أو كلمة السر غير صحيحة";
        setErrorMessage(msg);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4 font-arabic" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-amber-100">
        
        {/* Header Section */}
        <div className="bg-[#00406E] p-6 text-center text-white relative">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <GraduationCap className="w-10 h-10 text-[#C5922E]" />
          </div>
          <h2 className="text-3xl font-bold tracking-wide">عِلّْم</h2>
          <p className="text-xs text-[#C5922E] mt-1 font-semibold">كُنْ مَنْ يُعَلِّمْ وَيَتَعَلَّمْ</p>
          <p className="text-sm text-gray-200 mt-2">مرحباً بعودتك! سجل دخولك للمتابعة</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          
          {/* Alert Message */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2 dir-rtl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Username Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم المستخدم (Username)</label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="أدخل اسم المستخدم"
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] transition text-right"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pr-10 pl-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] transition text-left dir-ltr"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember / Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
              <input 
                type="checkbox" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="rounded text-[#00406E] focus:ring-[#00406E]" 
              />
              تذكرني
            </label>
            <a href="#forgot" className="text-[#C5922E] hover:underline font-semibold">نسيت كلمة المرور؟</a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C5922E] hover:bg-opacity-90 text-white font-bold py-3 rounded-lg shadow-md transition transform active:scale-95 mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول'
            )}
          </button>

          {/* Switch to SignUp */}
          <div className="text-center mt-4 text-sm text-gray-600">
            ليس لديك حساب؟{" "}
            <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-[#00406E] font-bold hover:underline"
            >
                أنشئ حساباً الآن
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}