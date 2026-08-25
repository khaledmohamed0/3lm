import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/admin-courses.css";


function AdminCourses() {

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [filter, setFilter] = useState("ALL");


    useEffect(() => {

        fetchCourses();

    }, []);


    const fetchCourses = async () => {

        try {

            setLoading(true);

            setError("");

            const response = await api.get(
                "/courses/admin/courses/"
            );

            setCourses(response.data);

        } catch (error) {

            console.error(
                "Admin courses error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load courses."
            );

        } finally {

            setLoading(false);

        }

    };


    const filteredCourses = useMemo(() => {

        return courses.filter((course) => {

            const searchValue =
                search.toLowerCase().trim();


            const matchesSearch =
                course.title
                    ?.toLowerCase()
                    .includes(searchValue) ||

                course.teacher?.username
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesFilter =
                filter === "ALL" ||

                (filter === "PUBLISHED" &&
                    course.is_published) ||

                (filter === "DRAFT" &&
                    !course.is_published);


            return (
                matchesSearch &&
                matchesFilter
            );

        });

    }, [courses, search, filter]);


    if (loading) {

        return (
            <div className="admin-courses-loading">
                Loading courses...
            </div>
        );

    }


    if (error) {

        return (

            <div className="admin-courses-error">

                <h3>
                    Unable to load courses
                </h3>

                <p>
                    {error}
                </p>

                <button
                    onClick={fetchCourses}
                >
                    Try Again
                </button>

            </div>

        );

    }


    return (

        <div className="admin-courses-page">


            {/* HEADER */}

            <div className="admin-courses-header">

                <div>

                    <span>
                        ADMINISTRATION
                    </span>

                    <h1>
                        Courses
                    </h1>

                    <p>
                        View and monitor all courses
                        on the platform.
                    </p>

                </div>


                <div className="admin-courses-total">

                    <strong>
                        {courses.length}
                    </strong>

                    <span>
                        Total Courses
                    </span>

                </div>

            </div>


            {/* FILTER BAR */}

            <div className="admin-courses-toolbar">


                <div className="admin-courses-search">

                    <span>
                        🔎
                    </span>

                    <input
                        type="text"
                        placeholder="Search course or teacher..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <div className="admin-courses-filters">

                    <button
                        className={
                            filter === "ALL"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("ALL")
                        }
                    >
                        All
                    </button>


                    <button
                        className={
                            filter === "PUBLISHED"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("PUBLISHED")
                        }
                    >
                        Published
                    </button>


                    <button
                        className={
                            filter === "DRAFT"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("DRAFT")
                        }
                    >
                        Draft
                    </button>

                </div>

            </div>


            {/* RESULTS */}

            <div className="admin-courses-results">

                <span>
                    Showing
                </span>

                <strong>
                    {filteredCourses.length}
                </strong>

                <span>
                    courses
                </span>

            </div>


            {/* COURSES */}

            {filteredCourses.length > 0 ? (

                <div className="admin-courses-grid">

                    {filteredCourses.map(
                        (course) => (

                            <div
                                className="admin-course-card"
                                key={course.id}
                            >

                                {/* TOP */}

                                <div className="admin-course-card-top">

                                    <div className="admin-course-card-icon">
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


                                {/* TITLE */}

                                <h2>
                                    {course.title}
                                </h2>


                                <p className="admin-course-description">

                                    {course.description ||
                                        "No description available."}

                                </p>


                                {/* TEACHER */}

                                <div className="admin-course-teacher">

                                    <div className="teacher-mini-avatar">

                                        {course.teacher?.username
                                            ?.charAt(0)
                                            ?.toUpperCase()}

                                    </div>


                                    <div>

                                        <span>
                                            TEACHER
                                        </span>

                                        <strong>
                                            {course.teacher?.username ||
                                                "Unknown"}
                                        </strong>

                                    </div>

                                </div>


                                {/* STATS */}

                                <div className="admin-course-card-stats">


                                    <div>

                                        <strong>
                                            {course.students_count || 0}
                                        </strong>

                                        <span>
                                            Students
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {course.lessons_count || 0}
                                        </strong>

                                        <span>
                                            Lessons
                                        </span>

                                    </div>


                                    <div>

                                        <strong>
                                            {course.exams_count || 0}
                                        </strong>

                                        <span>
                                            Exams
                                        </span>

                                    </div>

                                </div>


                                {/* FOOTER */}

                                <div className="admin-course-card-footer">

                                    <strong>
                                        {course.price} EGP
                                    </strong>


                                    <button
                                        onClick={() =>
                                            navigate(
                                                `/admin/courses/${course.id}`
                                            )
                                        }
                                    >
                                        View Course →
                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            ) : (

                <div className="admin-courses-empty">

                    <div>
                        🔎
                    </div>

                    <h3>
                        No Courses Found
                    </h3>

                    <p>
                        Try changing your search
                        or filter.
                    </p>

                </div>

            )}

        </div>

    );

}


export default AdminCourses;