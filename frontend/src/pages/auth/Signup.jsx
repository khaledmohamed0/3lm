import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, BookOpen, GraduationCap } from 'lucide-react';
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";


export default function SignUp({ onNavigateToLogin, onSignUpSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState('student');
  
  const navigate = useNavigate();

  
  

  

  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    gradeLevel: 'primary',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await api.post("/auth/register/", {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        gradeLevel:
            userRole === "student"
            ? formData.gradeLevel
            : null,
        role: userRole,
        });

        console.log("Signup successful:", response.data);

        // Registration successful → Login
        navigate("/login");

    } catch (error) {
        console.error("Signup Error:", error);

        if (error.response?.data) {
        console.error("Backend Error:", error.response.data);
        }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4 font-arabic dir-rtl" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-amber-100">
        
        {/* Header Section */}
        <div className="bg-[#00406E] p-6 text-center text-white relative">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
            <GraduationCap className="w-10 h-10 text-[#C5922E]" />
          </div>
          <h2 className="text-3xl font-bold tracking-wide">عِلّْم</h2>
          <p className="text-xs text-[#C5922E] mt-1 font-semibold">كُنْ مَنْ يُعَلِّمْ وَيَتَعَلَّمْ</p>
          <p className="text-sm text-gray-200 mt-2">أنشئ حسابك وابدأ رحلة التعلم</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-right">
          
          {/* Role Selector */}
          <div className="flex gap-3 mb-2">
            <button
              type="button"
              onClick={() => setUserRole('student')}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition ${
                userRole === 'student'
                  ? 'border-[#C5922E] bg-amber-50 text-[#C5922E]'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <User className="w-4 h-4" /> طالب
            </button>
            <button
              type="button"
              onClick={() => setUserRole('teacher')}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition ${
                userRole === 'teacher'
                  ? 'border-[#C5922E] bg-amber-50 text-[#C5922E]'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-4 h-4" /> معلم
            </button>
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم بالكامل</label>
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] transition"
              />
            </div>
          </div>

          {/* Email Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@domain.com"
                    className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] transition text-left dir-ltr"
                />
                </div>
            </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        اسم المستخدم
                    </label>

                    <div className="relative">
                        <User className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />

                        <input
                        type="text"
                        name="username"
                        required
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="اختر اسم مستخدم"
                        className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] transition text-left"
                        dir="ltr"
                        />
                    </div>
                </div>

          {/* Phone Number Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                </label>

                <div className="relative">
                    <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] transition text-left"
                    />
                </div>
            </div>

          {/* Grade Level Select (Student only) */}
          {userRole === 'student' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">المرحلة الدراسية</label>
              <select
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] transition bg-white"
              >
                <option value="primary">المرحلة الابتدائية</option>
                <option value="prep">المرحلة الإعدادية</option>
                <option value="secondary">المرحلة الثانوية</option>
                <option value="university">المرحلة الجامعية</option>
              </select>
            </div>
          )}

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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#C5922E] hover:bg-opacity-90 text-white font-bold py-3 rounded-lg shadow-md transition transform active:scale-95 mt-2"
          >
            إنشاء حساب جديد
          </button>

          {/* Switch to Login */}
          <div className="text-center mt-4 text-sm text-gray-600">
            لديك حساب بالفعل؟{' '}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#00406E] font-bold hover:underline"
            >
              سجل دخولك
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}