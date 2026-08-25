
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../api/axios";
import "../../styles/student-all-courses.css";


function AllCourses() {

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
                "/courses/student/courses/"
            );

            setCourses(response.data);

        } catch (error) {

            console.error(
                "Student courses error:",
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

                course.description
                    ?.toLowerCase()
                    .includes(searchValue) ||

                course.teacher?.username
                    ?.toLowerCase()
                    .includes(searchValue);


            const matchesFilter =
                filter === "ALL" ||

                (
                    filter === "ENROLLED" &&
                    course.is_enrolled
                ) ||

                (
                    filter === "AVAILABLE" &&
                    !course.is_enrolled
                );


            return (
                matchesSearch &&
                matchesFilter
            );

        });

    }, [courses, search, filter]);


    if (loading) {

        return (

            <div className="student-courses-loading">

                <div className="student-courses-loader">
                    Loading courses...
                </div>

            </div>

        );

    }


    if (error) {

        return (

            <div className="student-courses-error">

                <div className="student-courses-error-card">

                    <div className="student-courses-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load courses
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchCourses}
                    >
                        Try Again
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="student-all-courses-page">


            {/* HEADER */}

            <div className="student-courses-header">

                <div>

                    <span>
                        LEARNING PLATFORM
                    </span>

                    <h1>
                        All Courses
                    </h1>

                    <p>
                        Explore courses and continue
                        your learning journey.
                    </p>

                </div>


                <div className="student-courses-total">

                    <strong>
                        {courses.length}
                    </strong>

                    <span>
                        Courses
                    </span>

                </div>

            </div>


            {/* TOOLBAR */}

            <div className="student-courses-toolbar">


                <div className="student-courses-search">

                    <span>
                        🔎
                    </span>

                    <input
                        type="text"
                        placeholder="Search courses or teachers..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                </div>


                <div className="student-courses-filters">

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
                            filter === "ENROLLED"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("ENROLLED")
                        }
                    >
                        My Courses
                    </button>


                    <button
                        className={
                            filter === "AVAILABLE"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setFilter("AVAILABLE")
                        }
                    >
                        Available
                    </button>

                </div>

            </div>


            {/* RESULT COUNT */}

            <div className="student-courses-results">

                Showing

                <strong>
                    {filteredCourses.length}
                </strong>

                courses

            </div>


            {/* COURSES */}

            {filteredCourses.length > 0 ? (

                <div className="student-courses-grid">

                    {filteredCourses.map(
                        (course) => (

                            <div
                                className="student-course-card"
                                key={course.id}
                            >


                                {/* IMAGE / ICON */}

                                <div className="student-course-cover">

                                    <div className="student-course-cover-icon">
                                        📚
                                    </div>


                                    {course.is_enrolled && (

                                        <span className="student-enrolled-badge">
                                            Enrolled
                                        </span>

                                    )}

                                </div>


                                {/* CONTENT */}

                                <div className="student-course-content">


                                    <h2>
                                        {course.title}
                                    </h2>


                                    <p className="student-course-description">

                                        {course.description ||
                                            "No description available."}

                                    </p>


                                    {/* TEACHER */}

                                    <div className="student-course-teacher">

                                        <div className="student-teacher-avatar">

                                            {course.teacher?.username
                                                ?.charAt(0)
                                                ?.toUpperCase()}

                                        </div>


                                        <div>

                                            <span>
                                                INSTRUCTOR
                                            </span>

                                            <strong>
                                                {course.teacher?.username ||
                                                    "Unknown Teacher"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* META */}

                                    <div className="student-course-meta">

                                        <span>
                                            📖 {course.lessons_count} Lessons
                                        </span>

                                        <span>
                                            💰 {course.price} EGP
                                        </span>

                                    </div>


                                    {/* ACTION */}

                                    <button
                                        className={
                                            course.is_enrolled
                                                ? "student-course-button enrolled"
                                                : "student-course-button"
                                        }
                                        onClick={() =>
                                            navigate(
                                                `/student/courses/${course.id}`
                                            )
                                        }
                                    >

                                        {course.is_enrolled
                                            ? "Continue Course →"
                                            : "View Course →"}

                                    </button>


                                </div>

                            </div>

                        )
                    )}

                </div>

            ) : (

                <div className="student-courses-empty">

                    <div className="student-courses-empty-icon">
                        🔎
                    </div>

                    <h2>
                        No Courses Found
                    </h2>

                    <p>
                        Try another search or change
                        the selected filter.
                    </p>

                    <button
                        onClick={() => {

                            setSearch("");
                            setFilter("ALL");

                        }}
                    >
                        Clear Filters
                    </button>

                </div>

            )}

        </div>

    );

}


export default AllCourses;

