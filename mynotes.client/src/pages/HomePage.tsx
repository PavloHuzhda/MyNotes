import React, { useEffect, useState } from "react";
import { Note } from "../types/Note";
import { getNotes, deleteNote, findNotesByTitle, sortNotes } from "../services/noteService";
import { Table, Button, Input, Select, Space, notification } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons"; // Import icons

const { Search } = Input;
const { Option } = Select;

const HomePage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes);
    };

    const handleDelete = async (id: string) => {
        await deleteNote(id);
        notification.success({ message: 'Note deleted successfully' });
        fetchNotes();
    };

    const handleSearch = async (value: string) => {
        if (value.trim() !== "") {
            const searchedNotes = await findNotesByTitle(value);
            setNotes(searchedNotes);
        } else {
            fetchNotes(); // Re-fetch all notes if search box is empty
        }
    };

    const handleSort = async (value: string) => {
        const sortedNotes = await sortNotes(value);
        setNotes(sortedNotes);
    };

    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => moment(text).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Note) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/update/${record.id}`)}
                        style={{ backgroundColor: '#fadb14', borderColor: '#fadb14' }}
                    >
                        Edit
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <h1>Notes</h1>
            <Space style={{ marginBottom: 16 }}>
                <Search
                    placeholder="Search by title"
                    onSearch={handleSearch}
                    enterButton
                />
                <Select placeholder="Sort By" onChange={handleSort} style={{ width: 180 }}>
                    <Option value="datetime_asc">Datetime Ascending</Option>
                    <Option value="datetime_desc">Datetime Descending</Option>
                    <Option value="title_asc">Title Ascending</Option>
                    <Option value="title_desc">Title Descending</Option>
                </Select>
                <Button type="primary" onClick={() => navigate("/create")}>
                    Create New Note
                </Button>
            </Space>
            <Table dataSource={notes} columns={columns} rowKey="id" />
        </div>
    );
};

export default HomePage;
