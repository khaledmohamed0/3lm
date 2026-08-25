import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/admin-dashboard.css";


function AdminDashboard() {

    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await api.get(
                    "/courses/admin/dashboard/"
                );

                console.log(
                    "ADMIN DASHBOARD:",
                    response.data
                );

                setDashboard(response.data);

            } catch (error) {

                console.error(
                    "Admin dashboard error:",
                    error
                );

                if (
                    error.response?.status === 403
                ) {

                    setError(
                        "You are not allowed to access the admin dashboard."
                    );

                } else {

                    setError(
                        "Failed to load admin dashboard."
                    );

                }

            } finally {

                setLoading(false);

            }

        };


        fetchDashboard();

    }, []);


    if (loading) {

        return (

            <div className="admin-dashboard-page">

                <div className="admin-loading">

                    Loading dashboard...

                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="admin-dashboard-page">

                <div className="admin-error">

                    {error}

                </div>

            </div>

        );

    }


    return (

        <div className="admin-dashboard-page">


            {/* HEADER */}

            <div className="admin-dashboard-header">

                <div>

                    <span className="admin-dashboard-label">
                        ADMIN PANEL
                    </span>

                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Manage your learning platform.
                    </p>

                </div>


                <button
                    className="admin-logout-button"
                    onClick={() => {

                        localStorage.removeItem(
                            "access"
                        );

                        localStorage.removeItem(
                            "refresh"
                        );

                        navigate("/login");

                    }}
                >
                    Logout
                </button>

            </div>


            {/* STATISTICS */}

            <div className="admin-stats-grid">


                <div className="admin-stat-card">

                    <span>
                        Students
                    </span>

                    <strong>
                        {dashboard.students}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Teachers
                    </span>

                    <strong>
                        {dashboard.teachers}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Courses
                    </span>

                    <strong>
                        {dashboard.courses}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Lessons
                    </span>

                    <strong>
                        {dashboard.lessons}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Exams
                    </span>

                    <strong>
                        {dashboard.exams}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Published Courses
                    </span>

                    <strong>
                        {dashboard.published_courses}
                    </strong>

                </div>


                <div className="admin-stat-card">

                    <span>
                        Published Exams
                    </span>

                    <strong>
                        {dashboard.published_exams}
                    </strong>

                </div>


            </div>


            {/* MANAGEMENT */}

            <div className="admin-management-section">

                <div className="admin-section-header">

                    <div>

                        <span>
                            MANAGEMENT
                        </span>

                        <h2>
                            Platform Management
                        </h2>

                    </div>

                </div>


                <div className="admin-management-grid">


                    <button
                        className="admin-management-card"
                        onClick={() =>
                            navigate("/admin/students")
                        }
                    >

                        <div className="admin-card-icon">
                            👨‍🎓
                        </div>

                        <div>

                            <h3>
                                Students
                            </h3>

                            <p>
                                Manage students and their
                                enrollments.
                            </p>

                        </div>

                    </button>


                    <button
                        className="admin-management-card"
                        onClick={() =>
                            navigate("/admin/teachers")
                        }
                    >

                        <div className="admin-card-icon">
                            👨‍🏫
                        </div>

                        <div>

                            <h3>
                                Teachers
                            </h3>

                            <p>
                                Manage teachers and courses.
                            </p>

                        </div>

                    </button>


                    <button
                        className="admin-management-card"
                        onClick={() =>
                            navigate("/admin/courses")
                        }
                    >

                        <div className="admin-card-icon">
                            📚
                        </div>

                        <div>

                            <h3>
                                Courses
                            </h3>

                            <p>
                                Manage all platform courses.
                            </p>

                        </div>

                    </button>


                    <button
                        className="admin-management-card"
                        onClick={() =>
                            navigate("/admin/exams")
                        }
                    >

                        <div className="admin-card-icon">
                            📝
                        </div>

                        <div>

                            <h3>
                                Exams
                            </h3>

                            <p>
                                Manage exams and questions.
                            </p>

                        </div>

                    </button>


                    <button
                        className="admin-management-card"
                        onClick={() =>
                            navigate("/admin/enrollments")
                        }
                    >

                        <div className="admin-card-icon">
                            🎓
                        </div>

                        <div>

                            <h3>
                                Enrollments
                            </h3>

                            <p>
                                Manage student enrollments.
                            </p>

                        </div>

                    </button>


                    <button
                        className="admin-management-card"
                        onClick={() =>
                            navigate("/admin/reports")
                        }
                    >

                        <div className="admin-card-icon">
                            📊
                        </div>

                        <div>

                            <h3>
                                Reports
                            </h3>

                            <p>
                                View platform statistics.
                            </p>

                        </div>

                    </button>


                </div>

            </div>


        </div>

    );

}


export default AdminDashboard;