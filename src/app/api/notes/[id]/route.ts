import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Note from '@/models/Note';
import { auth } from '@/auth';

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();

        await connectDB();
        const updatedNote = await Note.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { title: body.title, content: body.content },
            { new: true }
        );

        if (!updatedNote) {
            return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({
            id: updatedNote._id.toString(),
            title: updatedNote.title,
            content: updatedNote.content,
            createdAt: updatedNote.createdAt
        });
    } catch {
        return NextResponse.json(
            { error: 'Failed to update note' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await connectDB();
        const deleted = await Note.findOneAndDelete({ _id: id, userId: session.user.id });

        if (!deleted) {
            return NextResponse.json({ error: 'Note not found or unauthorized' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json(
            { error: 'Failed to delete note' },
            { status: 500 }
        );
    }
}
