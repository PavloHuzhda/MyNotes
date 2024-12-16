import React from "react";
import { createNote } from "../services/noteService";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, notification } from "antd";
import './styles/CreateNotePage.css'

const CreateNotePage: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (values: any) => {
        await createNote({
            title: values.title,
            content: values.content,
            createdAt: new Date().toISOString(),
        });
        notification.success({ message: 'Note created successfully' });
        navigate("/");
    };

    const handleCancel = () => {
        navigate("/");
    };

    return (
        <div className="create-note-container">
            <h1>Create Note</h1>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input placeholder="Enter title" />
                </Form.Item>
                <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                    <Input.TextArea placeholder="Enter content" rows={4} />
                </Form.Item>
                <Form.Item>
                    <div className="create-note-buttons">
                        <Button type="primary" htmlType="submit">Create</Button>
                        <Button type="default" onClick={handleCancel}>Cancel</Button>
                    </div>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateNotePage;
