import { Note } from '@/types';

// In a real app, this would be a database connection.
// For this v1, we use a global variable to persist across hot reloads in dev (mostly).

declare global {
    var notesStore: Note[] | undefined;
}

let notes: Note[] = global.notesStore || [
    {
        id: '1',
        title: 'Welcome to your Notes',
        content: 'This is a sample note to get you started. You can edit or delete this note.',
        createdAt: new Date().toISOString(),
    },
];

if (process.env.NODE_ENV !== 'production') global.notesStore = notes;

export const db = {
    getNotes: async () => [...notes],
    addNote: async (note: Note) => {
        notes.unshift(note);
        return note;
    },
    updateNote: async (id: string, updates: Partial<Note>) => {
        notes = notes.map((n) => (n.id === id ? { ...n, ...updates } : n));
        if (process.env.NODE_ENV !== 'production') global.notesStore = notes;
        return notes.find((n) => n.id === id);
    },
    deleteNote: async (id: string) => {
        notes = notes.filter((n) => n.id !== id);
        if (process.env.NODE_ENV !== 'production') global.notesStore = notes;
        return true;
    },
};
