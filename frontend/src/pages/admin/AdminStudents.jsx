import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/admin-students.css";


function AdminStudents() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const fetchStudents = async (searchValue = "") => {

        try {

            setLoading(true);
            setError("");

            const response = await api.get(
                "/courses/admin/students/",
                {
                    params: {
                        search: searchValue,
                    },
                }
            );

            console.log(
                "ADMIN STUDENTS:",
                response.data
            );

            setStudents(response.data);

        } catch (error) {

            console.error(
                "Admin students error:",
                error
            );

            if (
                error.response?.status === 403
            ) {

                setError(
                    "You are not allowed to access students."
                );

            } else {

                setError(
                    "Failed to load students."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchStudents();

    }, []);


    const handleSearch = (e) => {

        const value = e.target.value;

        setSearch(value);

        fetchStudents(value);

    };


    return (

        <div className="admin-students-page">


            {/* HEADER */}

            <div className="admin-students-header">

                <div>

                    <span>
                        ADMIN PANEL
                    </span>

                    <h1>
                        Students
                    </h1>

                    <p>
                        Manage students enrolled in the
                        learning platform.
                    </p>

                </div>


                <button
                    className="admin-back-button"
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >
                    ← Dashboard
                </button>

            </div>


            {/* SEARCH */}

            <div className="admin-students-toolbar">

                <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={search}
                    onChange={handleSearch}
                />

            </div>


            {/* ERROR */}

            {error && (

                <div className="admin-students-error">

                    {error}

                </div>

            )}


            {/* CONTENT */}

            <div className="admin-students-card">


                <div className="admin-students-card-header">

                    <div>

                        <span>
                            STUDENTS
                        </span>

                        <h2>
                            {students.length} Students
                        </h2>

                    </div>

                </div>


                {loading ? (

                    <div className="admin-students-loading">

                        Loading students...

                    </div>

                ) : students.length === 0 ? (

                    <div className="admin-students-empty">

                        No students found.

                    </div>

                ) : (

                    <div className="admin-students-table-wrapper">

                        <table className="admin-students-table">

                            <thead>

                                <tr>

                                    <th>
                                        Student
                                    </th>

                                    <th>
                                        Email
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Action
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {students.map(
                                    (student) => (

                                    <tr
                                        key={student.id}
                                    >

                                        <td>

                                            <div className="student-name">

                                                <div className="student-avatar">

                                                    {student.username
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}

                                                </div>

                                                <strong>

                                                    {student.username}

                                                </strong>

                                            </div>

                                        </td>


                                        <td>

                                            {student.email}

                                        </td>


                                        <td>

                                            {student.is_active ? (

                                                <span className="student-status active">

                                                    Active

                                                </span>

                                            ) : (

                                                <span className="student-status inactive">

                                                    Inactive

                                                </span>

                                            )}

                                        </td>


                                        <td>

                                            <button
                                                className="student-view-button"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/students/${student.id}`
                                                    )
                                                }
                                            >

                                                View

                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>


        </div>

    );

}


export default AdminStudents;