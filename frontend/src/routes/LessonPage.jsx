import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import LessonDetails from "../pages/student/LessonDetails";

export default function LessonPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  console.log("Course ID:", courseId);
  console.log("Lesson ID:", lessonId);

  if (!lessonId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <p className="text-red-500 font-bold">
            لم يتم تحديد رقم الدرس
          </p>

          <button
            onClick={() =>
              navigate(`/student/courses/${courseId}`)
            }
            className="mt-4 bg-[#00406E] text-white px-5 py-2 rounded-xl"
          >
            العودة للدورة
          </button>
        </div>
      </div>
    );
  }

  return (
    <LessonDetails
      lessonId={lessonId}
      onBack={() =>
        navigate(`/student/courses/${courseId}`)
      }
    />
  );
}