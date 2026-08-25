import Sidebar from "../components/Sidebar";
import "../styles/dashboard.css";

function StudentLayout({ children }) {
    return (
        <div className="dashboard-layout">

            <Sidebar />

            <main className="dashboard-main">
                {children}
            </main>

        </div>
    );
}

export default StudentLayout;