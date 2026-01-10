import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NameTagProps {
  name: string | null;
  onNameChange: (name: string) => void;
  className?: string;
}

export const NameTag: React.FC<NameTagProps> = ({ 
  name, 
  onNameChange,
  className 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name || '');

  const handleSave = () => {
    if (editValue.trim()) {
      onNameChange(editValue.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(name || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <motion.div
      className={cn(
        "absolute -top-12 left-1/2 -translate-x-1/2 z-10",
        className
      )}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="flex items-center gap-1.5 bg-background/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg border border-border"
          >
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Name your pet..."
              className="h-6 w-24 text-xs border-0 bg-transparent p-0 focus-visible:ring-0"
              autoFocus
              maxLength={15}
            />
            <button
              onClick={handleSave}
              className="p-1 rounded-full hover:bg-primary/10 text-primary"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded-full hover:bg-destructive/10 text-destructive"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            key="display"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => {
              setEditValue(name || '');
              setIsEditing(true);
            }}
            className={cn(
              "group flex items-center gap-2 px-4 py-1.5 rounded-full shadow-lg",
              "bg-gradient-to-r from-primary/90 to-primary backdrop-blur-sm",
              "border-2 border-primary-foreground/20",
              "hover:shadow-xl transition-all duration-300"
            )}
          >
            {/* Floating animation */}
            <motion.div
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2"
            >
              <span className="font-medium text-sm text-primary-foreground">
                {name || 'Tap to name'}
              </span>
              <Pencil className="w-3 h-3 text-primary-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NameTag;
