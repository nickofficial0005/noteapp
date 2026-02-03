'use client';

import { motion } from 'framer-motion';
import { FiHome, FiPlus, FiUser } from 'react-icons/fi';
import { usePathname, useRouter } from 'next/navigation';

interface BottomNavProps {
  onAddClick: () => void;
}

export const BottomNav = ({ onAddClick }: BottomNavProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: FiHome, label: 'Home', path: '/', action: () => router.push('/') },
    { icon: FiPlus, label: 'Add', path: '', action: onAddClick, isPrimary: true },
    { icon: FiUser, label: 'Profile', path: '/profile', action: () => {} }, // Placeholder for profile
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block border-t border-border/40 bg-background/80 px-6 pb-6 pt-2 backdrop-blur-md sm:hidden">
      <div className="flex items-center justify-between">
        {navItems.map((item, index) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          if (item.isPrimary) {
            return (
              <motion.button
                key={index}
                whileTap={{ scale: 0.9 }}
                onClick={item.action}
                className="flex -translate-y-6 flex-col items-center justify-center rounded-full bg-primary p-4 text-primary-foreground shadow-lg shadow-primary/30"
              >
                <Icon className="h-6 w-6" />
              </motion.button>
            );
          }

          return (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9 }}
              onClick={item.action}
              className={`flex flex-col items-center justify-center gap-1 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -bottom-2 h-1 w-1 rounded-full bg-primary"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
