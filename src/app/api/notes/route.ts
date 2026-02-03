import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Note from '@/models/Note';
import { auth } from '@/auth';

export async function GET() {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const notes = await Note.find({ userId: session.user.id }).sort({ createdAt: -1 });

        // Process _id to id for frontend compatibility if needed, using lean() or mapping 
        // Mongoose documents have _id, frontend expects id.
        const notesWithId = notes.map(note => ({
            id: note._id.toString(),
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
        }));

        return NextResponse.json(notesWithId);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        if (!body.title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        await connectDB();
        const newNote = await Note.create({
            userId: session.user.id,
            title: body.title,
            content: body.content,
        });

        return NextResponse.json({
            id: newNote._id.toString(),
            title: newNote.title,
            content: newNote.content,
            createdAt: newNote.createdAt
        }, { status: 201 });
    } catch {
        return NextResponse.json(
            { error: 'Failed to create note' },
            { status: 500 }
        );
    }
}
