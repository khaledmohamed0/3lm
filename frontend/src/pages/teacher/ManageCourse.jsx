import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/manage-course.css";

function ManageCourse() {

    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [deleting, setDeleting] = useState(null);


    const fetchCourse = async () => {

        try {

            const response = await api.get(
                `/courses/teacher/courses/${courseId}/`
            );

            console.log(
                "TEACHER COURSE:",
                response.data
            );

            setCourse(response.data);

        } catch (error) {

            console.error(
                "Course error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load course."
            );
        }
    };


    const fetchLessons = async () => {

        try {

            const response = await api.get(
                `/courses/teacher/lessons/?course=${courseId}`
            );

            console.log(
                "TEACHER LESSONS:",
                response.data
            );

            /*
             * ListAPIView returns an array normally.
             * Handle pagination too just in case.
             */

            setLessons(
                Array.isArray(response.data)
                    ? response.data
                    : response.data.results || []
            );

        } catch (error) {

            console.error(
                "Lessons error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load lessons."
            );
        }
    };


    const loadData = async () => {

        setLoading(true);
        setError("");

        try {

            await Promise.all([
                fetchCourse(),
                fetchLessons(),
            ]);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadData();

    }, [courseId]);


    const handleDeleteLesson = async (lessonId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this lesson?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await api.delete(
                `/courses/teacher/lessons/${lessonId}/`
            );

            setCourse((previousCourse) => ({
                ...previousCourse,
                lessons: previousCourse.lessons.filter(
                    (lesson) => lesson.id !== lessonId
                ),
            }));

        } catch (error) {

            console.error(
                "Delete lesson error:",
                error
            );

            alert(
                error.response?.data?.detail ||
                "Unable to delete lesson."
            );
        }
    };

    if (loading) {

        return (
            <div className="manage-course-page">

                <div className="manage-loading">
                    Loading course...
                </div>

            </div>
        );
    }


    if (error && !course) {

        return (
            <div className="manage-course-page">

                <div className="manage-error">

                    <h2>
                        Unable to Load Course
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate(
                                "/teacher/dashboard"
                            )
                        }
                    >
                        ← Back to Dashboard
                    </button>

                </div>

            </div>
        );
    }


    return (

        <div className="manage-course-page">

            <div className="manage-course-container">

                {/* Back */}

                <button
                    className="manage-back"
                    onClick={() =>
                        navigate(
                            "/teacher/dashboard"
                        )
                    }
                >
                    ← Back to Dashboard
                </button>


                {/* Course Header */}

                <section className="course-management-header">

                    <div className="course-management-info">

                        <span className="management-label">
                            COURSE MANAGEMENT
                        </span>

                        <h1>
                            {course.title}
                        </h1>

                        <p>
                            {course.description ||
                                "No course description."}
                        </p>


                        <div className="course-meta">

                            <span>
                                💰 {course.price || "0.00"} EGP
                            </span>

                            <span
                                className={
                                    course.is_published
                                        ? "status published"
                                        : "status draft"
                                }
                            >
                                {course.is_published
                                    ? "Published"
                                    : "Draft"}
                            </span>

                        </div>

                    </div>


                    {course.thumbnail && (

                        <img
                            className="course-management-thumbnail"
                            src={course.thumbnail}
                            alt={course.title}
                        />

                    )}

                </section>


                {/* Course Actions */}

                <div className="course-actions">

                    <button
                        className="secondary-action"
                        onClick={() =>
                            navigate(
                                `/teacher/courses/${courseId}/edit`
                            )
                        }
                    >
                        ✎ Edit Course
                    </button>

                </div>


                {/* Error */}

                {error && (

                    <div className="manage-inline-error">
                        {error}
                    </div>

                )}


                {/* Lessons Header */}

                <div className="lessons-header">

                    <div>

                        <span>
                            COURSE CONTENT
                        </span>

                        <h2>
                            Lessons
                        </h2>

                        <p>
                            Manage the lessons included
                            in this course.
                        </p>

                    </div>


                    <button
                        className="add-lesson-button"
                        onClick={() =>
                            navigate(
                                `/teacher/courses/${courseId}/lessons/create`
                            )
                        }
                    >
                        + Add Lesson
                    </button>

                </div>


                {/* Lessons */}

                {lessons.length === 0 ? (

                    <div className="lessons-empty">

                        <div className="empty-icon">
                            📚
                        </div>

                        <h3>
                            No lessons yet
                        </h3>

                        <p>
                            Start building your course
                            by adding the first lesson.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    `/teacher/courses/${courseId}/lessons/create`
                                )
                            }
                        >
                            + Add First Lesson
                        </button>

                    </div>

                ) : (

                    <div className="lessons-list">

                        {lessons.map(
                            (lesson, index) => (

                                <div
                                    className="lesson-management-card"
                                    key={lesson.id}
                                >

                                    <div className="lesson-order">
                                        {lesson.order ||
                                            index + 1}
                                    </div>


                                    <div className="lesson-info">

                                        <span>
                                            LESSON {lesson.order ||
                                                index + 1}
                                        </span>

                                        <h3>
                                            {lesson.title}
                                        </h3>

                                        <p>
                                            {lesson.description ||
                                                "No description."}
                                        </p>

                                    </div>


                                    <div className="lesson-status">

                                        <span
                                            className={
                                                lesson.is_published
                                                    ? "status published"
                                                    : "status draft"
                                            }
                                        >
                                            {lesson.is_published
                                                ? "Published"
                                                : "Draft"}
                                        </span>

                                    </div>


                                    <div className="lesson-actions">

                                        <button
                                            className="lesson-edit-button"
                                            onClick={() =>
                                                navigate(
                                                    `/teacher/lessons/${lesson.id}/edit`
                                                )
                                            }
                                        >
                                            Edit
                                        </button>

                                        {lesson.exam_id ? (

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/teacher/lessons/${lesson.id}/exam`
                                                    )
                                                }
                                            >
                                                Manage Exam
                                            </button>

                                        ) : (

                                            <button
                                                type="button"
                                                className="lesson-exam-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/teacher/courses/${courseId}/lessons/${lesson.id}/exam/create`
                                                    )
                                                }
                                            >
                                                Create Exam
                                            </button>

                                        )}


                                        <button
                                            type="button"
                                            className="lesson-delete-button"
                                            onClick={() => handleDeleteLesson(lesson.id)}
                                        >
                                            Delete
                                        </button>


                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


            </div>

        </div>

    );
}

export default ManageCourse;