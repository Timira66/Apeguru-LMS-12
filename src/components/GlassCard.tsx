import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GlassCard = ({ children, className, delay = 0, onClick }: { children: React.ReactNode, className?: string, delay?: number, onClick?: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    onClick={onClick}
    className={cn(
      "bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl transition-all duration-300",
      onClick && "cursor-pointer hover:bg-white/15 hover:scale-[1.01] active:scale-[0.99]",
      className
    )}
  >
    {children}
  </motion.div>
);
