// CreateNotePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNote } from "../services/noteService";

const CreateNotePage: React.FC = () => {
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createNote({
            title,
            content,
            createdAt: new Date().toISOString(),
        });
        navigate("/");
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New Note</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            ></textarea>
            <button type="submit">Create</button>
        </form>
    );
};

export default CreateNotePage;
