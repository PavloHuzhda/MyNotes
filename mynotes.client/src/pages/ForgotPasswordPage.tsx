//ForgotPasswordPage.tsx
import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { forgotPasswordUser } from "../services/authService";

const ForgotPasswordPage: React.FC = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { email: string }) => {
        try {
            setLoading(true);
            const response = await forgotPasswordUser(values); // Call the service
            notification.success({
                message: "Email Sent",
                description: response.message || "Check your inbox for the password reset link.",
            });
        } catch (error) {
            console.error("Error sending forgot password request:", error);
            notification.error({
                message: "Error",
                description: "Unable to send reset link. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "50px auto" }}>
            <h2>Forgot Password</h2>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Please enter a valid email!" },
                    ]}
                >
                    <Input placeholder="Enter your email" />
                </Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Send Reset Link
                </Button>
            </Form>
        </div>
    );
};

export default ForgotPasswordPage;