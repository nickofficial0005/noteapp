'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { logOut } from '@/lib/actions';
import { BottomNav } from './BottomNav';
import { BiSolidNotepad } from "react-icons/bi";

interface LayoutProps {
  children: ReactNode;
  onAddClick?: () => void;
}

export const Layout = ({ children, onAddClick }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Top Nav - Hidden on mobile */}
      <nav className="hidden sm:block fixed top-0 left-0 right-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <BiSolidNotepad className='text-2xl text-yellow-400' />
            <span className="text-lg font-bold tracking-tight">Notes</span>
          </div>
          <div className="flex items-center gap-4">
             <form action={logOut}>
               <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                 Sign Out
               </button>
             </form>
          </div>
        </div>
      </nav>
      
      <main className="mx-auto max-w-5xl px-4 pt-6 pb-24 sm:pt-24 sm:pb-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Bottom Nav - Visible on mobile */}
      {onAddClick && <BottomNav onAddClick={onAddClick} />}
    </div>
  );
};
