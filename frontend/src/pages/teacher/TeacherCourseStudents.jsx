
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../api/axios";

import "../../styles/teacher-course-students.css";


function TeacherCourseStudents() {

    const { courseId } = useParams();

    const navigate = useNavigate();


    const [data, setData] = useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    /*
    |--------------------------------------------------------------------------
    | Fetch Students
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        const fetchStudents = async () => {

            try {

                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        `/courses/teacher/courses/${courseId}/students/`
                    );


                console.log(
                    "COURSE STUDENTS:",
                    response.data
                );


                setData(response.data);


            } catch (error) {

                console.error(
                    "Course students error:",
                    error
                );


                setError(
                    error.response?.data?.detail ||
                    "Unable to load students."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchStudents();

    }, [courseId]);


    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="teacher-students-loading">

                <div className="teacher-students-spinner" />

                <p>
                    Loading students...
                </p>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Error
    |--------------------------------------------------------------------------
    */

    if (error) {

        return (

            <div className="teacher-students-error">

                <div className="teacher-students-error-icon">
                    !
                </div>


                <h2>
                    Unable to load students
                </h2>


                <p>
                    {error}
                </p>


                <button
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Go Back
                </button>

            </div>

        );

    }


    const students =
        data?.students || [];


    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    const query =
        search
            .toLowerCase()
            .trim();


    const filteredStudents =
        students.filter((student) => {

            if (!query) {
                return true;
            }


            const name =
                student.full_name
                    ?.toLowerCase() || "";


            const phone =
                student.phone_number
                    ?.toLowerCase() || "";


            return (
                name.includes(query) ||
                phone.includes(query)
            );

        });


    return (

        <div className="teacher-course-students">


            {/* =========================================================
                HEADER
            ========================================================= */}

            <header className="teacher-students-header">


                <button
                    className="teacher-students-back"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    ← Back
                </button>


                <div className="teacher-students-title">


                    <span>
                        COURSE STUDENTS
                    </span>


                    <h1>
                        {data?.course?.title}
                    </h1>


                    <p>
                        Students enrolled in this course
                    </p>


                </div>


                <div className="teacher-students-count">

                    <strong>
                        {data?.students_count || 0}
                    </strong>

                    <span>
                        Students
                    </span>

                </div>


            </header>


            {/* =========================================================
                TOOLBAR / SEARCH
            ========================================================= */}

            <section className="teacher-students-toolbar">


                <div className="teacher-students-search">

                    <span>
                        🔎
                    </span>


                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Search by student name or phone..."
                    />


                    {search && (

                        <button
                            type="button"
                            className="teacher-students-search-clear"
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            ×
                        </button>

                    )}

                </div>


                <div className="teacher-students-result-count">

                    {filteredStudents.length}

                    {" "}

                    student
                    {filteredStudents.length !== 1
                        ? "s"
                        : ""}

                </div>


            </section>


            {/* =========================================================
                STUDENTS
            ========================================================= */}

            <section className="teacher-students-section">


                {students.length === 0 ? (

                    <div className="teacher-students-empty">

                        <div className="teacher-students-empty-icon">
                            👨‍🎓
                        </div>


                        <h2>
                            No students yet
                        </h2>


                        <p>
                            No students have enrolled
                            in this course yet.
                        </p>

                    </div>

                ) : filteredStudents.length === 0 ? (

                    <div className="teacher-students-empty">

                        <div className="teacher-students-empty-icon">
                            🔎
                        </div>


                        <h2>
                            No students found
                        </h2>


                        <p>
                            Try searching with another
                            name or phone number.
                        </p>


                        <button
                            onClick={() =>
                                setSearch("")
                            }
                        >
                            Clear Search
                        </button>

                    </div>

                ) : (

                    <div className="teacher-students-grid">


                        {filteredStudents.map(
                            (student) => (

                                <article
                                    className="teacher-student-card"
                                    key={student.id}
                                >


                                    {/* STUDENT HEADER */}

                                    <div className="teacher-student-card-header">


                                        <div className="teacher-student-avatar">

                                            {student.full_name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "S"}

                                        </div>


                                        <div className="teacher-student-info">

                                            <span>
                                                STUDENT
                                            </span>


                                            <h3>
                                                {student.full_name}
                                            </h3>


                                            <p>
                                                📱{" "}

                                                {student.phone_number ||
                                                    "No phone number"}

                                            </p>

                                        </div>


                                    </div>


                                    {/* ENROLLMENT */}

                                    <div className="teacher-student-enrollment">

                                        <span>
                                            ENROLLED
                                        </span>


                                        <strong>
                                            {student.enrolled_at
                                                ? new Date(
                                                    student.enrolled_at
                                                ).toLocaleDateString()
                                                : "—"}
                                        </strong>

                                    </div>


                                    {/* EXAMS */}

                                    <div className="teacher-student-exams">


                                        <div className="teacher-student-exams-header">

                                            <div>

                                                <span>
                                                    EXAM RESULTS
                                                </span>

                                                <strong>
                                                    {student.exams_count || 0}
                                                </strong>

                                            </div>

                                        </div>


                                        {student.exam_results?.length === 0 ? (

                                            <div className="teacher-no-exams">

                                                No exam attempts yet.

                                            </div>

                                        ) : (

                                            <div className="teacher-exam-results">


                                                {student.exam_results.map(
                                                    (exam) => (

                                                        <div
                                                            className="teacher-exam-result"
                                                            key={
                                                                exam.attempt_id
                                                            }
                                                        >


                                                            <div className="teacher-exam-info">

                                                                <strong>
                                                                    {
                                                                        exam.exam_title
                                                                    }
                                                                </strong>


                                                                <small>
                                                                    {
                                                                        exam.lesson_title
                                                                    }
                                                                </small>


                                                                {exam.completed_at && (

                                                                    <small>
                                                                        {new Date(
                                                                            exam.completed_at
                                                                        ).toLocaleDateString()}
                                                                    </small>

                                                                )}

                                                            </div>


                                                            <div
                                                                className={
                                                                    exam.passed
                                                                        ? "teacher-exam-score passed"
                                                                        : "teacher-exam-score failed"
                                                                }
                                                            >

                                                                <strong>
                                                                    {exam.score}%
                                                                </strong>


                                                                <span>
                                                                    {exam.passed
                                                                        ? "Passed"
                                                                        : "Failed"}
                                                                </span>

                                                            </div>


                                                        </div>

                                                    )
                                                )}

                                            </div>

                                        )}

                                    </div>


                                </article>

                            )
                        )}

                    </div>

                )}

            </section>


        </div>

    );

}


export default TeacherCourseStudents;
