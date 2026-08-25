
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";
import StudentLayout from "../../layouts/StudentLayout";

import "../../styles/course-details.css";

function CourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);

    const [loading, setLoading] = useState(true);

    const [enrolling, setEnrolling] = useState(false);

    const [error, setError] = useState("");

    const [enrollMessage, setEnrollMessage] = useState("");


    useEffect(() => {

        const fetchCourse = async () => {

            try {

                setLoading(true);
                setError("");

                const [courseResponse, dashboardResponse] =
                    await Promise.all([
                        api.get(`/courses/${courseId}/`),
                        api.get("/courses/dashboard/"),
                    ]);


                console.log(
                    "COURSE DETAILS:",
                    courseResponse.data
                );

                console.log(
                    "DASHBOARD DATA:",
                    dashboardResponse.data
                );


                /*
                 * Courses returned from dashboard
                 * are the courses the student is enrolled in.
                 */

                const dashboardCourses =
                    dashboardResponse.data.courses || [];


                const dashboardCourse =
                    dashboardCourses.find(
                        (item) =>
                            item.id === Number(courseId)
                    );


                const isEnrolled =
                    !!dashboardCourse;


                setCourse({

                    ...courseResponse.data,

                    is_enrolled: isEnrolled,

                    completed_lessons:
                        dashboardCourse?.completed_lessons || 0,

                    progress:
                        dashboardCourse?.progress || 0,

                    total_lessons:
                        dashboardCourse?.total_lessons ||
                        courseResponse.data.lessons?.length ||
                        0,

                });


            } catch (error) {

                console.error(
                    "Course error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Unable to load this course."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchCourse();

    }, [courseId]);


    /*
     * =========================
     * ENROLL
     * =========================
     */

    const handleEnroll = async () => {

        if (enrolling) {
            return;
        }


        try {

            setEnrolling(true);

            setEnrollMessage("");
            setError("");


            const response = await api.post(
                `/courses/student/courses/${courseId}/enroll/`
            );


            console.log(
                "ENROLLMENT SUCCESS:",
                response.data
            );


            /*
             * Update course immediately
             */

            setCourse((previousCourse) => ({

                ...previousCourse,

                is_enrolled: true,

                completed_lessons: 0,

                progress: 0,

            }));


            setEnrollMessage(
                "Course enrolled successfully! 🎉"
            );


        } catch (error) {

            console.error(
                "Enrollment error:",
                error
            );


            const backendError =
                error.response?.data;


            setError(
                backendError?.detail ||
                "Unable to enroll in this course."
            );


        } finally {

            setEnrolling(false);

        }

    };


    if (loading) {

        return (

            <StudentLayout>

                <div className="page-loading">

                    Loading course...

                </div>

            </StudentLayout>

        );

    }


    if (error && !course) {

        return (

            <StudentLayout>

                <div className="error-card">

                    <h2>
                        Something went wrong
                    </h2>

                    <p>
                        {error}
                    </p>

                </div>

            </StudentLayout>

        );

    }


    if (!course) {
        return null;
    }


    const lessons =
        course.lessons || [];


    return (

        <StudentLayout>

            <div className="course-details">


                {/* =========================
                    BACK
                ========================= */}

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/student/dashboard")
                    }
                >
                    ← Back to Dashboard
                </button>


                {/* =========================
                    COURSE HEADER
                ========================= */}

                <section className="course-header-card">


                    <div className="course-header-image">

                        {course.thumbnail ? (

                            <img
                                src={course.thumbnail}
                                alt={course.title}
                            />

                        ) : (

                            <span>
                                📚
                            </span>

                        )}

                    </div>


                    <div className="course-header-info">


                        <span className="course-label">
                            COURSE
                        </span>


                        <h1>
                            {course.title}
                        </h1>


                        <p>
                            {course.description}
                        </p>


                        <div className="course-meta">

                            <span>
                                📚 {course.total_lessons} Lessons
                            </span>


                            {course.is_enrolled && (

                                <>

                                    <span>
                                        ✓ {course.completed_lessons} Completed
                                    </span>

                                    <span>
                                        📈 {course.progress}% Complete
                                    </span>

                                </>

                            )}

                        </div>


                    </div>


                </section>


                {/* =========================
                    ENROLL CARD
                ========================= */}

                {!course.is_enrolled && (

                    <section className="course-enroll-card">


                        <div className="enroll-info">

                            <span className="section-label">
                                START LEARNING
                            </span>


                            <h2>
                                Ready to start this course?
                            </h2>


                            <p>
                                Enroll in this course to unlock
                                all lessons and start learning.
                            </p>

                        </div>


                        <div className="enroll-action">


                            <div className="course-price">

                                <small>
                                    COURSE PRICE
                                </small>

                                <strong>
                                    {course.price || "0.00"} EGP
                                </strong>

                            </div>


                            <button
                                className="enroll-button"
                                onClick={handleEnroll}
                                disabled={enrolling}
                            >

                                {enrolling
                                    ? "Enrolling..."
                                    : "Enroll Now →"}

                            </button>


                        </div>


                    </section>

                )}


                {/* =========================
                    ENROLL SUCCESS
                ========================= */}

                {enrollMessage && (

                    <div className="enroll-success-message">

                        {enrollMessage}

                    </div>

                )}


                {/* =========================
                    ENROLL ERROR
                ========================= */}

                {error && course && (

                    <div className="enroll-error-message">

                        {error}

                    </div>

                )}


                {/* =========================
                    PROGRESS
                ========================= */}

                {course.is_enrolled && (

                    <section className="course-progress-card">


                        <div className="progress-heading">

                            <div>

                                <span className="section-label">
                                    YOUR PROGRESS
                                </span>

                                <h2>
                                    Course Progress
                                </h2>

                            </div>


                            <strong>
                                {course.progress}%
                            </strong>

                        </div>


                        <div className="progress large-progress">

                            <div
                                className="progress-bar"
                                style={{
                                    width:
                                        `${course.progress}%`,
                                }}
                            />

                        </div>


                        <p>

                            {course.completed_lessons} of{" "}

                            {course.total_lessons} lessons completed

                        </p>


                    </section>

                )}


                {/* =========================
                    LESSONS
                ========================= */}

                {course.is_enrolled && (

                    <section className="lessons-section">


                        <div className="section-header">

                            <div>

                                <span className="section-label">
                                    COURSE CONTENT
                                </span>

                                <h2>
                                    Lessons
                                </h2>

                                <p>
                                    Complete each lesson to continue
                                    your learning journey.
                                </p>

                            </div>

                        </div>


                        <div className="lessons-list">


                            {lessons.map(
                                (lesson, index) => (

                                    <div
                                        className="lesson-row"
                                        key={lesson.id}
                                    >


                                        <div className="lesson-number">

                                            {index + 1}

                                        </div>


                                        <div className="lesson-info">

                                            <h3>
                                                {lesson.title}
                                            </h3>

                                            <p>
                                                {lesson.description}
                                            </p>

                                        </div>


                                        <div className="lesson-action">

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/student/courses/${courseId}/lessons/${lesson.id}`
                                                    )
                                                }
                                            >

                                                View Lesson →

                                            </button>

                                        </div>


                                    </div>

                                )
                            )}


                        </div>


                    </section>

                )}


            </div>

        </StudentLayout>

    );

}


export default CourseDetails;

