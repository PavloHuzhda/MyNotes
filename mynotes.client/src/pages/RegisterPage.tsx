import React, { useState } from "react";
import { Form, Input, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (values: {
        username: string;
        email: string;
        firstname: string;
        secondname: string;
        password: string;
        confirmPassword: string;
    }) => {
        setLoading(true);
        try {
            const response = await registerUser(values);
            notification.success({
                message: "Registration Successful",
                description: response.message,
            });
            navigate("/login");
        } catch (error: unknown) {
            notification.error({
                message: "Registration Failed",
                description: error.response?.data?.message || "An error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <h1>Register</h1>
            <Form
                name="register"
                layout="vertical"
                onFinish={handleRegister}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: "Please enter your username." }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email." },
                        { type: "email", message: "Invalid email format." },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Firstname"
                    name="firstname"
                    rules={[{ required: true, message: "Please enter your firstname." }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Secondname"
                    name="secondname"
                    rules={[{ required: true, message: "Please enter your secondname." }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: "Please enter your password." }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Please confirm your password." },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error("Passwords do not match!")
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Register
                    </Button>
                </Form.Item>
            </Form>
            <p>
                Already have an account?{" "}
                <Button type="link" onClick={() => navigate("/login")}>
                    Login here
                </Button>
            </p>
        </div>
    );
};

export default RegisterPage;
