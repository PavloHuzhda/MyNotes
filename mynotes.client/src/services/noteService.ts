import axios from "axios";
import { Note } from "../types/Note";

const API_URL = "https://localhost:7269/api/notes"; // Update with your actual API URL

export const getNotes = async (pageNumber: number, pageSize: number): Promise<{ notes: Note[], totalCount: number }> => {
    const urlWithParams = `${API_URL}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await axios.get(urlWithParams);
    console.log("Response:", response);
    return {
        notes: response.data.notes,
        totalCount: response.data.totalCount,
    };
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
    const response = await axios.post(API_URL, note);
    return response.data;
};

export const updateNote = async (id: string, note: Note): Promise<Note> => {
    const response = await axios.put(`${API_URL}/${id}`, note);
    return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
};

export const findNotesByTitle = async (title: string): Promise<Note[]> => {
    const response = await axios.get(`${API_URL}/search`, {
        params: { title },
    });
    return response.data;
};

export const sortNotes = async (sortBy: string): Promise<Note[]> => {
    const response = await axios.get(`${API_URL}/sort`, {
        params: { sortBy },
    });
    return response.data;
};
