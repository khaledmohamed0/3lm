
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import ExamResultsSlider from "../../pages/student/ExamResultsSlider";
import StudentLayout from "../../layouts/StudentLayout";

import "../../styles/dashboard.css";


function StudentDashboard() {

    const [dashboard, setDashboard] = useState(null);

    const [allCourses, setAllCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const navigate = useNavigate();


    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const [
                    dashboardResponse,
                    coursesResponse
                ] = await Promise.all([

                    api.get("/courses/dashboard/"),

                    api.get("/courses/student/courses/"),

                ]);


                console.log(
                    "DASHBOARD:",
                    dashboardResponse.data
                );


                console.log(
                    "ALL COURSES:",
                    coursesResponse.data
                );


                setDashboard(
                    dashboardResponse.data
                );


                setAllCourses(
                    coursesResponse.data
                );


            } catch (error) {

                console.error(
                    "Dashboard error:",
                    error
                );

                setError(
                    "Unable to load your dashboard."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchDashboard();

    }, []);


    if (loading) {

        return (

            <StudentLayout>

                <div className="page-loading">

                    <div className="loading-spinner"></div>

                    <p>
                        Loading your dashboard...
                    </p>

                </div>

            </StudentLayout>

        );

    }


    if (error) {

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


    const student =
        dashboard?.student;


    const wallet =
        dashboard?.wallet;


    const courses =
        dashboard?.courses || [];


    const totalCourses =
        courses.length;


    const averageProgress =
        totalCourses > 0

            ? Math.round(

                courses.reduce(

                    (sum, course) =>
                        sum + course.progress,

                    0

                ) / totalCourses

            )

            : 0;


    /*
     * Show only first 5 courses
     */

    const featuredCourses =
        allCourses.slice(0, 5);


    return (

        <StudentLayout>

            <div className="dashboard-content">


                {/* =========================
                    HEADER
                ========================= */}

                <header className="dashboard-header">

                    <div>

                        <span className="eyebrow">
                            STUDENT DASHBOARD
                        </span>

                        <h1>

                            Welcome back,{" "}

                            {
                                student?.first_name ||
                                student?.username
                            }

                            {" "}👋

                        </h1>

                        <p>
                            Keep learning and reach
                            your goals.
                        </p>

                    </div>


                    <div className="profile-badge">

                        {(
                            student?.first_name ||
                            student?.username ||
                            "S"
                        )
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                </header>



                {/* =========================
                    STATS
                ========================= */}

                <section className="stats-grid">


                    <div className="stat-card">

                        <div className="stat-icon wallet-icon">
                            💰
                        </div>

                        <div>

                            <p>
                                Wallet Balance
                            </p>

                            <h2>
                                {
                                    wallet?.balance ||
                                    "0.00"
                                } EGP
                            </h2>

                        </div>

                    </div>



                    <div className="stat-card">

                        <div className="stat-icon course-icon">
                            📚
                        </div>

                        <div>

                            <p>
                                My Courses
                            </p>

                            <h2>
                                {totalCourses}
                            </h2>

                        </div>

                    </div>



                    <div className="stat-card">

                        <div className="stat-icon progress-icon">
                            📈
                        </div>

                        <div>

                            <p>
                                Average Progress
                            </p>

                            <h2>
                                {averageProgress}%
                            </h2>

                        </div>

                    </div>


                </section>



                {/* =========================
                    EXPLORE COURSES
                ========================= */}

                <section className="explore-courses-section">


                    <div className="explore-courses-header">

                        <div>

                            <span className="section-label">
                                DISCOVER
                            </span>

                            <h2>
                                Explore Courses
                            </h2>

                            <p>
                                Find your next course
                                and start learning.
                            </p>

                        </div>


                        <button
                            className="view-all-courses-button"
                            onClick={() =>
                                navigate(
                                    "/student/courses"
                                )
                            }
                        >
                            View All Courses →
                        </button>

                    </div>



                    {featuredCourses.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📚
                            </div>

                            <h3>
                                No courses available
                            </h3>

                            <p>
                                New courses will appear
                                here soon.
                            </p>

                        </div>

                    ) : (

                        <div className="explore-courses-slider">

                            {featuredCourses.map(
                                (course) => (

                                    <article
                                        className="explore-course-card"
                                        key={course.id}
                                    >


                                        {/* COVER */}

                                        <div className="explore-course-cover">

                                            <div className="explore-course-icon">
                                                📚
                                            </div>


                                            {course.is_enrolled && (

                                                <span className="explore-enrolled-badge">
                                                    Enrolled
                                                </span>

                                            )}

                                        </div>



                                        {/* CONTENT */}

                                        <div className="explore-course-body">


                                            <h3>
                                                {course.title}
                                            </h3>


                                            <p className="explore-course-description">

                                                {
                                                    course.description ||
                                                    "Start learning this course."
                                                }

                                            </p>



                                            {/* TEACHER */}

                                            <div className="explore-course-teacher">

                                                <div className="explore-teacher-avatar">

                                                    {course.teacher?.username
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>


                                                <div>

                                                    <small>
                                                        INSTRUCTOR
                                                    </small>

                                                    <strong>
                                                        {
                                                            course
                                                                .teacher
                                                                ?.username ||
                                                            "Teacher"
                                                        }
                                                    </strong>

                                                </div>

                                            </div>



                                            {/* META */}

                                            <div className="explore-course-meta">

                                                <span>
                                                    📖{" "}
                                                    {
                                                        course.lessons_count
                                                    }{" "}
                                                    Lessons
                                                </span>

                                                <strong>
                                                    {
                                                        course.price
                                                    }{" "}
                                                    EGP
                                                </strong>

                                            </div>



                                            {/* BUTTON */}

                                            <button
                                                className="explore-course-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/student/courses/${course.id}`
                                                    )
                                                }
                                            >

                                                {course.is_enrolled

                                                    ? "Continue Course →"

                                                    : "View Course →"

                                                }

                                            </button>


                                        </div>

                                    </article>

                                )
                            )}

                        </div>

                    )}


                </section>



                {/* =========================
                    MY COURSES
                ========================= */}

                <section className="courses-section">


                    <div className="section-header">

                        <div>

                            <span className="section-label">
                                LEARNING
                            </span>

                            <h2>
                                My Courses
                            </h2>

                            <p>
                                Continue your learning journey.
                            </p>

                        </div>

                    </div>



                    {courses.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">
                                📚
                            </div>

                            <h3>
                                No courses yet
                            </h3>

                            <p>
                                You haven't enrolled in
                                any courses yet.
                            </p>

                        </div>

                    ) : (

                        <div className="courses-grid">

                            {courses.map(
                                (course) => (

                                    <article
                                        className="course-card"
                                        key={course.id}
                                    >


                                        {course.image ? (

                                            <img
                                                src={course.image}
                                                alt={course.title}
                                            />

                                        ) : (

                                            <div className="course-cover-placeholder">
                                                📖
                                            </div>

                                        )}



                                        <div className="course-card-body">


                                            <h3>
                                                {course.title}
                                            </h3>


                                            <p className="lesson-count">

                                                {
                                                    course.completed_lessons
                                                }

                                                {" "}of{" "}

                                                {
                                                    course.total_lessons
                                                }

                                                {" "}lessons completed

                                            </p>



                                            <div className="progress-info">

                                                <span>
                                                    Progress
                                                </span>

                                                <strong>
                                                    {
                                                        course.progress
                                                    }%
                                                </strong>

                                            </div>



                                            <div className="progress">

                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width:
                                                            `${course.progress}%`,
                                                    }}
                                                />

                                            </div>



                                            <div className="course-footer">


                                                {course.next_lesson ? (

                                                    <>

                                                        <div>

                                                            <small>
                                                                Next lesson
                                                            </small>

                                                            <strong>

                                                                {
                                                                    course
                                                                        .next_lesson
                                                                        .title
                                                                }

                                                            </strong>

                                                        </div>


                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/student/courses/${course.id}`
                                                                )
                                                            }
                                                        >

                                                            Continue

                                                            <span>
                                                                →
                                                            </span>

                                                        </button>

                                                    </>

                                                ) : (

                                                    <div className="completed-course">

                                                        🎉 Course Completed

                                                    </div>

                                                )}


                                            </div>


                                        </div>


                                    </article>

                                )
                            )}

                        </div>

                    )}


                </section>



                {/* =========================
                    EXAM RESULTS
                ========================= */}

                <ExamResultsSlider />


            </div>

        </StudentLayout>

    );

}


export default StudentDashboard;

