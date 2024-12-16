//noteService.tsx
import { Note } from "../types/Note";
import { API_BASE_URL } from "../configuration/config";
import apiClient from "./apiClient";

//const API_URL = "https://localhost:32769/api/notes"; // Update with your actual API URL
//const API_URL = "https://footballersnotes.click/api/notes"; // Update with your actual API URL
const API_URL = `${API_BASE_URL}/notes`;



export const getNotes = async (pageNumber: number, pageSize: number): Promise<{ notes: Note[], totalCount: number }> => {
    const urlWithParams = `/notes?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    const response = await apiClient.get(urlWithParams);
    return {
        notes: response.data.notes,
        totalCount: response.data.totalCount,
    };
};

export const createNote = async (note: Omit<Note, "id">): Promise<Note> => {
    const response = await apiClient.post("/notes", note);
    return response.data;
};

export const updateNote = async (id: string, note: Note): Promise<Note> => {
    const response = await apiClient.put(`${API_URL}/${id}`, note);
    return response.data;
};

export const deleteNote = async (id: string): Promise<void> => {
    await apiClient.delete(`${API_URL}/${id}`);
};

export const findNotesByTitle = async (title: string): Promise<Note[]> => {
    const response = await apiClient.get(`${API_URL}/search`, {
        params: { title },
    });
    return response.data;
};

export const sortNotes = async (sortBy: string): Promise<Note[]> => {
    const response = await apiClient.get(`${API_URL}/sort`, {
        params: { sortBy },
    });
    return response.data;
};
