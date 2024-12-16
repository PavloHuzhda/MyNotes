//Header.tsx
import React from "react";
import { Button, Modal } from "antd";
import { logoutUser } from "../../services/authService";
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

const Header: React.FC = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth(); // Use the AuthContext
    const navigate = useNavigate();

    const confirmLogout = () => {
        Modal.confirm({
            title: "Are you sure you want to logout?",
            onOk: () => {
                logoutUser(); // Clear token from localStorage
                setIsLoggedIn(false); // Update AuthContext
                navigate("/login"); // Redirect to login page after logout
            },
        });
    };

    const handleHomeClick = () => {
        navigate("/"); // Navigate to home
        window.location.reload(); // Force a full page reload
    };

    return (
        <div className="header">
            <Link to="/" className="header-link" onClick={handleHomeClick}>
                <h1>My Notes</h1>
            </Link>
            {isLoggedIn && (
                <Button type="primary" onClick={confirmLogout}>
                    Logout
                </Button>
            )}
        </div>
    );
};

export default Header;
