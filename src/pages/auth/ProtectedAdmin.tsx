import { Navigate } from "react-router-dom";

function ProtectedAdmin({ children }: any) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== "admin") {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
}
export default ProtectedAdmin;