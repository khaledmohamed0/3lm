
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  ArrowLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

import api from "../../api/axios";

export default function AllCourses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    { value: "ALL", label: "الكل" },
    { value: "SECONDARY", label: "الثانوية" },
    { value: "UNIVERSITY", label: "الجامعية" },
    { value: "PREPARATORY", label: "الإعدادية" },
    { value: "PRIMARY", label: "الابتدائية" },
  ];

    useEffect(() => {
        const fetchCourses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/courses/");

            console.log("ALL COURSES:", response.data);

            if (Array.isArray(response.data)) {
            setCourses(response.data);
            } else if (Array.isArray(response.data.results)) {
            setCourses(response.data.results);
            } else {
            setCourses([]);
            }

        } catch (error) {
            console.error("Failed to fetch courses:", error);
            setError("حدث خطأ أثناء تحميل الكورسات.");
        } finally {
            setLoading(false);
        }
        };

        fetchCourses();
    }, []);



  

  // فلترة الكورسات بناءً على البحث والمرحلة
    const filteredCourses = courses.filter((course) => {
        const title = course.title || "";
        const teacher = course.teacher_name || "";

        const matchesSearch =
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
        selectedCategory === "ALL" ||
        course.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

  return (
    <div className="min-h-screen bg-[#F7F6F2] font-arabic dir-rtl text-right p-4 md:p-8" dir="rtl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60 mb-8">
        <div>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#00406E] mb-2 transition"
          >
            <ChevronRight className="w-4 h-4" />
            العودة للوحة التحكم
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#00406E] flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-[#C5922E]" /> استكشف جميع الكورسات
          </h1>
        </div>
        <p className="text-sm text-gray-500 font-semibold">
          إجمالي الكورسات المتاحة: <span className="text-[#C5922E] font-extrabold">{filteredCourses.length}</span>
        </p>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100/60 mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="ابحث باسم الكورس أو اسم المدرس..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 text-sm rounded-xl border border-gray-200 focus:outline-none focus:border-[#C5922E] bg-gray-50/50 transition"
            />
          </div>

          {/* Categories Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-4 h-4 text-[#C5922E] shrink-0" />

            {categories.map((cat) => (
                <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition ${
                    selectedCategory === cat.value
                    ? "bg-[#00406E] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-amber-50 hover:text-[#C5922E]"
                }`}
                >
                {cat.label}
                </button>
            ))}
            </div>

        </div>
      </div>
      
      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div 
              key={course.id}
                onClick={() => navigate(`/student/courses/${course.id}`)}
              className="group relative bg-white rounded-2xl border border-gray-100 hover:border-[#C5922E]/40 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div className="relative overflow-hidden h-48">
                <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80"></div>
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#00406E] text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                    {course.academic_year || course.category}
                </span>
                <span className="absolute bottom-3 right-3 text-white text-xs font-medium flex items-center gap-1">
                  {course.teacher_name || "مدرس المنصة"}
                </span>
              </div>

              <div className="p-5 space-y-4">
                <h3 className="font-extrabold text-[#00406E] text-lg group-hover:text-[#C5922E] transition line-clamp-1">
                  {course.title}
                </h3>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md">
                    
    
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-bold text-gray-700">
                        جديد
                      </span>
                    
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-[#00406E]">
                      {course.price} ج.م
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#00406E] group-hover:bg-[#C5922E] text-white flex items-center justify-center transition">
                      <ArrowLeft className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-12 text-center rounded-2xl border border-gray-100 text-gray-500 space-y-2">
          <p className="font-bold text-lg text-[#00406E]">لا توجد كورسات تطابق بحثك</p>
          <p className="text-xs">جرب البحث بكلمات أخرى أو اختر مرحلة دراسية مختلفة.</p>
        </div>
      )}

    </div>
  );
}
