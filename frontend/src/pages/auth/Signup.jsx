import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  BookOpen,
  GraduationCap,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Signup({ onNavigateToLogin }) {


  const { signup } = useAuth();
  const navigate = useNavigate();



  const [showPassword, setShowPassword] = useState(false);
  const [userRole, setUserRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    gradeLevel: "primary",
    academicYear: "GRADE_1_PRIMARY",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);

      const payload = {
        username: formData.username.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),

        password: formData.password,

        role: userRole,

        gradeLevel:
          userRole === "student"
            ? formData.gradeLevel
            : null,

        academicYear:
          userRole === "student"
            ? formData.academicYear
            : null,
      };

      console.log("========== SIGNUP ==========");
      console.log("Username:", payload.username);
      console.log("Full Name:", payload.fullName);
      console.log("Email:", payload.email);
      console.log("Phone:", payload.phone);
      console.log("Role:", payload.role);
      console.log("Grade:", payload.gradeLevel);
      console.log("Academic Year:", payload.academicYear);
      console.log("============================");

      try {
        await signup(payload);

        navigate("/login");

      } catch (error) {
        console.error(
          "Signup Error:",
          error.response?.data || error
        );

        const data = error.response?.data;

        if (data) {
          setError(
            Object.values(data)
              .flat()
              .join(" ")
          );
        } else {
          setError("حدث خطأ أثناء إنشاء الحساب.");
        }

      } finally {
        setLoading(false);
      }
    };

  return (
    <div
      className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-4 font-arabic dir-rtl"
      dir="rtl"
    >
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-amber-100">

        {/* Header */}
        <div className="bg-[#00406E] p-6 text-center text-white">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-10 h-10 text-[#C5922E]" />
          </div>

          <h2 className="text-3xl font-bold tracking-wide">
            عِلّْم
          </h2>

          <p className="text-xs text-[#C5922E] mt-1 font-semibold">
            كُنْ مَنْ يُعَلِّمْ وَيَتَعَلَّمْ
          </p>

          <p className="text-sm text-gray-200 mt-2">
            أنشئ حسابك وابدأ رحلة التعلم
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-4 text-right"
        >

          {/* Role */}
          <div className="flex gap-3 mb-2">

            <button
              type="button"
              onClick={() => setUserRole("student")}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition ${
                userRole === "student"
                  ? "border-[#C5922E] bg-amber-50 text-[#C5922E]"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <User className="w-4 h-4" />
              طالب
            </button>

            <button
              type="button"
              onClick={() => setUserRole("teacher")}
              className={`flex-1 py-2 px-3 rounded-lg border text-sm font-semibold flex items-center justify-center gap-2 transition ${
                userRole === "teacher"
                  ? "border-[#C5922E] bg-amber-50 text-[#C5922E]"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              معلم
            </button>

          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم بالكامل
            </label>

            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="أدخل اسمك الكامل"
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E]"
              />
            </div>
          </div>

          {/* Username */}
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
                dir="ltr"
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] text-left"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>

            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                dir="ltr"
                className="w-full pr-10 pl-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] text-left"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              رقم الهاتف
            </label>

            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              placeholder="01xxxxxxxxx"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] text-left"
            />
          </div>


          {/* Grade Level */}
          {userRole === "student" && (
            <>
              {/* Grade Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  المرحلة الدراسية
                </label>

                <select
                  name="gradeLevel"
                  value={formData.gradeLevel}
                  onChange={(e) => {
                    const grade = e.target.value;

                    setFormData({
                      ...formData,
                      gradeLevel: grade,

                      // Reset academic year when changing stage
                      academicYear:
                        grade === "primary"
                          ? "GRADE_1_PRIMARY"
                          : grade === "prep"
                          ? "GRADE_1_PREPARATORY"
                          : grade === "secondary"
                          ? "GRADE_1_SECONDARY"
                          : "UNIVERSITY",
                    });
                  }}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] bg-white"
                >
                  <option value="primary">المرحلة الابتدائية</option>
                  <option value="prep">المرحلة الإعدادية</option>
                  <option value="secondary">المرحلة الثانوية</option>
                  <option value="university">المرحلة الجامعية</option>
                </select>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السنة الدراسية
                </label>

                <select
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] bg-white"
                >
                  {formData.gradeLevel === "primary" && (
                    <>
                      <option value="GRADE_1_PRIMARY">أولى ابتدائي</option>
                      <option value="GRADE_2_PRIMARY">تانية ابتدائي</option>
                      <option value="GRADE_3_PRIMARY">تالتة ابتدائي</option>
                      <option value="GRADE_4_PRIMARY">رابعة ابتدائي</option>
                      <option value="GRADE_5_PRIMARY">خامسة ابتدائي</option>
                      <option value="GRADE_6_PRIMARY">سادسة ابتدائي</option>
                    </>
                  )}

                  {formData.gradeLevel === "prep" && (
                    <>
                      <option value="GRADE_1_PREPARATORY">أولى إعدادي</option>
                      <option value="GRADE_2_PREPARATORY">تانية إعدادي</option>
                      <option value="GRADE_3_PREPARATORY">تالتة إعدادي</option>
                    </>
                  )}

                  {formData.gradeLevel === "secondary" && (
                    <>
                      <option value="GRADE_1_SECONDARY">أولى ثانوي</option>
                      <option value="GRADE_2_SECONDARY">تانية ثانوي</option>
                      <option value="GRADE_3_SECONDARY">تالتة ثانوي</option>
                    </>
                  )}

                  {formData.gradeLevel === "university" && (
                    <option value="UNIVERSITY">جامعة</option>
                  )}
                </select>
              </div>
            </>
          )}



          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>

            <div className="relative">
              <Lock className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                dir="ltr"
                className="w-full pr-10 pl-10 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E] text-left"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C5922E] hover:bg-opacity-90 disabled:opacity-60 text-white font-bold py-3 rounded-lg shadow-md transition"
          >
            {loading
              ? "جاري إنشاء الحساب..."
              : "إنشاء حساب جديد"}
          </button>

          {/* Login */}
          <div className="text-center mt-4 text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}

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

