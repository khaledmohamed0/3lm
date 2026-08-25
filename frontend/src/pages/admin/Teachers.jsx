import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/teachers.css";


function Teachers() {

    const navigate = useNavigate();

    const [teachers, setTeachers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    useEffect(() => {

        fetchTeachers();

    }, []);


    const fetchTeachers = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/courses/admin/teachers/"
            );

            setTeachers(response.data);

        } catch (error) {

            console.error(
                "Teachers error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load teachers."
            );

        } finally {

            setLoading(false);

        }

    };


    const filteredTeachers =
        teachers.filter((teacher) => {

            const searchValue =
                search.toLowerCase();

            return (
                teacher.username
                    ?.toLowerCase()
                    .includes(searchValue) ||

                teacher.email
                    ?.toLowerCase()
                    .includes(searchValue)
            );

        });


    if (loading) {

        return (

            <div className="teachers-loading">

                Loading teachers...

            </div>

        );

    }


    if (error) {

        return (

            <div className="teachers-error">

                <h3>
                    Unable to load teachers
                </h3>

                <p>
                    {error}
                </p>

                <button
                    onClick={fetchTeachers}
                >
                    Try Again
                </button>

            </div>

        );

    }


    return (

        <div className="teachers-page">


            {/* HEADER */}

            <div className="teachers-header">

                <div>

                    <span>
                        ADMINISTRATION
                    </span>

                    <h1>
                        Teachers
                    </h1>

                    <p>
                        Manage all teachers and
                        view their teaching activity.
                    </p>

                </div>


                <button
                    className="teachers-back-button"
                    onClick={() =>
                        navigate("/admin")
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* STATS */}

            <div className="teachers-stats">


                <div className="teacher-stat-card">

                    <div className="teacher-stat-icon">
                        T
                    </div>

                    <div>

                        <span>
                            Total Teachers
                        </span>

                        <strong>
                            {teachers.length}
                        </strong>

                    </div>

                </div>


                <div className="teacher-stat-card">

                    <div className="teacher-stat-icon">
                        ✓
                    </div>

                    <div>

                        <span>
                            Active
                        </span>

                        <strong>
                            {
                                teachers.filter(
                                    (teacher) =>
                                        teacher.is_active
                                ).length
                            }
                        </strong>

                    </div>

                </div>


                <div className="teacher-stat-card">

                    <div className="teacher-stat-icon">
                        C
                    </div>

                    <div>

                        <span>
                            Courses
                        </span>

                        <strong>
                            {
                                teachers.reduce(
                                    (total, teacher) =>
                                        total +
                                        (teacher.courses_count || 0),
                                    0
                                )
                            }
                        </strong>

                    </div>

                </div>


                <div className="teacher-stat-card">

                    <div className="teacher-stat-icon">
                        S
                    </div>

                    <div>

                        <span>
                            Students
                        </span>

                        <strong>
                            {
                                teachers.reduce(
                                    (total, teacher) =>
                                        total +
                                        (teacher.students_count || 0),
                                    0
                                )
                            }
                        </strong>

                    </div>

                </div>


            </div>


            {/* CONTENT */}

            <div className="teachers-card">


                <div className="teachers-card-header">

                    <div>

                        <h2>
                            All Teachers
                        </h2>

                        <p>
                            {filteredTeachers.length}
                            {" "}
                            teachers found
                        </p>

                    </div>


                    <div className="teachers-search">

                        <span>
                            🔎
                        </span>

                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>


                {/* TABLE */}

                {filteredTeachers.length === 0 ? (

                    <div className="teachers-empty">

                        <div>
                            👨‍🏫
                        </div>

                        <h3>
                            No teachers found
                        </h3>

                        <p>
                            Try another search.
                        </p>

                    </div>

                ) : (

                    <div className="teachers-table-wrapper">

                        <table className="teachers-table">

                            <thead>

                                <tr>

                                    <th>
                                        Teacher
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Courses
                                    </th>

                                    <th>
                                        Students
                                    </th>

                                    <th>
                                        Lessons
                                    </th>

                                    <th>
                                        Exams
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredTeachers.map(
                                    (teacher) => (

                                        <tr
                                            key={teacher.id}
                                        >


                                            {/* TEACHER */}

                                            <td>

                                                <div className="teacher-user">

                                                    <div className="teacher-avatar">

                                                        {
                                                            teacher.username
                                                                ?.charAt(0)
                                                                ?.toUpperCase()
                                                        }

                                                    </div>


                                                    <div>

                                                        <strong>
                                                            {
                                                                teacher.username
                                                            }
                                                        </strong>

                                                        <span>
                                                            {
                                                                teacher.email
                                                            }
                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={
                                                        teacher.is_active
                                                            ? "teacher-status active"
                                                            : "teacher-status inactive"
                                                    }
                                                >

                                                    <i />

                                                    {
                                                        teacher.is_active
                                                            ? "Active"
                                                            : "Inactive"
                                                    }

                                                </span>

                                            </td>


                                            {/* COURSES */}

                                            <td>

                                                <strong>
                                                    {
                                                        teacher.courses_count ??
                                                        0
                                                    }
                                                </strong>

                                            </td>


                                            {/* STUDENTS */}

                                            <td>

                                                <strong>
                                                    {
                                                        teacher.students_count ??
                                                        0
                                                    }
                                                </strong>

                                            </td>


                                            {/* LESSONS */}

                                            <td>

                                                <strong>
                                                    {
                                                        teacher.lessons_count ??
                                                        0
                                                    }
                                                </strong>

                                            </td>


                                            {/* EXAMS */}

                                            <td>

                                                <strong>
                                                    {
                                                        teacher.exams_count ??
                                                        0
                                                    }
                                                </strong>

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <button
                                                    className="teacher-view-button"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/teachers/${teacher.id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                            </td>


                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}


export default Teachers;