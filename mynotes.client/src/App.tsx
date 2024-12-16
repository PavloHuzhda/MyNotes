//App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CreateNotePage from "./pages/CreateNotePage";
import UpdateNotePage from "./pages/UpdateNotePage";
import "antd/dist/reset.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedComponent";
import Header from "./components/Header/Header";
import { AuthProvider } from "./contexts/AuthContext";
//import "./App.css";


const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Header /> {/* Add the Header component */}
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create" element={<CreateNotePage />} />
                        <Route path="/update/:id" element={<UpdateNotePage />} />
                    </Route>

                    {/* Catch-All Route */}
                    <Route path="*" element={<LoginPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;