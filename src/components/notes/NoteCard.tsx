import { motion } from 'framer-motion';
import { Note } from '@/types';
import { Button } from '@/components/ui/Button';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  // Safe date formatting
  const dateStr = new Date(note.createdAt);
  const timeAgo = !isNaN(dateStr.getTime()) 
    ? formatDistanceToNow(dateStr, { addSuffix: true }) 
    : 'Recently';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-5 text-card-foreground shadow-sm transition-colors hover:border-primary/50 hover:shadow-lg"
    >
      <div className="space-y-3">
        <h3 className="line-clamp-1 text-lg font-semibold tracking-tight text-foreground">
          {note.title}
        </h3>
        <p className="line-clamp-4 text-sm text-muted-foreground whitespace-pre-wrap">
          {note.content}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
        <span className="text-xs font-medium text-muted-foreground/60">
          {timeAgo}
        </span>
        <div className="flex gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(note);
            }}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
