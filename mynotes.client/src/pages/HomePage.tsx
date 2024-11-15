import React, { useEffect, useState } from "react";
import { Note } from "../types/Note";
import {
    getNotes,
    deleteNote,
    findNotesByTitle,
    sortNotes,
    updateNote,
} from "../services/noteService";
import { Input, Select, Button, notification, Pagination, Modal, Form } from "antd";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";

const { Search } = Input;
const { Option } = Select;

const HomePage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalNotes, setTotalNotes] = useState(0);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [form] = Form.useForm(); // Ant Design form instance
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes(currentPage, pageSize);
    }, [currentPage, pageSize]);

    const fetchNotes = async (page: number, size: number) => {
        const { notes, totalCount } = await getNotes(page, size);
        setNotes(notes);
        setTotalNotes(totalCount);
    };

    const handleDelete = async (id: string) => {
        await deleteNote(id);
        notification.success({ message: "Note deleted successfully" });
        fetchNotes(currentPage, pageSize);
    };

    const handleSearch = async (value: string) => {
        if (value.trim()) {
            const searchedNotes = await findNotesByTitle(value);
            setNotes(searchedNotes);
            setTotalNotes(searchedNotes.length);
        } else {
            fetchNotes(currentPage, pageSize);
        }
    };

    const handleSort = async (value: string) => {
        const sortedNotes = await sortNotes(value);
        setNotes(sortedNotes);
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const showEditModal = (note: Note) => {
        setSelectedNote(note);
        setIsEditModalVisible(true);
        form.setFieldsValue({
            title: note.title,
            content: note.content,
        });
    };

    const showViewModal = (note: Note) => {
        setSelectedNote(note);
        setIsViewModalVisible(true);
    };

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
        setSelectedNote(null);
        form.resetFields();
    };

    const handleViewModalCancel = () => {
        setIsViewModalVisible(false);
        setSelectedNote(null);
    };

    const handleFormSubmit = async (values: { title: string; content: string }) => {
        if (selectedNote) {
            await updateNote(selectedNote.id, { ...selectedNote, ...values });
            notification.success({ message: "Note updated successfully" });
            setIsEditModalVisible(false);
            fetchNotes(currentPage, pageSize); // Refresh the list of notes
        }
    };

    return (
        <div className="notes-app">
            <div className="home-header">
                <Link
                    to="/"
                    className="home-link"
                    onClick={() => fetchNotes(1, pageSize)}
                >
                    <h1>My Notes</h1>
                </Link>
            </div>
            <div className="controls-container">
                <Search
                    placeholder="Search notes..."
                    onSearch={handleSearch}
                    enterButton
                    style={{ flex: "2", marginRight: "16px" }}
                />
                <Select
                    placeholder="Sort by: Date"
                    onChange={handleSort}
                    style={{ width: 200, marginRight: "16px" }}
                >
                    <Option value="datetime_asc">Datetime Ascending</Option>
                    <Option value="datetime_desc">Datetime Descending</Option>
                    <Option value="title_asc">Title Ascending</Option>
                    <Option value="title_desc">Title Descending</Option>
                </Select>
                <Button
                    type="primary"
                    onClick={() => navigate("/create")}
                    style={{ marginLeft: "16px" }}
                >
                    + New Note
                </Button>
            </div>

            <div className="notes-grid">
                {notes.map((note) => (
                    <div
                        className="note-card"
                        key={note.id}
                        onClick={() => showViewModal(note)} // Opens view modal
                        style={{ cursor: "pointer" }}
                    >
                        <h3>{note.title}</h3>
                        <p style={{ whiteSpace: "pre-wrap" }}>
                            {note.content.length > 50 ? `${note.content.substring(0, 50)}...` : note.content}
                        </p>
                        <div className="note-meta">
                            <span>{moment(note.createdAt).format("MMMM DD, YYYY")}</span>
                            <Button
                                size="small"
                                className="warning-button"
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent view modal opening when clicking edit button
                                    showEditModal(note);
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                size="small"
                                danger
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent view modal opening when clicking delete button
                                    handleDelete(note.id);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {totalNotes >= 4 && (
                <div className="pagination-container">
                    <Pagination
                        current={currentPage}
                        pageSize={pageSize}
                        total={totalNotes}
                        onChange={handlePageChange}
                        showSizeChanger
                        pageSizeOptions={["3", "5", "10", "20"]}
                    />
                </div>
            )}

            {/* Modal for Viewing Note Details */}
            <Modal
                title={selectedNote?.title}
                visible={isViewModalVisible}
                onCancel={handleViewModalCancel}
                footer={[
                    <Button key="close" onClick={handleViewModalCancel}>
                        Close
                    </Button>,
                ]}
            >
                <p style={{ whiteSpace: "pre-wrap" }}>{selectedNote?.content}</p>
                <p>
                    <strong>Created At:</strong> {moment(selectedNote?.createdAt).format("MMMM DD, YYYY HH:mm")}
                </p>
            </Modal>

            {/* Modal for Editing Note */}
            <Modal
                title="Edit Note"
                visible={isEditModalVisible}
                onCancel={handleEditModalCancel}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleFormSubmit}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please enter the note title" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Content"
                        name="content"
                        rules={[{ required: true, message: "Please enter the note content" }]}
                    >
                        <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                        <Button onClick={handleEditModalCancel} style={{ marginLeft: "8px" }}>
                            Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HomePage;
