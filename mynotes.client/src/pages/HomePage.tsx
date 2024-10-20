import React, { useEffect, useState } from "react";
import { Note } from "../types/Note";
import { getNotes, deleteNote, findNotesByTitle, sortNotes } from "../services/noteService";
import { Table, Button, Input, Select, Space, notification } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import moment from "moment";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Option } = Select;

const HomePage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [expandedContent, setExpandedContent] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [totalNotes, setTotalNotes] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If there is state passed from previous navigation, use it to set the pagination
        if (location.state) {
            const { currentPage: prevPage, pageSize: prevSize } = location.state as {
                currentPage: number;
                pageSize: number;
            };
            if (prevPage) setCurrentPage(prevPage);
            if (prevSize) setPageSize(prevSize);
        }
    }, [location.state]);

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
        notification.success({ message: 'Note deleted successfully' });
        fetchNotes(currentPage, pageSize);
    };

    const handleSearch = async (value: string) => {
        if (value.trim() !== "") {
            const searchedNotes = await findNotesByTitle(value);
            setNotes(searchedNotes);
            setTotalNotes(searchedNotes.length); // Update totalNotes accordingly
        } else {
            fetchNotes(currentPage, pageSize); // Re-fetch all notes if search box is empty
        }
    };

    const handleSort = async (value: string) => {
        const sortedNotes = await sortNotes(value);
        setNotes(sortedNotes);
    };

    const toggleContent = (id: string) => {
        setExpandedContent(expandedContent === id ? null : id);
    };

    const handlePageChange = (page: number, pageSize: number) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = [
        {
            title: '№',
            key: 'index',
            render: (_: any, __: Note, index: number) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
            render: (text: string, record: Note) => {
                const isExpanded = expandedContent === record.id;

                if (isExpanded) {
                    return (
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {text}
                            <Button
                                type="link"
                                onClick={() => toggleContent(record.id)}
                                style={{ paddingLeft: 0 }}
                            >
                                Show less
                            </Button>
                        </div>
                    );
                } else {
                    let truncatedText = text.substring(0, 10);
                    const hyphenIndex = text.indexOf('-');

                    if (hyphenIndex !== -1 && hyphenIndex < 15) {
                        truncatedText = text.substring(0, hyphenIndex + 1);
                    }

                    return (
                        <div style={{ whiteSpace: 'pre-wrap' }}>
                            {truncatedText}...
                            <Button
                                type="link"
                                onClick={() => toggleContent(record.id)}
                                style={{ paddingLeft: 0 }}
                            >
                                Show more
                            </Button>
                        </div>
                    );
                }
            },
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
                        onClick={() => navigate(`/update/${record.id}`, { state: { currentPage, pageSize } })}
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
            <Table
                dataSource={Array.isArray(notes) ? notes : []}
                columns={columns}
                rowKey="id"
                pagination={
                    totalNotes > pageSize
                        ? {
                            current: currentPage,
                            pageSize: pageSize,
                            total: totalNotes,
                            onChange: handlePageChange,
                            showSizeChanger: true,
                            pageSizeOptions: ['3', '5', '10', '20'],
                            onShowSizeChange: (current, size) => {
                                setPageSize(size);
                                setCurrentPage(1);
                            },
                        }
                        : false
                }
            />
        </div>
    );
};

export default HomePage;
