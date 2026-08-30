import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  ChevronRight,
  Star,
  Clock,
  BookOpen,
  CheckCircle,
  ShieldCheck,
  UserCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

import api from "../../api/axios";

export default function CourseDetail({ onBuy, onBack }) {

  const { id } = useParams();
  const navigate = useNavigate();

  // Course data
  const [course, setCourse] = useState(null);

  // Page states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Enrollment state
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/courses/${id}/`);

        console.log("COURSE DETAIL:", response.data);

        const courseData = response.data;

        setCourse(courseData);

        // مهم جداً
        setIsEnrolled(courseData.is_enrolled || false);

      } catch (error) {
        console.error(
          "Failed to fetch course:",
          error.response?.data || error
        );

        setError("تعذر تحميل بيانات الكورس.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourse();
    }
  }, [id]);

  const handleEnroll = async () => {
    try {
      const response = await api.post(
        `/courses/enroll/${id}/`
      );

      console.log("ENROLL SUCCESS:", response.data);

      // تحويل الزر فوراً
      setIsEnrolled(true);

    } catch (error) {
      console.error(
        "ENROLL ERROR:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.detail ||
        "حدث خطأ أثناء الاشتراك في الكورس.";

      console.error(message);
    }
  };

  const handleStartStudy = () => {
    const firstLesson = (course.lessons || [])
      .filter((lesson) => lesson.is_published)
      .sort((a, b) => a.order - b.order)[0];

    if (!firstLesson) {
      console.log("NO LESSONS AVAILABLE");
      return;
    }

    navigate(`/student/courses/${course.id}/lessons/${firstLesson.id}`);
  };

  const handleBack = () => {
    navigate("/student/courses");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#F7F6F2] flex items-center justify-center"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-3 text-[#00406E]">
          <Loader2 className="w-10 h-10 animate-spin text-[#C5922E]" />

          <p className="font-bold text-sm">
            جاري تحميل بيانات الكورس...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-6"
        dir="rtl"
      >
        <div className="bg-white p-8 rounded-2xl shadow-sm text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />

          <h2 className="font-bold text-[#00406E] mb-4">
            {error || "الكورس غير موجود"}
          </h2>

          <button
            onClick={handleBack}
            className="bg-[#00406E] text-white px-5 py-2.5 rounded-xl font-bold"
          >
            العودة للكورسات
          </button>
        </div>
      </div>
    );
  }



  const teacher = course.teacher;

  const teacherName =
    teacher?.first_name || teacher?.last_name
      ? `${teacher?.first_name || ""} ${
          teacher?.last_name || ""
        }`.trim()
      : teacher?.username || "المدرس";

  const lessons = (course.lessons || []).filter(
    (lesson) => lesson.is_published
  );

  return (
    <div
      className="min-h-screen bg-[#F7F6F2] font-arabic text-right p-4 md:p-8"
      dir="rtl"
    >
      {/* Navigation */}

      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#00406E] mb-6 transition"
      >
        <ChevronRight className="w-4 h-4" />

        العودة للكورسات
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Details */}

        <div className="lg:col-span-2 space-y-6">

          {/* Course Header */}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60 space-y-4">

            <span className="bg-amber-50 text-[#C5922E] text-xs font-bold px-3 py-1 rounded-full border border-amber-200/60">
              {course.category_display ||
                course.category ||
                "المرحلة التعليمية"}
            </span>

            <h1 className="text-2xl md:text-3xl font-extrabold text-[#00406E]">
              {course.title}
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">

              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                4.9
              </span>

              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#C5922E]" />
                {lessons.length} محاضرة
              </span>

              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-[#C5922E]" />
                {lessons.length} درس
              </span>

            </div>
          </div>

          {/* Teacher */}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60">

            <h2 className="text-lg font-bold text-[#00406E] flex items-center gap-2 mb-4">
              <UserCheck className="w-5 h-5 text-[#C5922E]" />

              عن محاضر الكورس
            </h2>

            <div className="flex items-start gap-4">

              <div className="w-16 h-16 rounded-2xl bg-[#00406E] text-white flex items-center justify-center font-black text-xl border-2 border-amber-200">
                {teacherName.charAt(0)}
              </div>

              <div>
                <h3 className="font-extrabold text-[#00406E]">
                  {teacherName}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  مدرس الكورس على منصة عِلّْم التعليمية.
                </p>

                {course.academic_year_display && (
                  <p className="text-[11px] text-gray-500 mt-2 font-bold">
                    🎓 {course.academic_year_display}
                  </p>
                )}
              </div>

            </div>
          </div>

          {/* Lessons */}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60">

            <h2 className="text-lg font-bold text-[#00406E] flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[#C5922E]" />

              محتوى الكورس
            </h2>

            {lessons.length > 0 ? (
              <div className="space-y-3">

                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#00406E] text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-[#00406E]">
                        {lesson.title}
                      </h3>

                      {lesson.description && (
                        <p className="text-[11px] text-gray-400 mt-1">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                ))}

              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">
                لا توجد دروس منشورة حالياً.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar */}

        <div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-amber-200/60 sticky top-6 space-y-6">

                {/* Course Thumbnail */}
                <div className="relative overflow-hidden rounded-xl">
                {course.thumbnail ? (
                    <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                    />
                ) : (
                    <div className="w-full h-48 rounded-xl bg-[#00406E] flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-[#C5922E]" />
                    </div>
                )}

                {/* Enrolled Badge */}
                {course.is_enrolled && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    مشترك بالفعل
                    </div>
                )}
                </div>


                {/* Course Price */}
                <div className="flex items-center justify-between">

                <span className="text-xs text-gray-400 font-semibold">
                    سعر الاشتراك
                </span>

                <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-[#00406E]">
                    {course.price}
                    </span>

                    <span className="text-xs font-bold text-[#C5922E]">
                    ج.م
                    </span>
                </div>

                </div>


                {/* Action Button */}
                {isEnrolled ? (
                    <button
                        onClick={handleStartStudy}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
                    >
                        متابعة الدراسة
                    </button>
                    ) : (
                    <button
                        onClick={handleEnroll}
                        className="w-full bg-[#00406E] hover:bg-[#C5922E] text-white py-3.5 rounded-xl font-bold transition-all shadow-md active:scale-95"
                    >
                        اشترك الآن
                    </button>
                )}


                {/* Security */}
                <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400 font-semibold border-t border-gray-100 pt-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                دفع آمن ومشفر 100%
                </div>

            </div>
            </div>

      </div>
    </div>
  );
}