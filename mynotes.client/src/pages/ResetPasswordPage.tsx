//ResetPasswordPage.tsx
import React, { useEffect, useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPasswordUser } from "../services/authService";
import axios from "axios";

const ResetPasswordPage: React.FC = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    //const { token } = useParams(); // Token from the reset link
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Debugging: Verify if token exists when the component renders
    useEffect(() => {
        if (!token) {
            notification.error({ message: "Invalid or expired reset link." });
            navigate("/login"); // Redirect if token is missing
        }
    }, [token, navigate]);

    const onFinish = async (values: { password: string; confirmPassword: string }) => {
        if (!token) {
            return notification.error({ message: "Invalid or expired reset link." });
        }
        if (values.password !== values.confirmPassword) {
            return notification.error({ message: "Passwords do not match!" });
        }

        try {
            setLoading(true);
            const response = await resetPasswordUser({ token, newPassword: values.password });
            notification.success({
                message: "Password Reset Successful",
                description: response.message || "The password has been changed.",
            });
            navigate("/login");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                console.error("Backend Error:", error.response?.data);
                notification.error({
                    message: "Error resetting password",
                    description: error.response?.data?.message || "Failed to reset password.",
                });
            } else {
                console.error("Unexpected Error:", error);
                notification.error({
                    message: "Unexpected Error",
                    description: "An unexpected error occurred.",
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2>Reset Password</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="New Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please input your new password!" },
                        { min: 8, message: "Password must be at least 8 characters." },
                    ]}
                >
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    rules={[{ required: true, message: "Please confirm your password!" }]}
                >
                    <Input.Password placeholder="Confirm new password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Reset Password
                </Button>
            </Form>
        </div>
    );
};

export default ResetPasswordPage;
