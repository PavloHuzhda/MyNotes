// HomePage.tsx
import React, { useEffect, useState } from "react";
import { Note } from "../types/Note";
import { getNotes, deleteNote, findNotesByTitle, sortNotes } from "../services/noteService";
import NoteItem from "../components/NoteItem";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortOption, setSortOption] = useState<string>("");

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
        fetchNotes();
    };

    const handleSearch = async () => {
        const searchedNotes = await findNotesByTitle(searchTerm);
        setNotes(searchedNotes);
    };

    const handleSort = async (sortBy: string) => {
        const sortedNotes = await sortNotes(sortBy);
        setNotes(sortedNotes);
    };

    return (
        <div>
            <h1>Notes</h1>
            <input
                type="text"
                placeholder="Search by title"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>

            <select onChange={(e) => handleSort(e.target.value)}>
                <option value="">Sort By</option>
                <option value="datetime_asc">Datetime Ascending</option>
                <option value="datetime_desc">Datetime Descending</option>
                <option value="title_asc">Title Ascending</option>
                <option value="title_desc">Title Descending</option>
            </select>

            <button onClick={() => navigate("/create")}>Create New Note</button>

            {notes.map((note) => (
                <NoteItem key={note.id} note={note} onDelete={handleDelete} />
            ))}
        </div>
    );
};

export default HomePage;
