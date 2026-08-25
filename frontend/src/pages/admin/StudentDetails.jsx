import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/student-details.css";


function StudentDetails() {

    const { studentId } = useParams();

    const navigate = useNavigate();

    const [student, setStudent] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const fetchStudent = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                `/courses/admin/students/${studentId}/`
            );

            console.log(
                "STUDENT DETAILS:",
                response.data
            );

            setStudent(response.data);

        } catch (error) {

            console.error(
                "Student details error:",
                error
            );

            setError(
                "Failed to load student details."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchStudent();

    }, [studentId]);


    if (loading) {

        return (

            <div className="student-details-page">

                <div className="student-details-loading">

                    Loading student...

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="student-details-page">

                <div className="student-details-error">

                    {error}

                    <button
                        onClick={() =>
                            navigate("/admin/students")
                        }
                    >
                        Back to Students
                    </button>

                </div>

            </div>

        );

    }


    if (!student) {
        return null;
    }


    return (

        <div className="student-details-page">


            {/* HEADER */}

            <div className="student-details-header">

                <button
                    className="student-details-back"
                    onClick={() =>
                        navigate("/admin/students")
                    }
                >
                    ← Students
                </button>


                <div className="student-profile">

                    <div className="student-profile-avatar">

                        {student.username
                            ?.charAt(0)
                            ?.toUpperCase()}

                    </div>


                    <div>

                        <span>
                            STUDENT PROFILE
                        </span>

                        <h1>
                            {student.username}
                        </h1>

                        <p>
                            {student.email}
                        </p>

                    </div>

                </div>


                <span
                    className={
                        student.is_active
                            ? "student-details-status active"
                            : "student-details-status inactive"
                    }
                >

                    {student.is_active
                        ? "Active"
                        : "Inactive"}

                </span>

            </div>


            {/* COURSES */}

            <section className="student-section">

                <div className="student-section-header">

                    <div>

                        <span>
                            LEARNING
                        </span>

                        <h2>
                            Enrolled Courses
                        </h2>

                    </div>

                    <strong>
                        {student.courses?.length || 0}
                    </strong>

                </div>


                {student.courses?.length === 0 ? (

                    <div className="student-empty">

                        This student is not enrolled
                        in any courses.

                    </div>

                ) : (

                    <div className="student-courses-grid">

                        {student.courses.map(
                            (course) => (

                            <div
                                className="student-course-card"
                                key={course.id}
                            >

                                <div className="student-course-top">

                                    <div className="student-course-icon">

                                        {course.title
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>


                                    <div>

                                        <h3>
                                            {course.title}
                                        </h3>

                                        <p>
                                            Enrolled{" "}
                                            {new Date(
                                                course.enrolled_at
                                            ).toLocaleDateString()}
                                        </p>

                                    </div>

                                </div>


                                <div className="student-progress-info">

                                    <span>
                                        Progress
                                    </span>

                                    <strong>
                                        {course.progress}%
                                    </strong>

                                </div>


                                <div className="student-progress-bar">

                                    <div
                                        style={{
                                            width:
                                                `${course.progress}%`,
                                        }}
                                    />

                                </div>


                                <div className="student-course-footer">

                                    <span>
                                        {course.completed_lessons}
                                        {" / "}
                                        {course.total_lessons}
                                        {" lessons completed"}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


            {/* EXAMS */}

            <section className="student-section">

                <div className="student-section-header">

                    <div>

                        <span>
                            ASSESSMENTS
                        </span>

                        <h2>
                            Exam Attempts
                        </h2>

                    </div>

                    <strong>
                        {student.exam_results?.length || 0}
                    </strong>

                </div>


                {student.exam_results?.length === 0 ? (

                    <div className="student-empty">

                        No exam attempts yet.

                    </div>

                ) : (

                    <div className="student-exams-list">

                        {student.exam_results.map(
                            (attempt) => (

                            <div
                                className="student-exam-row"
                                key={attempt.id}
                            >

                                <div className="student-exam-info">

                                    <div className="student-exam-icon">

                                        ✓

                                    </div>


                                    <div>

                                        <h3>
                                            {attempt.exam_title}
                                        </h3>

                                        <p>
                                            Attempt #
                                            {attempt.id}
                                            {" • "}
                                            {new Date(
                                                attempt.completed_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                </div>


                                <div className="student-exam-result">

                                    <strong>
                                        {attempt.score}%
                                    </strong>

                                    <span
                                        className={
                                            attempt.passed
                                                ? "passed"
                                                : "failed"
                                        }
                                    >

                                        {attempt.passed
                                            ? "PASSED"
                                            : "FAILED"}

                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>


        </div>

    );

}


export default StudentDetails;