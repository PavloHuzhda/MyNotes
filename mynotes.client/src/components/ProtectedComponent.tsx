import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute: React.FC = () => {
    const token = localStorage.getItem("token"); // Check for the token in local storage

    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

