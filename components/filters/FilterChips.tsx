"use client";
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FilterChip } from '../../types/filters';

export interface FilterChipsProps {
  chips: FilterChip[];
  onClearAll?: () => void;
  maxVisible?: number;
  className?: string;
  showClearAll?: boolean;
}

export function FilterChips({
  chips,
  onClearAll,
  maxVisible = 6,
  className = "",
  showClearAll = true,
}: FilterChipsProps) {
  const visibleChips = chips.slice(0, maxVisible);
  const hiddenCount = Math.max(0, chips.length - maxVisible);

  if (chips.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {/* Filter Chips */}
      <AnimatePresence mode="popLayout">
        {visibleChips.map((chip) => (
          <motion.div
            key={chip.id}
            layout
            initial={{ opacity: 0, scale: 0.8, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -20 }}
            transition={{ duration: 0.2 }}
            className="
              inline-flex items-center gap-2 px-3 py-1.5
              bg-[var(--primary)]/20 border border-[var(--primary)]/30
              rounded-xl text-sm text-white
              hover:bg-[var(--primary)]/30 transition-colors duration-200
              max-w-xs
            "
          >
            {/* Chip Label and Value */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[var(--primary)] font-medium text-xs uppercase tracking-wide flex-shrink-0">
                {chip.label}
              </span>
              <span className="text-white truncate">
                {chip.value}
              </span>
            </div>

            {/* Remove Button */}
            <button
              onClick={chip.onRemove}
              className="
                flex-shrink-0 p-0.5 rounded-full 
                hover:bg-white/20 transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-white/30
              "
              aria-label={`Remover filtro ${chip.label}: ${chip.value}`}
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hidden Count Indicator */}
      {hiddenCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="
            inline-flex items-center px-2 py-1
            bg-white/10 border border-white/20
            rounded-lg text-xs text-[var(--subtext)]
          "
        >
          +{hiddenCount} más
        </motion.div>
      )}

      {/* Clear All Button */}
      {showClearAll && chips.length > 1 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={onClearAll}
          className="
            inline-flex items-center gap-1.5 px-3 py-1.5
            bg-white/5 border border-white/20
            rounded-xl text-sm text-[var(--subtext)]
            hover:bg-white/10 hover:text-white
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-white/30
          "
        >
          <X className="w-3 h-3" />
          <span>Limpiar todo</span>
        </motion.button>
      )}
    </div>
  );
}

// Individual FilterChip component for standalone use
export interface SingleChipProps {
  label: string;
  value: string;
  onRemove: () => void;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export function SingleChip({
  label,
  value,
  onRemove,
  className = "",
  variant = 'default',
}: SingleChipProps) {
  const variantStyles = {
    default: 'bg-white/10 border-white/20 text-white',
    primary: 'bg-[var(--primary)]/20 border-[var(--primary)]/30 text-white',
    secondary: 'bg-blue-500/20 border-blue-500/30 text-blue-100',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, x: -20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.8, x: -20 }}
      transition={{ duration: 0.2 }}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5
        border rounded-xl text-sm
        hover:brightness-110 transition-all duration-200
        max-w-xs
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {/* Label and Value */}
      <div className="flex items-center gap-1.5 min-w-0">
        <span className="font-medium text-xs uppercase tracking-wide flex-shrink-0 opacity-80">
          {label}
        </span>
        <span className="truncate">
          {value}
        </span>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="
          flex-shrink-0 p-0.5 rounded-full 
          hover:bg-white/20 transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-white/30
        "
        aria-label={`Remover filtro ${label}: ${value}`}
      >
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

// Utility component for chips container with responsive behavior
export interface ChipsContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function ChipsContainer({ children, className = "" }: ChipsContainerProps) {
  return (
    <div className={`
      flex flex-wrap items-center gap-2
      max-w-full overflow-hidden
      ${className}
    `}>
      {children}
    </div>
  );
}
