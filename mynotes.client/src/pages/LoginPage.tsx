//LoginPage.tsx
import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { loginUser } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

const LoginPage: React.FC = () => {
    const { setIsLoggedIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (values: { identifier: string; password: string }) => {
        setLoading(true);
        try {
            const response = await loginUser(values); // Pass values directly
            notification.success({
                message: "Login Successful",
                description: response.message,
            });
            localStorage.setItem("token", response.token); // Save JWT token
            setIsLoggedIn(true);
            navigate("/");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                notification.error({
                    message: "Login Failed",
                    description: error.response?.data?.message || "An error occurred.",
                });
            } else {
                notification.error({
                    message: "Login Failed",
                    description: "An unexpected error occurred.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Login</h1>
            <Form name="login" layout="vertical" onFinish={handleLogin} autoComplete="off">
                <Form.Item
                    label="Email or Username"
                    name="identifier"
                    rules={[{ required: true, message: "Please enter your email or username." }]}
                >
                    <Input placeholder="Email or Username" />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please enter your password." }]}
                >
                    <Input.Password placeholder="Password" visibilityToggle />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Login
                    </Button>
                </Form.Item>
            </Form>

            <p>
                Don't have an account?{" "}
                <Button type="link" style={{ fontSize: "14px", padding: "0" }} onClick={() => navigate("/register")}>
                    Register here
                </Button>
            </p>
            <p>
                <Button type="link" style={{ fontSize: "14px", padding: "0" }} onClick={() => navigate("/forgot-password")}>
                    Forgot Password?
                </Button>
            </p>
        </div>

    );
};

export default LoginPage;
