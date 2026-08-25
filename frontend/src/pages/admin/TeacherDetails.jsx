import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/teacher-details.css";


function TeacherDetails() {

    const { teacherId } = useParams();

    const navigate = useNavigate();

    const [teacher, setTeacher] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        fetchTeacher();

    }, [teacherId]);


    const fetchTeacher = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/courses/admin/teachers/${teacherId}/`
            );

            setTeacher(response.data);

        } catch (error) {

            console.error(
                "Teacher details error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load teacher."
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <div className="teacher-details-loading">
                Loading teacher...
            </div>
        );

    }


    if (error) {

        return (

            <div className="teacher-details-error">

                <h3>
                    Unable to load teacher
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


    if (!teacher) {
        return null;
    }


    return (

        <div className="teacher-details-page">


            {/* HEADER */}

            <div className="teacher-details-header">

                <button
                    className="teacher-details-back"
                    onClick={() => navigate(-1)}
                >
                    ← Back
                </button>


                <div className="teacher-profile">

                    <div className="teacher-profile-avatar">

                        {teacher.username
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>


                    <div>

                        <span>
                            TEACHER DETAILS
                        </span>

                        <h1>
                            {teacher.username}
                        </h1>

                        <p>
                            {teacher.email}
                        </p>

                    </div>

                </div>


                <div
                    className={
                        teacher.is_active
                            ? "teacher-detail-status active"
                            : "teacher-detail-status inactive"
                    }
                >

                    {teacher.is_active
                        ? "Active"
                        : "Inactive"}

                </div>

            </div>


            {/* STATS */}

            <div className="teacher-detail-stats">


                <div className="teacher-detail-stat">

                    <span>
                        COURSES
                    </span>

                    <strong>
                        {teacher.courses_count || 0}
                    </strong>

                </div>


                <div className="teacher-detail-stat">

                    <span>
                        PUBLISHED
                    </span>

                    <strong>
                        {teacher.published_courses || 0}
                    </strong>

                </div>


                <div className="teacher-detail-stat">

                    <span>
                        STUDENTS
                    </span>

                    <strong>
                        {teacher.students_count || 0}
                    </strong>

                </div>


                <div className="teacher-detail-stat">

                    <span>
                        LESSONS
                    </span>

                    <strong>
                        {teacher.lessons_count || 0}
                    </strong>

                </div>


                <div className="teacher-detail-stat">

                    <span>
                        EXAMS
                    </span>

                    <strong>
                        {teacher.exams_count || 0}
                    </strong>

                </div>

            </div>


            {/* COURSES */}

            <div className="teacher-detail-section">

                <div className="teacher-detail-section-header">

                    <div>

                        <span>
                            TEACHING
                        </span>

                        <h2>
                            Courses
                        </h2>

                    </div>

                </div>


                {teacher.courses?.length > 0 ? (

                    <div className="teacher-courses-grid">

                        {teacher.courses.map((course) => (

                            <div
                                className="teacher-course-card"
                                key={course.id}
                            >

                                {/* TOP */}

                                <div className="teacher-course-top">

                                    <div className="teacher-course-icon">
                                        📚
                                    </div>


                                    <span
                                        className={
                                            course.is_published
                                                ? "course-published"
                                                : "course-draft"
                                        }
                                    >
                                        {course.is_published
                                            ? "Published"
                                            : "Draft"}
                                    </span>

                                </div>


                                {/* INFO */}

                                <h3>
                                    {course.title}
                                </h3>


                                <p>
                                    {course.description ||
                                        "No description available."}
                                </p>


                                {/* STATS */}

                                <div className="teacher-course-stats">

                                    <div>

                                        <strong>
                                            {course.students_count}
                                        </strong>

                                        <span>
                                            Students
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {course.lessons_count}
                                        </strong>

                                        <span>
                                            Lessons
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {course.exams_count}
                                        </strong>

                                        <span>
                                            Exams
                                        </span>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="teacher-course-footer">

                                    <span>
                                        {course.price} EGP
                                    </span>


                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin/courses/${course.id}`
                                            )
                                        }
                                    >
                                        View Course
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="teacher-detail-empty">

                        <div>
                            📚
                        </div>

                        <h3>
                            No Courses Yet
                        </h3>

                        <p>
                            This teacher has not created any courses yet.
                        </p>

                    </div>

                )}

            </div>


        </div>

    );

}


export default TeacherDetails;