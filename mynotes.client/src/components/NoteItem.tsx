// NoteItem.tsx
import React from "react";
import { Note } from "../types/Note";
import { useNavigate } from "react-router-dom";

interface NoteItemProps {
    note: Note;
    onDelete: (id: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({ note, onDelete }) => {
    const navigate = useNavigate();

    return (
        <div className="note-item">
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <small>Created At: {new Date(note.createdAt).toLocaleString()}</small>
            <button onClick={() => navigate(`/update/${note.id}`)}>Edit</button>
            <button onClick={() => onDelete(note.id)}>Delete</button>
        </div>
    );
};

export default NoteItem;
