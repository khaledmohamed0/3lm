import { useEffect, useState } from "react";

import api from "../../api/axios";
import "../../styles/teacher-dashboard.css";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await api.get(
                    "/courses/teacher/dashboard/"
                );

                console.log(
                    "TEACHER DASHBOARD:",
                    response.data
                );

                setDashboard(response.data);

            } catch (error) {
                console.error(
                    "Teacher dashboard error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load teacher dashboard."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="teacher-page">
                <div className="teacher-loading">
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="teacher-page">
                <div className="teacher-error">
                    <h2>Unable to Load Dashboard</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!dashboard) {
        return null;
    }

    const { teacher, stats, courses } = dashboard;

    return (
        <div className="teacher-page">

            {/* Header */}

            <header className="teacher-header">

                <div>
                    <span className="teacher-eyebrow">
                        TEACHER PORTAL
                    </span>

                    <h1>
                        Welcome back, {teacher.username}
                    </h1>

                    <p>
                        Manage your courses, lessons,
                        exams and students.
                    </p>
                </div>

                <div className="teacher-profile">

                    <div className="teacher-avatar">
                        {teacher.username
                            ?.charAt(0)
                            ?.toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {teacher.username}
                        </strong>

                        <span>
                            Teacher
                        </span>
                    </div>

                </div>

            </header>


            {/* Stats */}

            <section className="teacher-stats">

                <div className="teacher-stat-card">

                    <span className="stat-icon">
                        📚
                    </span>

                    <div>
                        <span>
                            Total Courses
                        </span>

                        <strong>
                            {stats.total_courses}
                        </strong>
                    </div>

                </div>


                <div className="teacher-stat-card">

                    <span className="stat-icon">
                        ✓
                    </span>

                    <div>
                        <span>
                            Published Courses
                        </span>

                        <strong>
                            {stats.published_courses}
                        </strong>
                    </div>

                </div>


                <div className="teacher-stat-card">

                    <span className="stat-icon">
                        👨‍🎓
                    </span>

                    <div>
                        <span>
                            Students
                        </span>

                        <strong>
                            {stats.total_students}
                        </strong>
                    </div>

                </div>


                <div className="teacher-stat-card">

                    <span className="stat-icon">
                        📖
                    </span>

                    <div>
                        <span>
                            Lessons
                        </span>

                        <strong>
                            {stats.total_lessons}
                        </strong>
                    </div>

                </div>


                <div className="teacher-stat-card">

                    <span className="stat-icon">
                        📝
                    </span>

                    <div>
                        <span>
                            Exams
                        </span>

                        <strong>
                            {stats.total_exams}
                        </strong>
                    </div>

                </div>

            </section>


            {/* Courses */}

            <section className="teacher-courses">

                <div className="teacher-section-header">

                    <div>
                        <span>
                            CONTENT
                        </span>

                        <h2>
                            Your Courses
                        </h2>

                        <p>
                            Manage the courses assigned
                            to you.
                        </p>
                    </div>
                        <button
                            className="create-course-button"
                            onClick={() =>
                                navigate("/teacher/courses/create")
                            }
                        >
                            + Create Course
                        </button>

                </div>


                {!courses.length ? (

                    <div className="teacher-empty">

                        <div>
                            📚
                        </div>

                        <h3>
                            No courses yet
                        </h3>

                        <p>
                            Create your first course
                            to start adding lessons.
                        </p>

                        <button
                            className="create-course-button"
                            onClick={() =>
                                navigate("/teacher/courses/create")
                            }
                        >
                            + Create Course
                        </button>

                    </div>

                ) : (

                    <div className="teacher-course-grid">

                        {courses.map((course) => (

                            <article
                                className="teacher-course-card"
                                key={course.course_id}
                            >

                                <div className="course-card-top">

                                    <div className="course-icon">
                                        📚
                                    </div>

                                    <span
                                        className={
                                            course.is_published
                                                ? "course-status published"
                                                : "course-status draft"
                                        }
                                    >
                                        {course.is_published
                                            ? "Published"
                                            : "Draft"}
                                    </span>

                                </div>


                                <div className="course-card-body">

                                    <h3>
                                        {course.course_title}
                                    </h3>

                                    <p>
                                        {course.description ||
                                            "No course description."}
                                    </p>

                                </div>


                                <div className="course-card-stats">

                                    <div>
                                        <span>
                                            Lessons
                                        </span>

                                        <strong>
                                            {course.total_lessons}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Students
                                        </span>

                                        <strong>
                                            {course.students_count}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Price
                                        </span>

                                        <strong>
                                            {course.price}
                                        </strong>
                                    </div>

                                </div>


                                <div className="course-card-actions">

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/teacher/courses/${course.course_id}`
                                            )
                                        }
                                    >
                                        Manage Course →
                                    </button>

                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/teacher/courses/${course.course_id}/students`
                                            )
                                        }
                                    >
                                        View Students →
                                    </button>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default TeacherDashboard;