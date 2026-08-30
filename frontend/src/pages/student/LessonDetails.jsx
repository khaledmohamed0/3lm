import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  Lock,
  FileDown,
  Upload,
  Play,
  Check,
  Send,
  ChevronRight,
  Clock,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

import api from "../../api/axios";

export default function LessonViewer({
  lessonId,
  onBack,
}) {


   
  // =========================================================
  // LESSON DATA
  // =========================================================

  const [lesson, setLesson] = useState(null);
  const [exam, setExam] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // EXAM STATES
  // =========================================================

  const [quizPassed, setQuizPassed] = useState(false);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [timeLeft, setTimeLeft] = useState(null);

  const [examSubmitting, setExamSubmitting] = useState(false);

  const [examResult, setExamResult] = useState(null);

  // =========================================================
  // LESSON STATES
  // =========================================================

  const [activeTab, setActiveTab] = useState("video");

  const [assignmentUploaded, setAssignmentUploaded] =
    useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const [assignmentSubmitting, setAssignmentSubmitting] =
    useState(false);

  const [showSolutionVideo, setShowSolutionVideo] =
    useState(false);

  const [isLessonCompleted, setIsLessonCompleted] =
    useState(false);


  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionSubmitting, setQuestionSubmitting] = useState(false);



    useEffect(() => {
      const fetchLesson = async () => {
          if (!lessonId) return;

          try {
              setLoading(true);
              setError("");

              console.log("Fetching lesson:", lessonId);

              const response = await api.get(
                  `/courses/lessons/${lessonId}/`
              );

              console.log(
                  "Lesson API Response:",
                  response.data
              );

              setLesson(response.data.lesson);

              const loadedExam = response.data.exam || null;

              setExam(loadedExam);

              setQuizPassed(
                response.data.exam_passed === true
              );

              if (loadedExam) {
                  setTimeLeft(
                      loadedExam.time_limit * 60
                  );
              }

          } catch (err) {
              console.error(
                  "Lesson Details Error:",
                  err
              );

              setError(
                  err.response?.data?.detail ||
                  "حدث خطأ أثناء تحميل الدرس."
              );
          } finally {
              setLoading(false);
          }
      };

      fetchLesson();
  }, [lessonId]);
  // =========================================================
  // QUESTIONS / DISCUSSION
  // =========================================================


  const [newQuestion, setNewQuestion] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {

      if (!lessonId) return;

      try {

        setQuestionsLoading(true);

        const response = await api.get(
          `/courses/lessons/${lessonId}/questions/`
        );

        console.log(
          "Lesson Questions:",
          response.data
        );

        setQuestions(
          response.data.results || response.data
        );

      } catch (err) {

        console.error(
          "Questions Error:",
          err
        );

      } finally {

        setQuestionsLoading(false);

      }
    };

    fetchQuestions();

  }, [lessonId]);


  // =========================================================
  // EXAM TIMER
  // =========================================================

  useEffect(() => {
    if (
      !exam ||
      quizPassed ||
      quizSubmitted ||
      timeLeft === null
    ) {
      return;
    }

    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [
    exam,
    quizPassed,
    quizSubmitted,
    timeLeft,
  ]);

  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // =========================================================
  // SELECT ANSWER
  // =========================================================

  const handleSelectAnswer = (
    questionId,
    answer
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // =========================================================
  // SUBMIT EXAM
  // =========================================================

  const handleSubmitQuiz = async () => {
    if (
      !exam ||
      examSubmitting ||
      quizSubmitted
    ) {
      return;
    }

    try {
      setExamSubmitting(true);

      const response = await api.post(
        `/courses/exams/${exam.id}/submit/`,
        {
          answers: selectedAnswers,
        }
      );

      const result = response.data;

      setExamResult(result);
      setQuizSubmitted(true);

      // -----------------------------------------------------
      // IMPORTANT
      // Backend هو اللي بيحدد النجاح
      // مش Frontend
      // -----------------------------------------------------

      if (result.passed) {
        setQuizPassed(true);
      }

    } catch (err) {
      console.error(
        "Submit Exam Error:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "حدث خطأ أثناء تسليم الامتحان."
      );
    } finally {
      setExamSubmitting(false);
    }
  };

  // =========================================================
  // SELECT ASSIGNMENT FILE
  // =========================================================

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      file.type !== "application/pdf"
    ) {
      alert(
        "من فضلك اختر ملف PDF فقط."
      );

      return;
    }

    setSelectedFile(file);
  };

  // =========================================================
  // SUBMIT ASSIGNMENT
  // =========================================================

  const submitAssignment = async () => {
    if (
      !selectedFile ||
      assignmentSubmitting
    ) {
      return;
    }

    try {
      setAssignmentSubmitting(true);

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const response = await api.post(
        `/courses/lessons/${lesson.id}/assignment/submit/`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      console.log(
        "Assignment submitted:",
        response.data
      );

      setAssignmentUploaded(true);

      // بعد رفع الواجب نفتح solution video
      setShowSolutionVideo(true);

    } catch (err) {
      console.error(
        "Assignment Upload Error:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "حدث خطأ أثناء رفع الواجب."
      );
    } finally {
      setAssignmentSubmitting(false);
    }
  };

  // =========================================================
  // COMPLETE LESSON
  // =========================================================

  const handleCompleteLesson = async () => {
    if (!lesson) {
      return;
    }

    try {
      const response = await api.post(
        `/courses/lessons/${lesson.id}/complete/`
      );

      console.log(
        "Lesson completed:",
        response.data
      );

      setIsLessonCompleted(true);

    } catch (err) {
      console.error(
        "Complete Lesson Error:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "حدث خطأ أثناء إكمال الدرس."
      );
    }
  };

  // =========================================================
  // ADD QUESTION
  // =========================================================

  const handleAddQuestion = async (e) => {

    e.preventDefault();

    if (
      !newQuestion.trim() ||
      questionSubmitting
    ) {
      return;
    }

    try {

      setQuestionSubmitting(true);

      const response = await api.post(
        `/courses/lessons/${lesson.id}/questions/`,
        {
          question: newQuestion.trim(),
        }
      );

      console.log(
        "Question Created:",
        response.data
      );

      setQuestions((prev) => [
        response.data,
        ...prev,
      ]);

      setNewQuestion("");

    } catch (err) {

      console.error(
        "Add Question Error:",
        err
      );

      alert(
        err.response?.data?.detail ||
        "حدث خطأ أثناء إرسال السؤال."
      );

    } finally {

      setQuestionSubmitting(false);

    }
  };


  const getMediaUrl = (path) => {
      if (!path) return null;

      if (path.startsWith("http")) {
          return path;
      }

      return `http://127.0.0.1:8000${path}`;
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
          <div className="w-10 h-10 border-4 border-[#00406E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <p className="text-sm font-bold text-[#00406E]">
            جاري تحميل الدرس...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div
        className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-6"
        dir="rtl"
      >
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 text-center max-w-md">
          <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />

          <h2 className="font-extrabold text-gray-800 mb-2">
            تعذر تحميل الدرس
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            {error}
          </p>

          <button
            onClick={onBack}
            className="bg-[#00406E] text-white px-6 py-2.5 rounded-xl text-sm font-bold"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return null;
  }

  // =========================================================
  // EXAM RESULT - FAILED
  // =========================================================

  if (
    exam &&
    quizSubmitted &&
    !quizPassed
  ) {
    return (
      <div
        className="min-h-screen bg-[#F7F6F2] flex items-center justify-center p-6"
        dir="rtl"
      >
        <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm border border-red-100 text-center">

          <AlertTriangle className="w-14 h-14 text-red-500 mx-auto mb-4" />

          <h2 className="text-xl font-black text-gray-800">
            لم تجتز الاختبار
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            حصلت على {examResult?.score || 0}%
          </p>

          <p className="text-xs text-gray-400 mt-1">
            نسبة النجاح المطلوبة:{" "}
            {examResult?.passing_score ||
              exam.passing_score}
            %
          </p>

          <button
            onClick={onBack}
            className="mt-6 bg-[#00406E] text-white px-6 py-3 rounded-xl font-bold text-sm"
          >
            العودة للدورة
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // EXAM SCREEN
  // =========================================================

  if (
    exam &&
    !quizPassed
  ) {
    const examQuestions =
      exam.questions || [];

    return (
      <div
        className="min-h-screen bg-[#F7F6F2] font-arabic dir-rtl text-right flex flex-col justify-between"
        dir="rtl"
      >

        {/* Exam Header */}

        <header className="bg-white border-b border-amber-100/80 sticky top-0 z-50 px-6 py-4 shadow-sm flex items-center justify-between">

          <div className="flex items-center gap-3">

            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-xl transition text-[#00406E]"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div>

              <h1 className="text-base sm:text-lg font-black text-[#00406E]">
                {exam.title}
              </h1>

              <p className="text-xs text-gray-400">
                {lesson.title}
              </p>

            </div>

          </div>

          {/* Timer */}

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm sm:text-base font-black border transition ${
              timeLeft < 120
                ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
                : "bg-amber-50 text-[#00406E] border-amber-200"
            }`}
          >

            <Clock
              className={`w-5 h-5 ${
                timeLeft < 120
                  ? "text-red-500"
                  : "text-[#C5922E]"
              }`}
            />

            <span>
              {formatTime(timeLeft)}
            </span>

          </div>

        </header>

        {/* Exam Body */}

        <main className="max-w-4xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">

          {/* Exam Info */}

          <div className="bg-gradient-to-r from-[#00406E] to-[#002845] text-white p-6 rounded-2xl shadow-md flex items-center justify-between">

            <div className="space-y-1">

              <span className="text-xs bg-[#C5922E] text-white px-3 py-1 rounded-full font-bold">
                إجباري
              </span>

              <h2 className="text-xl font-extrabold mt-2">
                {exam.title}
              </h2>

              <p className="text-xs text-gray-300">
                يجب عليك الحصول على نسبة{" "}
                {exam.passing_score}% على الأقل لفتح المحاضرة الرئيسية.
              </p>

            </div>

            <ShieldCheck className="w-12 h-12 text-[#C5922E] hidden sm:block opacity-90" />

          </div>

          {/* Questions */}

          {examQuestions.map(
            (question, index) => (
              <div
                key={question.id}
                className="bg-white p-6 rounded-2xl border border-amber-100/60 shadow-sm space-y-4"
              >

                <div className="flex justify-between items-center pb-3 border-b border-gray-100">

                  <span className="font-bold text-[#00406E] text-sm">
                    السؤال {index + 1} من{" "}
                    {examQuestions.length}
                  </span>

                  <span className="text-xs font-semibold text-gray-400">
                    درجة
                  </span>

                </div>

                <div className="space-y-4">

                  <p className="font-bold text-gray-800 text-sm leading-relaxed">
                      {question.question}
                  </p>

                  {question.question_image && (
                      <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                          <img
                              src={getMediaUrl(question.question_image)}
                              alt={`صورة السؤال ${index + 1}`}
                              className="w-full max-h-96 object-contain rounded-xl"
                          />
                      </div>
                  )}

              </div>

                <div className="space-y-2.5 pt-2">

                  {[
                    {
                      key: "A",
                      value:
                        question.option_a,
                    },
                    {
                      key: "B",
                      value:
                        question.option_b,
                    },
                    {
                      key: "C",
                      value:
                        question.option_c,
                    },
                    {
                      key: "D",
                      value:
                        question.option_d,
                    },
                  ].map((option) => (

                    <label
                      key={option.key}
                      onClick={() =>
                        handleSelectAnswer(
                          question.id,
                          option.key
                        )
                      }
                      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer text-xs font-bold transition ${
                        selectedAnswers[
                          question.id
                        ] === option.key
                          ? "border-[#00406E] bg-amber-50/50 text-[#00406E]"
                          : "border-gray-200 hover:border-amber-300 bg-white text-gray-700"
                      }`}
                    >

                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={
                          selectedAnswers[
                            question.id
                          ] === option.key
                        }
                        readOnly
                        className="accent-[#00406E]"
                      />

                      <span>
                        {option.value}
                      </span>

                    </label>

                  ))}

                </div>

              </div>
            )
          )}

        </main>

        {/* Exam Footer */}

        <footer className="bg-white border-t border-amber-100 p-4 sticky bottom-0 z-40 shadow-lg">

          <div className="max-w-4xl mx-auto flex items-center justify-between">

            <span className="text-xs text-gray-500 font-bold">
              تأكد من إجابة جميع الأسئلة قبل الإنهاء.
            </span>

            <button
              onClick={handleSubmitQuiz}
              disabled={examSubmitting}
              className={`bg-[#00406E] hover:bg-[#002845] text-white px-8 py-3 rounded-xl font-extrabold text-sm transition shadow-md flex items-center gap-2 ${
                examSubmitting
                  ? "opacity-60 cursor-not-allowed"
                  : ""
              }`}
            >

              <CheckCircle2 className="w-5 h-5 text-[#C5922E]" />

              {examSubmitting
                ? "جاري التسليم..."
                : "إنهاء الامتحان ودخول المحاضرة"}

            </button>

          </div>

        </footer>

      </div>
    );
  }

  // =========================================================
  // MAIN LESSON
  // =========================================================

  return (
    <div
      className="min-h-screen bg-[#F7F6F2] font-arabic dir-rtl text-right p-4 md:p-8"
      dir="rtl"
    >

      {/* Top Header */}

      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-2xl border border-amber-100/60 shadow-sm">

        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#00406E] font-bold text-sm hover:text-[#C5922E] transition"
        >
          <ChevronRight className="w-5 h-5" />

          العودة للدورة التدريبية
        </button>

        <div className="flex items-center gap-2">

          {isLessonCompleted && (
            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5">

              <CheckCircle2 className="w-4 h-4" />

              تم إكمال المحاضرة

            </span>
          )}

          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">

            المحاضرة{" "}
            {String(lesson.order).padStart(2, "0")}:{" "}
            {lesson.title}

          </span>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* =================================================
            LEFT COLUMN
        ================================================= */}

        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-2xl border border-amber-100/60 shadow-sm overflow-hidden">

            {/* Video Header */}

            <div className="bg-[#00406E] text-white p-4 flex justify-between items-center">

              <h3 className="font-bold text-sm flex items-center gap-2">

                <Play className="w-4 h-4 text-[#C5922E]" />

                {showSolutionVideo
                  ? "شرح فيديو حل الواجب"
                  : lesson.title}

              </h3>

              {assignmentUploaded && (
                <button
                  onClick={() =>
                    setShowSolutionVideo(
                      !showSolutionVideo
                    )
                  }
                  className="text-xs bg-[#C5922E] hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg font-bold transition"
                >
                  {showSolutionVideo
                    ? "الرجوع لفيديو الشرح"
                    : "مشاهدة فيديو حل الواجب 🎬"}
                </button>
              )}

            </div>

            {/* Bunny Video */}

            <div className="relative aspect-video bg-black rounded-b-xl overflow-hidden shadow-lg">

              {(showSolutionVideo
                ? lesson.bunny_solution_video_id
                : lesson.bunny_video_id) ? (

                <iframe
                  src={`https://iframe.mediadelivery.net/embed/LIBRARY_ID/${
                    showSolutionVideo
                      ? lesson.bunny_solution_video_id
                      : lesson.bunny_video_id
                  }?autoplay=true`}
                  loading="lazy"
                  className="border-0 absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                  allowFullScreen
                />

              ) : (

                <div className="absolute inset-0 flex items-center justify-center text-white">

                  <div className="text-center">

                    <Play className="w-12 h-12 mx-auto mb-3 opacity-50" />

                    <p className="text-sm font-bold">
                      الفيديو غير متاح حالياً
                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* Tabs */}

            <div className="flex border-b border-gray-100 text-xs font-bold text-gray-500 bg-gray-50/50">

              <button
                onClick={() =>
                  setActiveTab("video")
                }
                className={`px-6 py-3 border-b-2 transition ${
                  activeTab === "video"
                    ? "border-[#C5922E] text-[#00406E] bg-white"
                    : "hover:text-[#00406E]"
                }`}
              >
                تحميل الملخصات
              </button>

              <button
                onClick={() =>
                  setActiveTab("discussion")
                }
                className={`px-6 py-3 border-b-2 transition ${
                  activeTab === "discussion"
                    ? "border-[#C5922E] text-[#00406E] bg-white"
                    : "hover:text-[#00406E]"
                }`}
              >
                الأسئلة والاستفسارات (
                {questions.length}
                )
              </button>

            </div>

            {/* Tab Content */}

            <div className="p-6">

              {activeTab === "video" && (

                <div className="space-y-4">

                  <h4 className="font-bold text-sm text-[#00406E]">
                    ملفات الملازم والملاحظات (PDF):
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* Lesson PDF */}

                    {lesson.lesson_pdf && (

                      <div className="p-3 border rounded-xl flex items-center justify-between bg-amber-50/20 border-amber-100">

                        <div className="flex items-center gap-2">

                          <FileDown className="w-5 h-5 text-[#C5922E]" />

                          <div>

                            <p className="text-xs font-bold text-[#00406E]">
                              ملزمة شرح الدرس.pdf
                            </p>

                            <span className="text-[10px] text-gray-400">
                              ملف الدرس
                            </span>

                          </div>

                        </div>

                        <a
                          href={lesson.lesson_pdf}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#00406E] text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-opacity-90"
                        >
                          تحميل
                        </a>

                      </div>

                    )}

                    {/* Assignment PDF */}

                    {lesson.assignment_pdf && (

                      <div className="p-3 border rounded-xl flex items-center justify-between bg-amber-50/20 border-amber-100">

                        <div className="flex items-center gap-2">

                          <FileDown className="w-5 h-5 text-[#C5922E]" />

                          <div>

                            <p className="text-xs font-bold text-[#00406E]">
                              شيت أسئلة الواجب.pdf
                            </p>

                            <span className="text-[10px] text-gray-400">
                              ملف الواجب
                            </span>

                          </div>

                        </div>

                        <a
                          href={
                            lesson.assignment_pdf
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="bg-[#00406E] text-white text-xs px-3 py-1.5 rounded-lg font-bold hover:bg-opacity-90"
                        >
                          تحميل
                        </a>

                      </div>

                    )}

                  </div>

                </div>

              )}

              {activeTab === "discussion" && (

                <div className="space-y-6">

                  <form
                    onSubmit={handleAddQuestion}
                    className="flex gap-2"
                  >

                    <input
                      type="text"
                      placeholder="اسأل أي سؤال بخصوص المحاضرة..."
                      value={newQuestion}
                      onChange={(e) =>
                        setNewQuestion(
                          e.target.value
                        )
                      }
                      className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#00406E]"
                    />
                    <button
                    type="submit"
                    disabled={
                      !newQuestion.trim() ||
                      questionSubmitting
                    }
                    className={`bg-[#00406E] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 hover:bg-opacity-90 transition ${
                      !newQuestion.trim() || questionSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <Send className="w-4 h-4" />

                    {questionSubmitting
                      ? "جاري الإرسال..."
                      : "إرسال"}
                  </button>

                  </form>

                  <div className="space-y-3">

                    {questionsLoading ? (

                      <div className="text-center py-8">
                        <div className="w-7 h-7 border-4 border-[#00406E] border-t-transparent rounded-full animate-spin mx-auto mb-3" />

                        <p className="text-xs text-gray-400 font-bold">
                          جاري تحميل الأسئلة...
                        </p>
                      </div>

                    ) : questions.length === 0 ? (

                      <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-100">

                        <p className="text-sm font-bold text-gray-500">
                          لا توجد أسئلة حتى الآن.
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          كن أول من يطرح سؤالًا عن المحاضرة.
                        </p>

                      </div>

                    ) : (

                      questions.map((q) => (

                        <div
                          key={q.id}
                          className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs space-y-2"
                        >

                          <div className="flex justify-between items-center">

                            <span className="font-bold text-[#00406E]">
                              {q.student_name}
                            </span>

                            <span className="text-[10px] text-gray-400">
                              {new Date(
                                q.created_at
                              ).toLocaleDateString("ar-EG")}
                            </span>

                          </div>

                          <p className="text-gray-700">
                            {q.question}
                          </p>

                          {q.answer && (

                            <div className="mt-2 p-2.5 bg-amber-50 rounded-lg border border-amber-100 text-[#00406E]">

                              <p className="font-bold text-[11px] text-[#C5922E]">
                                رد المدرس:
                              </p>

                              <p className="text-gray-600 mt-0.5">
                                {q.answer}
                              </p>

                            </div>

                          )}

                        </div>

                      ))

                    )}

                  </div>

                </div>

              )}

            </div>

          </div>

          {/* =================================================
              ASSIGNMENT
          ================================================= */}

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60 space-y-4">

            <div className="flex items-center justify-between">

              <div>

                <h3 className="font-extrabold text-[#00406E] text-base flex items-center gap-2">

                  <Upload className="w-5 h-5 text-[#C5922E]" />

                  تسليم واجب المحاضرة (PDF)

                </h3>

                <p className="text-xs text-gray-400 mt-0.5">
                  ارفع إجابتك ليتم إتاحة فيديو الحل واعتماد إكمال المحاضرة.
                </p>

              </div>

              {assignmentUploaded && (

                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">

                  <Check className="w-3.5 h-3.5" />

                  تم التسليم

                </span>

              )}

            </div>

            {!assignmentUploaded ? (

              <div className="border-2 border-dashed border-amber-200 rounded-xl p-6 text-center space-y-3 bg-amber-50/10">

                <input
                  type="file"
                  accept=".pdf,application/pdf"
                  id="assignment-file"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <label
                  htmlFor="assignment-file"
                  className="cursor-pointer inline-flex items-center gap-2 bg-amber-50 text-[#C5922E] px-4 py-2 rounded-xl text-xs font-bold border border-amber-200 hover:bg-amber-100 transition"
                >
                  <Upload className="w-4 h-4" />

                  اختر ملف الواجب (PDF)
                </label>

                {selectedFile && (

                  <p className="text-xs font-bold text-[#00406E]">
                    {selectedFile.name}
                  </p>

                )}

                <div>

                  <button
                    onClick={submitAssignment}
                    disabled={
                      !selectedFile ||
                      assignmentSubmitting
                    }
                    className={`text-xs px-6 py-2.5 rounded-xl font-bold transition shadow-sm ${
                      selectedFile &&
                      !assignmentSubmitting
                        ? "bg-[#00406E] text-white hover:bg-opacity-90"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                  >

                    {assignmentSubmitting
                      ? "جاري رفع الواجب..."
                      : "تأكيد رفع الواجب وفتح فيديو الحل"}

                  </button>

                </div>

              </div>

            ) : (

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />

                  <span className="text-xs font-bold text-emerald-800">
                    ممتاز! تم رفع الواجب بنجاح.
                  </span>

                </div>

                {!isLessonCompleted && (

                  <button
                    onClick={
                      handleCompleteLesson
                    }
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-xl font-bold transition shadow-sm flex items-center gap-1"
                  >

                    <Sparkles className="w-4 h-4" />

                    إنهاء المحاضرة (Complete Lesson)

                  </button>

                )}

              </div>

            )}

          </div>

        </div>

        {/* =================================================
            RIGHT SIDEBAR
        ================================================= */}

        <div className="space-y-6">

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60 space-y-4">

            <h3 className="font-extrabold text-[#00406E] text-base">
              محتوى الكورس
            </h3>

            <div className="space-y-3">

              <div className="p-3 rounded-xl bg-amber-50 border-2 border-[#C5922E] flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Play className="w-4 h-4 text-[#C5922E] fill-[#C5922E]" />

                  <div>

                    <p className="text-xs font-bold text-[#00406E]">
                      {String(
                        lesson.order
                      ).padStart(2, "0")}
                      . {lesson.title}
                    </p>

                    <span className="text-[10px] text-[#C5922E] font-bold">
                      جاري المشاهدة حالياً
                    </span>

                  </div>

                </div>

              </div>

              <div className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between opacity-60">

                <div className="flex items-center gap-2">

                  <Lock className="w-4 h-4 text-gray-400" />

                  <div>

                    <p className="text-xs font-bold text-gray-600">
                      الدرس التالي
                    </p>

                    <span className="text-[10px] text-gray-400">
                      مغلق
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

