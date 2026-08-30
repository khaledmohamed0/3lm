import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Award,
  BookOpen,
  AlertCircle,
  Lightbulb,
  Clock,
  Loader2,
} from "lucide-react";

import api from "../../api/axios";

export default function ExamAnalysis({ onBack, onRetryExam }) {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [filter, setFilter] = useState("all");

  const [examResult, setExamResult] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH EXAM ANALYSIS
  // =========================================================

  useEffect(() => {
    const fetchExamAnalysis = async () => {
      if (!attemptId) {
        setError("رقم محاولة الامتحان غير موجود.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        console.log(
          "Fetching Exam Analysis:",
          attemptId
        );

        const response = await api.get(
          `/courses/exam-analysis/${attemptId}/`
        );

        console.log(
          "Exam Analysis Response:",
          response.data
        );

        setExamResult(response.data);

      } catch (err) {
        console.error(
          "Exam Analysis Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "حدث خطأ أثناء تحميل تحليل الامتحان."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExamAnalysis();
  }, [attemptId]);

  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    navigate("/student/dashboard");
  };

  // =========================================================
  // RETRY EXAM
  // =========================================================

  const handleRetry = () => {
    if (onRetryExam) {
      onRetryExam(examResult?.exam_id);
      return;
    }

    if (examResult?.exam_id) {
      navigate(
        `/student/courses/exams/${examResult.exam_id}`
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#F7F6F2] flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">

          <Loader2 className="w-10 h-10 text-[#00406E] animate-spin mx-auto mb-4" />

          <p className="text-sm font-bold text-[#00406E]">
            جاري تحميل تحليل الامتحان...
          </p>

        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !examResult) {
    return (
      <div
        className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-6"
        dir="rtl"
      >
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-red-100 text-center max-w-md w-full">

          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

          <h2 className="text-lg font-black text-gray-800 mb-2">
            تعذر تحميل تحليل الامتحان
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            {error || "لم يتم العثور على بيانات الامتحان."}
          </p>

          <button
            onClick={handleBack}
            className="bg-[#00406E] text-white px-6 py-3 rounded-xl font-bold text-sm"
          >
            العودة للوحة التحكم
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // DATA
  // =========================================================

  const questions = examResult.questions || [];

  const correctCount =
    examResult.correct_answers ?? 0;

  const wrongCount =
    examResult.wrong_count ??
    examResult.wrong_answers ??
    0;

  const totalQuestions =
    examResult.total_questions ??
    questions.length;

  const percentage =
    totalQuestions > 0
      ? Math.round(
          (correctCount / totalQuestions) * 100
        )
      : 0;

  const filteredQuestions =
    filter === "wrong"
      ? questions.filter((q) => !q.is_correct)
      : filter === "correct"
      ? questions.filter((q) => q.is_correct)
      : questions;

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formattedDate =
    examResult.completed_at
      ? new Date(
          examResult.completed_at
        ).toLocaleDateString("ar-EG")
      : "";

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (minutes) => {
    if (!minutes) return "غير محدد";

    return `${minutes} دقيقة`;
  };

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div
      className="min-h-screen bg-[#F7F6F2] font-arabic dir-rtl text-right p-4 md:p-8"
      dir="rtl"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-amber-100/60 shadow-sm max-w-4xl mx-auto">

        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-[#00406E] font-bold text-sm hover:text-[#C5922E] transition"
        >
          <ArrowRight className="w-5 h-5" />

          العودة للوحة التحكم
        </button>

        <h1 className="text-base sm:text-lg font-black text-[#00406E] flex items-center gap-2">

          <BookOpen className="w-5 h-5 text-[#C5922E]" />

          تحليل الامتحان والأخطاء

        </h1>

      </div>

      <div className="max-w-4xl mx-auto space-y-6">

        {/* =================================================
            RESULT SUMMARY
        ================================================= */}

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-amber-100/60 shadow-sm space-y-6">

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-100">

            <div>

              <span className="text-xs font-bold text-[#C5922E] bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
                نتيجة الاختبار
              </span>

              <h2 className="text-lg sm:text-xl font-black text-[#00406E]">
                {examResult.exam_title}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                {examResult.course_title} •{" "}
                {examResult.lesson_title}
              </p>

              {formattedDate && (
                <p className="text-xs text-gray-400 mt-1">
                  تاريخ الاختبار: {formattedDate}
                </p>
              )}

            </div>

            <button
              onClick={handleRetry}
              className="bg-[#00406E] hover:bg-[#002845] text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 text-sm w-full sm:w-auto justify-center"
            >
              <RotateCcw className="w-4 h-4" />

              إعادة المحاولة
            </button>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            {/* Score */}

            <div className="bg-[#00406E]/5 p-4 rounded-2xl border border-[#00406E]/10 flex flex-col items-center justify-center text-center">

              <Award className="w-6 h-6 text-[#00406E] mb-1" />

              <span className="text-xs text-gray-500 font-bold">
                الدرجة
              </span>

              <span className="text-xl sm:text-2xl font-black text-[#00406E] mt-1">
                {examResult.score}%
              </span>

            </div>

            {/* Percentage */}

            <div
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center ${
                examResult.passed
                  ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                  : "bg-rose-50 border-rose-100 text-rose-700"
              }`}
            >

              <span className="text-xs font-bold opacity-80">
                حالة الامتحان
              </span>

              <span className="text-xl sm:text-2xl font-black mt-1">
                {examResult.passed
                  ? "ناجح"
                  : "راسب"}
              </span>

            </div>

            {/* Correct */}

            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex flex-col items-center justify-center text-center">

              <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-1" />

              <span className="text-xs text-emerald-800 font-bold">
                إجابات صحيحة
              </span>

              <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
                {correctCount}
              </span>

            </div>

            {/* Wrong */}

            <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex flex-col items-center justify-center text-center">

              <XCircle className="w-6 h-6 text-rose-600 mb-1" />

              <span className="text-xs text-rose-800 font-bold">
                إجابات خاطئة
              </span>

              <span className="text-xl sm:text-2xl font-black text-rose-700 mt-1">
                {wrongCount}
              </span>

            </div>

          </div>

          {/* Extra Info */}

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">

            <span className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl font-bold">
              إجمالي الأسئلة: {totalQuestions}
            </span>

            <span className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl font-bold">
              درجة النجاح: {examResult.passing_score}%
            </span>

            {examResult.time_limit && (
              <span className="bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                زمن الامتحان:{" "}
                {formatTime(examResult.time_limit)}
              </span>
            )}

          </div>

        </div>

        {/* =================================================
            FILTER
        ================================================= */}

        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-amber-100/60 shadow-sm flex-wrap gap-3">

          <span className="text-xs font-bold text-[#00406E]">
            تصفية الأسئلة:
          </span>

          <div className="flex items-center gap-2 flex-wrap">

            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === "all"
                  ? "bg-[#00406E] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-amber-50"
              }`}
            >
              جميع الأسئلة ({questions.length})
            </button>

            <button
              onClick={() => setFilter("wrong")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filter === "wrong"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100"
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />

              الأخطاء فقط ({wrongCount})
            </button>

            <button
              onClick={() => setFilter("correct")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                filter === "correct"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />

              الإجابات الصحيحة ({correctCount})
            </button>

          </div>

        </div>

        {/* =================================================
            QUESTIONS
        ================================================= */}

        <div className="space-y-4">

          {filteredQuestions.map((q, idx) => (

            <div
              key={q.id}
              className={`bg-white rounded-3xl border p-6 shadow-sm transition space-y-4 ${
                q.is_correct
                  ? "border-emerald-200"
                  : "border-rose-200"
              }`}
            >

              {/* Question Header */}

              <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">

                <div className="flex items-start gap-3">

                  <span className="w-8 h-8 rounded-full bg-gray-100 text-[#00406E] font-black text-xs flex items-center justify-center shrink-0">
                    {q.order ?? idx + 1}
                  </span>

                  <h3 className="font-bold text-sm sm:text-base text-[#00406E] leading-relaxed">
                    {q.question}
                  </h3>

                </div>

                {q.is_correct ? (

                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">

                    <CheckCircle2 className="w-4 h-4" />

                    إجابة صحيحة

                  </span>

                ) : (

                  <span className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">

                    <XCircle className="w-4 h-4" />

                    إجابة خاطئة

                  </span>

                )}

              </div>

              {/* =================================================
                  QUESTION IMAGE
              ================================================= */}

              {q.question_image && (

                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 flex justify-center">

                  <img
                    src={q.question_image}
                    alt={`صورة السؤال ${q.order ?? idx + 1}`}
                    className="max-w-full max-h-[400px] object-contain rounded-xl"
                  />

                </div>

              )}

              {/* =================================================
                  OPTIONS
              ================================================= */}

              <div className="space-y-2 pt-1">

                {Object.entries(q.options || {}).map(
                  ([key, value]) => {

                    const isUserChoice =
                      q.selected_answer === key;

                    const isCorrectChoice =
                      q.correct_answer === key;

                    let optionStyle =
                      "bg-gray-50 border-gray-200 text-gray-700";

                    let badgeText = null;

                    if (isCorrectChoice) {

                      optionStyle =
                        "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold";

                      badgeText =
                        "الإجابة الصحيحة ✅";
                    }

                    if (
                      isUserChoice &&
                      !q.is_correct
                    ) {

                      optionStyle =
                        "bg-rose-50 border-rose-300 text-rose-900 font-bold";

                      badgeText =
                        "إجابتك ❌";
                    }

                    if (
                      isUserChoice &&
                      q.is_correct
                    ) {

                      badgeText =
                        "إجابتك ✓";
                    }

                    return (

                      <div
                        key={key}
                        className={`p-3.5 rounded-2xl border text-xs sm:text-sm flex items-center justify-between gap-3 transition ${optionStyle}`}
                      >

                        <div className="flex items-center gap-2.5">

                          <span className="w-6 h-6 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-bold">
                            {key}
                          </span>

                          <span>
                            {value}
                          </span>

                        </div>

                        {badgeText && (

                          <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/80 border shadow-xs shrink-0 font-bold">
                            {badgeText}
                          </span>

                        )}

                      </div>

                    );
                  }
                )}

              </div>

              {/* =================================================
                  EXPLANATION
              ================================================= */}

              {q.explanation && (

                <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-2xl space-y-1.5 mt-3">

                  <div className="flex items-center gap-2 text-xs font-black text-[#C5922E]">

                    <Lightbulb className="w-4 h-4 shrink-0" />

                    <span>
                      توضيح وشرح الإجابة الصحيحة:
                    </span>

                  </div>

                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed pr-6">
                    {q.explanation}
                  </p>

                </div>

              )}

            </div>

          ))}

          {filteredQuestions.length === 0 && (

            <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 text-gray-400 space-y-2">

              <AlertCircle className="w-10 h-10 mx-auto text-gray-300" />

              <p className="font-bold text-sm">
                لا توجد أسئلة تطابق التصفية الحالية.
              </p>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}