import React, { useEffect, useState } from "react";
import { updateNote, getNotes } from "../services/noteService";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, notification, Space } from "antd";

const UpdateNotePage: React.FC = () => {
    const [form] = Form.useForm();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const { currentPage, pageSize } = (location.state as { currentPage: number, pageSize: number }) || { currentPage: 1, pageSize: 3 }; // default if not provided
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNote = async () => {
            const fetchedNotes = await getNotes(currentPage, pageSize);
            const noteToEdit = fetchedNotes.notes.find((note) => note.id === id);
            if (noteToEdit) {
                form.setFieldsValue(noteToEdit);
                setLoading(false);
            }
        };
        fetchNote();
    }, [id, form, currentPage, pageSize]);

    const handleSubmit = async (values: any) => {
        await updateNote(id as string, {
            id: id as string,
            title: values.title,
            content: values.content,
            createdAt: values.createdAt,
            updatedAt: new Date().toISOString(),
        });
        notification.success({ message: 'Note updated successfully' });
        navigate("/", { state: { currentPage, pageSize } });
    };

    // Function to handle 'Cancel' button click
    const handleCancel = () => {
        navigate("/", { state: { currentPage, pageSize } });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Update Note</h1>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                    <Input placeholder="Enter title" />
                </Form.Item>
                <Form.Item name="content" label="Content" rules={[{ required: true }]}>
                    <Input.TextArea placeholder="Enter content" rows={4} />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">Update</Button>
                        <Button type="default" onClick={handleCancel}>Cancel</Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UpdateNotePage;
