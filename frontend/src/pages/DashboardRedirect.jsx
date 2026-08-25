import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardRedirect() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div>
                Loading...
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user.role === "STUDENT") {
        return (
            <Navigate
                to="/student/dashboard"
                replace
            />
        );
    }

    if (user.role === "TEACHER") {
        return (
            <Navigate
                to="/teacher/dashboard"
                replace
            />
        );
    }

    if (user.role === "ADMIN") {
        return (
            <Navigate
                to="/admin/dashboard"
                replace
            />
        );
    }

    return (
        <Navigate
            to="/login"
            replace
        />
    );
}

export default DashboardRedirect;