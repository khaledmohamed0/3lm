import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';
import { 
  Bell, Flame, CheckCircle2, Circle, Video, Calendar, 
  BookOpen, MessageSquare, Plus, Award, PlayCircle, 
  ChevronLeft, Star, ArrowLeft, Wallet, X 
} from 'lucide-react';




export default function StudentDashboard({onViewAllCourses, onBrowseAllCourses, onOpenCourse, onLogout}) {
  const [student, setStudent] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  const [courses, setCourses] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [selectedExamAttempt, setSelectedExamAttempt] = useState(null);
  

  const [teacherNews, setTeacherNews] = useState([]);
  const [liveLessons, setLiveLessons] = useState([]);
  const [liveLessonsToday, setLiveLessonsToday] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");

  const [examResults, setExamResults] = useState([]);

  const [streakDays, setStreakDays] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogout, setShowLogout] = useState(false);  


  const [learningStats, setLearningStats] = useState(null);


    const handleAddTask = async (e) => {
      e.preventDefault();

      if (!newTaskText.trim()) return;

      try {
        const response = await api.post("/courses/student/todos/", {
          title: newTaskText.trim(),
        });

        setTasks((prev) => [...prev, response.data.todo]);
        setNewTaskText("");
      } catch (error) {
        console.error("Add Task Error:", error);
      }
    };

    const toggleTask = async (taskId) => {
      try {
        const task = tasks.find((t) => t.id === taskId);

        if (!task) return;

        const response = await api.patch(
          `/courses/student/todos/${taskId}/`,
          {
            is_completed: !task.is_completed,
          }
        );

        setTasks((prev) =>
          prev.map((t) =>
            t.id === taskId ? response.data.todo : t
          )
        );
      } catch (error) {
        console.error("Toggle Task Error:", error);
      }
    };


    

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("access_token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // =========================
        // Student Dashboard
        // =========================

        const dashboardResponse = await api.get(
          "/courses/dashboard/",
          {
            headers,
          }
        );


        const statsResponse = await api.get(
          "/courses/student/learning-stats/"
        );

        setStreakDays(
          statsResponse.data.streak_days || 0
        );

        

        const dashboardData = dashboardResponse.data;

        console.log("Dashboard Data:", dashboardData);

        setStudent(dashboardData.student);


        const todosResponse = await api.get("/courses/student/todos/");
        setTasks(todosResponse.data.todos || []);


        setWalletBalance(
          Number(dashboardData.wallet?.balance || 0)
        );

        setEnrolledCourses(
          dashboardData.courses || []
        );



        const notificationsResponse = await api.get(
          "/courses/student/notifications/"
        );

        setNotifications(
          notificationsResponse.data.notifications || []
        );

        // =========================
        // All Published Courses
        // =========================

        const coursesResponse = await api.get(
          "/courses/student/courses/",
          {
            headers,
          }
        );

        const resultsResponse = await api.get("/courses/exam-results/");
        setExamResults(resultsResponse.data.results || []);

        const allCourses = coursesResponse.data;

        console.log("All Courses:", allCourses);


        // =========================
        // Recommended Courses
        // =========================

        const recommendedCoursesResponse = await api.get(
          "/courses/student/recommended-courses/"
        );

        setRecommendedCourses(
          recommendedCoursesResponse.data.courses || []
        );


        

        // =========================
        // Live Lessons
        // =========================

        const liveLessonsResponse = await api.get(
          "/courses/student/live-lessons/"
        );

        setLiveLessons(
          liveLessonsResponse.data.live_lessons || []
        );

        setLiveLessonsToday(
          liveLessonsResponse.data.today_count || 0
        );


        // =========================
        // Teacher News
        // =========================

        const teacherNewsResponse = await api.get(
          "/courses/student/news/"
        );

        setTeacherNews(
          teacherNewsResponse.data.news || []
        );

      } catch (err) {
        console.error("Dashboard Error:", err);

        setError(
          err.response?.data?.detail ||
          "حدث خطأ أثناء تحميل بيانات لوحة التحكم."
        );
      } finally {
        setLoading(false);
      }
    };


    const fetchLearningStats = async () => {
      try {
        const response = await api.get(
          "/courses/student/learning-stats/"
        );

        console.log("LEARNING STATS:", response.data);

        setLearningStats(response.data);

      } catch (error) {
        console.error(
          "Failed to fetch learning stats:",
          error.response?.data || error
        );
      }
    };

  

 

    fetchDashboardData();
    fetchLearningStats();
  }, []);



  

  // الكورسات المشترك فيها

  



  return (
    <div className="min-h-screen bg-[#F7F6F2] font-arabic dir-rtl text-right p-4 md:p-8" dir="rtl">
      
      {/* Header */}
      {/* Header Responsive */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-amber-100/60 mb-8 gap-4">
        
        {/* Welcome Text */}
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#00406E]">
            أهلاً بك يا {student?.username || "طالب"} 👋
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1">
            مرحباً بك في منصة <span className="font-bold text-[#C5922E]">عِلّْم</span> التعليمية
          </p>
        </div>

        {/* Top Right Controls & Wallet */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end w-full md:w-auto gap-3">
          
          {/* Wallet Banner - Fully Responsive */}
          <button
            type="button"
            onClick={() => navigate("/student/wallet")}
            className="flex-1 sm:flex-initial flex items-center justify-between sm:justify-start gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-sm min-w-[140px] hover:shadow-md hover:scale-[1.02] transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-amber-100" />
              </div>

              <div className="text-right">
                <p className="text-[9px] sm:text-[10px] text-amber-100 font-semibold leading-tight">
                  رصيد المحفظة
                </p>

                <p className="text-xs sm:text-sm font-black leading-tight mt-0.5">
                  {walletBalance} ج.م
                </p>
              </div>
            </div>
          </button>

          {/* Notifications & Profile Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Notifications Button */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 sm:p-3 bg-gray-50 hover:bg-amber-50/50 rounded-xl transition text-gray-700 border border-gray-100"
                aria-label="التنبيهات"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-[#00406E]" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute left-0 sm:left-0 right-auto mt-3 w-72 sm:w-80 bg-white rounded-2xl shadow-2xl border border-amber-100/80 p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                    <h3 className="font-bold text-[#00406E] text-xs sm:text-sm">التنبيهات والإشعارات</h3>
                    <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(notification => (
                      <div key={notification.id} className="p-2.5 bg-amber-50/30 rounded-xl border border-amber-100/50 text-right space-y-1">
                        <h4 className="text-xs font-bold text-[#00406E]">{notification.title}</h4>
                        <p className="text-[11px] text-gray-500 leading-snug">{notification.content}</p>
                        <span className="text-[9px] text-gray-400 block">{notification.course_title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            
            
            <div className="flex items-center gap-2 pr-2 border-r border-gray-200">
              <div className="w-9 h-9 sm:w-11 sm:h-11 bg-[#00406E] text-white rounded-xl flex items-center justify-center font-bold text-sm sm:text-lg">
                {(student?.first_name || student?.username || "ط").charAt(0)}
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="text-xs text-red-500 font-bold hover:underline"
                >
                  خروج
                </button>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content (Left / 2 Cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Stats Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-amber-100 text-sm font-semibold">استمرار المذاكرة (Streak)</span>
                <h3 className="text-3xl font-extrabold mt-1">{streakDays} أيام متتالية!</h3>
                <p className="text-xs text-amber-100 mt-1">واصل التعلّم يومياً للحفاظ على تقدمك.</p>
              </div>
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Flame className="w-10 h-10 text-white fill-amber-300 animate-pulse" />
              </div>
            </div>

            <div className="bg-[#00406E] text-white p-6 rounded-2xl shadow-md flex items-center justify-between">
              <div>
                <span className="text-blue-200 text-sm font-semibold">الحصص المباشرة</span>
                <h3 className="text-3xl font-extrabold mt-1">{liveLessonsToday} {liveLessonsToday === 1 ? "حصة" : "حصص"} اليوم</h3>
                <p className="text-xs text-blue-200 mt-1">تأكد من الحضور في الموعد المحدد.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <Video className="w-10 h-10 text-[#C5922E]" />
              </div>
            </div>
          </div>

          {/* 1. Recommended Courses Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-[#00406E] flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#C5922E]" /> الكورسات المقترحة لك
                </h2>
                <p className="text-xs text-gray-400 mt-1">اختر ما يناسب شغفك ومرحلتك الدراسية</p>
              </div>
              <button
                onClick={() => navigate("/student/courses")}
                className="bg-amber-50 hover:bg-amber-100 text-[#C5922E] text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition border border-amber-200/60"
              >
                استكشف كل الكورسات
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {recommendedCourses.slice(0, 4).map((course) => (
                <div 
                  key={course.id}
                    onClick={() => navigate(`/student/courses/${course.id}`)}
                  className="group relative bg-white rounded-2xl border border-gray-100 hover:border-[#C5922E]/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden h-40">
                    <img
                      src={
                        course.thumbnail
                          ? course.thumbnail
                          : "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&auto=format&fit=crop&q=60"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#00406E] text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                      {course.category}
                    </span>
                    <span className="absolute bottom-3 right-3 text-white text-xs font-medium flex items-center gap-1">
                      {course.teacher?.username}
                    </span>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-extrabold text-[#00406E] text-base group-hover:text-[#C5922E] transition line-clamp-1">
                      {course.title}
                    </h3>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-gray-700">{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-[#00406E]">{Number(course.price).toLocaleString("en-US")} ج.م</span>
                        <div className="w-8 h-8 rounded-lg bg-[#00406E] group-hover:bg-[#C5922E] text-white flex items-center justify-center transition">
                          <ArrowLeft className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Enrolled Courses Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60">
            <h2 className="text-xl font-bold text-[#00406E] mb-6 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-[#C5922E]" /> الكورسات المشترك فيها
            </h2>

            <div className="space-y-4">
              {enrolledCourses.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-3 hover:border-amber-200 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-[#00406E]">{c.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{c.teacher}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        if (!c?.next_lesson?.id) {
                          console.log("No next lesson available:", c);
                          return;
                        }

                        navigate(
                          `/student/courses/${c.id}/lessons/${c.next_lesson.id}`
                        );
                      }}
                      className="bg-[#00406E] text-white text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-opacity-90 transition shadow-sm"
                    >
                      متابعة التعلم
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>التقدم: {c.progress}%</span>
                      <span>{c.completed_lessons} من {c.total_lessons} درس</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#C5922E] h-full rounded-full transition-all duration-300" style={{ width: `${c.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
                    
            {/* 3. Exam Results Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60">
                <h2 className="text-xl font-bold text-[#00406E] mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#C5922E]" /> درجات الامتحانات والاختبارات
                </h2>

                <div className="space-y-3">
                    {examResults.map((exam) => (
                    <div
                        key={exam.attempt_id}
                        onClick={() =>
                            navigate(
                                `/student/exams/${exam.attempt_id}/analysis`
                            )
                        }
                        className="p-4 rounded-xl border border-gray-100 flex items-center justify-between bg-white hover:bg-amber-50/20 transition cursor-pointer"
                    >
                        <div className="space-y-1">
                        <h4 className="font-bold text-[#00406E] text-sm">
                            {exam.exam_title}
                        </h4>

                        <p className="text-xs text-gray-400">
                            {exam.course_title} • {exam.lesson_title}
                        </p>

                        <p className="text-xs text-gray-400">
                            {exam.created_at
                            ? new Date(exam.created_at).toLocaleDateString("ar-EG")
                            : ""}
                        </p>
                        </div>

                        <div className="flex items-center gap-4">
                        <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                            exam.passed
                                ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                                : "text-red-600 bg-red-50 border-red-100"
                            }`}
                        >
                            {exam.passed ? "ناجح" : "راسب"}
                        </span>

                        <div className="text-left">
                            <span className="text-base font-extrabold text-[#00406E]">
                                {exam.score}%
                            </span>

                            <p className="text-xs text-[#C5922E] font-bold">
                                نسبة النجاح المطلوبة: {exam.passing_score}%
                            </p>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>



        </div>

        {/* Sidebar (Right Column) */}
        <div className="space-y-8">
          
          {/* Daily Tasks */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60">
              <h2 className="text-xl font-bold text-[#00406E] mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C5922E]" /> المهام اليومية
              </h2>

              <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="أضف مهمة جديدة..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-[#00406E]"
                />

                <button
                  type="submit"
                  className="bg-[#00406E] text-white p-2 rounded-lg hover:bg-opacity-90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition ${
                      task.is_completed
                        ? "bg-gray-50 border-gray-100 text-gray-400"
                        : "bg-amber-50/20 border-amber-100 text-gray-800"
                    }`}
                  >
                    <button className="mt-0.5">
                      {task.is_completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-amber-500" />
                      )}
                    </button>

                    <span
                      className={`text-sm font-medium ${
                        task.is_completed ? "line-through" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          {/* Teachers' News (Below Daily Tasks) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60">
              <h2 className="text-xl font-bold text-[#00406E] mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#C5922E]" /> أخبار المدرسين
              </h2>

              <div className="space-y-4">
                {teacherNews.map((post) => (
                  <div
                    key={post.id}
                    className="border-b border-gray-100 pb-4 last:pb-0 last:border-0"
                  >
                    <div className="flex items-center gap-2.5 mb-2">
                      
                      {/* Teacher Avatar */}
                      <div className="w-8 h-8 rounded-full bg-[#00406E] text-white flex items-center justify-center font-bold text-xs border border-amber-200">
                        {post.teacher?.charAt(0)?.toUpperCase() || "م"}
                      </div>

                      <div>
                        <h4 className="font-bold text-[#00406E] text-xs">
                          {post.teacher}
                        </h4>

                        <p className="text-[10px] text-gray-400">
                          {post.created_at
                            ? new Date(post.created_at).toLocaleDateString("ar-EG")
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* News Title */}
                    <h4 className="font-bold text-[#00406E] text-xs mb-1">
                      {post.title}
                    </h4>

                    {/* News Content */}
                    <p className="text-gray-700 text-xs leading-relaxed">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          
          {/* Live Schedule */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60">
            <h2 className="text-xl font-bold text-[#00406E] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C5922E]" /> جدول الحصص اليوم
            </h2>

            <div className="space-y-3">
              {liveLessons.map((item) => {
                const startTime = new Date(item.start_time);

                const endTime = new Date(
                  startTime.getTime() + item.duration_minutes * 60 * 1000
                );

                const now = new Date();

                const isLive = now >= startTime && now <= endTime;

                return (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[#00406E] text-sm">
                        {item.title}
                      </h4>

                      {isLive && (
                        <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded font-bold animate-pulse">
                          مباشر
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      {item.teacher_name}
                    </p>

                    <p className="text-xs text-gray-500">
                      {startTime.toLocaleDateString("ar-EG", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}

                      {" • "}

                      {startTime.toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Africa/Cairo",
                      })}

                      {" - "}

                      {endTime.toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Africa/Cairo",
                      })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}