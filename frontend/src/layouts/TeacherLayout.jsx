
import { NavLink } from "react-router-dom";

import "../styles/teacher-layout.css";


function TeacherLayout({ children }) {

    return (

        <div className="teacher-layout">

            <aside className="teacher-sidebar">

                <div className="teacher-sidebar-brand">

                    <div className="teacher-brand-logo">
                        K
                    </div>

                    <div>
                        <strong>
                            KMG Learning
                        </strong>

                        <span>
                            Teacher Panel
                        </span>
                    </div>

                </div>


                <nav className="teacher-navigation">

                    <NavLink
                        to="/teacher/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "teacher-nav-link active"
                                : "teacher-nav-link"
                        }
                    >
                        <span>📊</span>
                        Dashboard
                    </NavLink>


                    <NavLink
                        to="/teacher/dashboard"
                        className={({ isActive }) =>
                            isActive
                                ? "teacher-nav-link active"
                                : "teacher-nav-link"
                        }
                    >
                        <span>📚</span>
                        My Courses
                    </NavLink>

                </nav>


                <div className="teacher-sidebar-bottom">

                    <button
                        className="teacher-logout-button"
                        onClick={() => {

                            localStorage.removeItem(
                                "access_token"
                            );

                            localStorage.removeItem(
                                "refresh_token"
                            );

                            window.location.href =
                                "/login";

                        }}
                    >
                        <span>↪</span>
                        Logout
                    </button>

                </div>

            </aside>


            <main className="teacher-main">

                {children}

            </main>

        </div>

    );

}


export default TeacherLayout;

