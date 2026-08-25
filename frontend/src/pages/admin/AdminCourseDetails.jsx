import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/admin-course-details.css";


function AdminCourseDetails() {

    const { courseId } = useParams();

    const navigate = useNavigate();

    const [course, setCourse] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        fetchCourse();

    }, [courseId]);


    const fetchCourse = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get(
                `/courses/admin/courses/${courseId}/`
            );

            setCourse(response.data);

        } catch (error) {

            console.error(
                "Admin course details error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load course."
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div className="admin-course-loading">
                Loading course...
            </div>
        );

    }


    if (error) {

        return (

            <div className="admin-course-error">

                <h3>
                    Unable to load course
                </h3>

                <p>
                    {error}
                </p>

                <button
                    onClick={() => navigate(-1)}
                >
                    Go Back
                </button>

            </div>

        );

    }


    if (!course) {
        return null;
    }


    return (

        <div className="admin-course-page">


            {/* HEADER */}

            <div className="admin-course-header">

                <button
                    className="admin-course-back"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>


                <div className="admin-course-title">

                    <span>
                        COURSE DETAILS
                    </span>

                    <h1>
                        {course.title}
                    </h1>

                    <p>
                        {course.description ||
                            "No description available."}
                    </p>

                </div>


                <div
                    className={
                        course.is_published
                            ? "admin-course-status published"
                            : "admin-course-status draft"
                    }
                >
                    {course.is_published
                        ? "Published"
                        : "Draft"}
                </div>

            </div>


            {/* COURSE INFO */}

            <div className="admin-course-info-grid">


                <div className="admin-course-info-card">

                    <span>
                        TEACHER
                    </span>

                    <strong>
                        {course.teacher?.username}
                    </strong>

                    <p>
                        {course.teacher?.email}
                    </p>

                </div>


                <div className="admin-course-info-card">

                    <span>
                        PRICE
                    </span>

                    <strong>
                        {course.price} EGP
                    </strong>

                </div>


                <div className="admin-course-info-card">

                    <span>
                        STUDENTS
                    </span>

                    <strong>
                        {course.students_count}
                    </strong>

                </div>


                <div className="admin-course-info-card">

                    <span>
                        LESSONS
                    </span>

                    <strong>
                        {course.lessons_count}
                    </strong>

                </div>


                <div className="admin-course-info-card">

                    <span>
                        EXAMS
                    </span>

                    <strong>
                        {course.exams_count}
                    </strong>

                </div>

            </div>


            {/* STUDENTS */}

            <section className="admin-course-section">

                <div className="admin-course-section-header">

                    <span>
                        ENROLLMENTS
                    </span>

                    <h2>
                        Students
                    </h2>

                </div>


                {course.students?.length > 0 ? (

                    <div className="admin-course-table-wrapper">

                        <table className="admin-course-table">

                            <thead>

                                <tr>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Enrolled
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {course.students.map(
                                    (student) => (

                                        <tr
                                            key={student.id}
                                        >

                                            <td>
                                                <strong>
                                                    {student.username}
                                                </strong>
                                            </td>

                                            <td>
                                                {student.email}
                                            </td>

                                            <td>
                                                {new Date(
                                                    student.enrolled_at
                                                ).toLocaleDateString()}
                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                ) : (

                    <div className="admin-course-empty">
                        No students enrolled yet.
                    </div>

                )}

            </section>


            {/* LESSONS */}

            <section className="admin-course-section">

                <div className="admin-course-section-header">

                    <span>
                        COURSE CONTENT
                    </span>

                    <h2>
                        Lessons
                    </h2>

                </div>


                {course.lessons?.length > 0 ? (

                    <div className="admin-course-list">

                        {course.lessons.map(
                            (lesson, index) => (

                                <div
                                    className="admin-course-list-item"
                                    key={lesson.id}
                                >

                                    <div className="admin-course-list-number">
                                        {index + 1}
                                    </div>


                                    <div className="admin-course-list-content">

                                        <strong>
                                            {lesson.title}
                                        </strong>

                                    </div>


                                    <span
                                        className={
                                            lesson.is_published
                                                ? "mini-status published"
                                                : "mini-status draft"
                                        }
                                    >
                                        {lesson.is_published
                                            ? "Published"
                                            : "Draft"}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="admin-course-empty">
                        No lessons available.
                    </div>

                )}

            </section>


            {/* EXAMS */}

            <section className="admin-course-section">

                <div className="admin-course-section-header">

                    <span>
                        ASSESSMENTS
                    </span>

                    <h2>
                        Exams
                    </h2>

                </div>


                {course.exams?.length > 0 ? (

                    <div className="admin-course-list">

                        {course.exams.map(
                            (exam) => (

                                <div
                                    className="admin-course-list-item"
                                    key={exam.id}
                                >

                                    <div className="admin-course-list-number">
                                        📝
                                    </div>


                                    <div className="admin-course-list-content">

                                        <strong>
                                            {exam.title}
                                        </strong>

                                        <span>
                                            {exam.lesson_title}
                                        </span>

                                    </div>


                                    <div className="exam-meta">

                                        <span>
                                            Pass: {exam.passing_score}%
                                        </span>

                                        <span>
                                            {exam.time_limit} min
                                        </span>

                                    </div>


                                    <span
                                        className={
                                            exam.is_published
                                                ? "mini-status published"
                                                : "mini-status draft"
                                        }
                                    >
                                        {exam.is_published
                                            ? "Published"
                                            : "Draft"}
                                    </span>

                                </div>

                            )
                        )}

                    </div>

                ) : (

                    <div className="admin-course-empty">
                        No exams available.
                    </div>

                )}

            </section>


        </div>

    );

}


export default AdminCourseDetails;