import { Schema, model, models } from 'mongoose';

const NoteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: 100,
    },
    content: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Note = models.Note || model('Note', NoteSchema);

export default Note;
