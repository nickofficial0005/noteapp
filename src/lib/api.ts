import { Note } from '@/types';

const API_URL = '/api/notes';

export const api = {
    fetchNotes: async (): Promise<Note[]> => {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch notes');
        return res.json();
    },

    createNote: async (note: Pick<Note, 'title' | 'content'>): Promise<Note> => {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        if (!res.ok) throw new Error('Failed to create note');
        return res.json();
    },

    updateNote: async (id: string, note: Partial<Note>): Promise<Note> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(note),
        });
        if (!res.ok) throw new Error('Failed to update note');
        return res.json();
    },

    deleteNote: async (id: string): Promise<void> => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete note');
    },
};
