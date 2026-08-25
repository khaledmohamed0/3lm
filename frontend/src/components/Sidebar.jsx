import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
    const { user, logout } = useAuth();

    return (
        <aside className="sidebar">

            <div className="sidebar-logo">
                <div className="logo-mark">
                    K
                </div>

                <div>
                    <h2>KMG</h2>
                    <span>Academy</span>
                </div>
            </div>


            <div className="sidebar-user">

                <div className="user-avatar">
                    {(user?.first_name ||
                        user?.username ||
                        "S")
                        .charAt(0)
                        .toUpperCase()}
                </div>

                <div>
                    <strong>
                        {user?.first_name ||
                            user?.username}
                    </strong>

                    <span>
                        Student
                    </span>
                </div>

            </div>


            <nav className="sidebar-nav">

                <p className="nav-label">
                    MAIN MENU
                </p>

                <NavLink to="/student/dashboard">
                    <span>⌂</span>
                    Dashboard
                </NavLink>

                <NavLink to="/student/courses">
                    <span>▣</span>
                    My Courses
                </NavLink>

                <NavLink to="/student/exams">
                    <span>✓</span>
                    Exams
                </NavLink>

                <NavLink to="/student/wallet">
                    <span>◈</span>
                    Wallet
                </NavLink>

            </nav>


            <div className="sidebar-bottom">

                <button
                    className="sidebar-logout"
                    onClick={logout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;