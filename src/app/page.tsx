'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiPlus, FiLoader } from 'react-icons/fi';
import { Toaster, toast } from 'sonner';

import { Note } from '@/types';
import { api } from '@/lib/api';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { NoteCard } from '@/components/notes/NoteCard';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const data = await api.fetchNotes();
      // Sort by newest first
      setNotes(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch {
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const newNote = await api.createNote({ title, content });
      setNotes([newNote, ...notes]);
      closeModals();
      toast.success('Note created');
    } catch {
      toast.error('Failed to create note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !title.trim()) return;

    setIsSubmitting(true);
    try {
      const updated = await api.updateNote(editingNote.id, { title, content });
      setNotes(notes.map(n => n.id === updated.id ? updated : n));
      closeModals();
      toast.success('Note updated');
    } catch {
      toast.error('Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // Optimistic update could go here, but for simplicity we await
    if (!confirm('Are you sure you want to delete this note?')) return;
    
    try {
      await api.deleteNote(id);
      setNotes(notes.filter(n => n.id !== id));
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  };

  const openAddModal = () => {
    setTitle('');
    setContent('');
    setIsAddOpen(true);
  };

  const openEditModal = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const closeModals = () => {
    setIsAddOpen(false);
    setEditingNote(null);
  };

  return (
    <Layout onAddClick={openAddModal}>
      <Toaster position="bottom-right" theme="dark" />
      
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">My Notes</h1>
          <p className="mt-2 text-muted-foreground">Capture your ideas, tasks, and thoughts.</p>
        </div>
        <Button onClick={openAddModal} className="hidden sm:inline-flex shadow-lg shadow-primary/20">
          <FiPlus className="mr-2 h-5 w-5" />
          Add Note
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <FiLoader className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : notes.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center">
          <div className="mb-4 rounded-full bg-secondary p-4">
            <FiPlus className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No notes yet</h3>
          <p className="max-w-xs text-sm text-muted-foreground">
            Create your first note to get started with your collection.
          </p>
          <Button variant="ghost" onClick={openAddModal} className="mt-4">
            Create Note
          </Button>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={closeModals}
        title="Create New Note"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Title</label>
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Content</label>
            <Textarea
              placeholder="Write something..."
              className="min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Create Note</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingNote}
        onClose={closeModals}
        title="Edit Note"
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Title</label>
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Content</label>
            <Textarea
              placeholder="Write something..."
              className="min-h-[150px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={closeModals}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting}>Save Changes</Button>
          </div>
        </form>
      </Modal>
    </Layout>
  );
}
