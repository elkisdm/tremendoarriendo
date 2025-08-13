"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  debounceMs?: number;
  maxSuggestions?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder = "Buscar propiedades, ubicaciones o amenidades...",
  suggestions = [],
  onSuggestionSelect,
  isLoading = false,
  disabled = false,
  autoFocus = false,
  debounceMs = 300,
  maxSuggestions = 8,
  className = "",
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Filter and limit suggestions
  const filteredSuggestions = suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(value.toLowerCase()) && 
      suggestion.toLowerCase() !== value.toLowerCase()
    )
    .slice(0, maxSuggestions);

  // Debounced onChange
  const debouncedOnChange = useCallback((newValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    debouncedOnChange(newValue);
    setActiveSuggestionIndex(-1);
  }, [debouncedOnChange]);

  // Handle focus
  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setShowSuggestions(true);
    onFocus?.();
  }, [onFocus]);

  // Handle blur (with delay to allow suggestion clicks)
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
      setShowSuggestions(false);
      setActiveSuggestionIndex(-1);
      onBlur?.();
    }, 150);
  }, [onBlur]);

  // Handle clear
  const handleClear = useCallback(() => {
    onChange('');
    inputRef.current?.focus();
  }, [onChange]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  }, [onChange, onSuggestionSelect]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || filteredSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0) {
          handleSuggestionClick(filteredSuggestions[activeSuggestionIndex]);
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        inputRef.current?.blur();
        break;
    }
  }, [showSuggestions, filteredSuggestions, activeSuggestionIndex, handleSuggestionClick]);

  // Auto focus effect
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className={`
        relative flex items-center
        rounded-2xl border transition-all duration-200
        ${isFocused 
          ? 'border-[var(--primary)] ring-2 ring-[var(--primary)]/20' 
          : 'border-white/20 hover:border-white/30'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        bg-white/5 backdrop-blur
      `}>
        
        {/* Search Icon */}
        <div className="pl-4 pr-2">
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-[var(--subtext)] animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-[var(--subtext)]" />
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="
            flex-1 px-2 py-3 bg-transparent 
            text-white placeholder-[var(--subtext)]
            outline-none
            disabled:cursor-not-allowed
          "
          autoComplete="off"
          role="searchbox"
          aria-expanded={showSuggestions && filteredSuggestions.length > 0}
          aria-haspopup="listbox"
          aria-activedescendant={
            activeSuggestionIndex >= 0 
              ? `suggestion-${activeSuggestionIndex}` 
              : undefined
          }
        />

        {/* Clear Button */}
        {value && !disabled && (
          <button
            onClick={handleClear}
            className="
              px-3 py-1 mr-2
              text-[var(--subtext)] hover:text-white
              transition-colors duration-200
              rounded-lg hover:bg-white/10
            "
            aria-label="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="
              absolute top-full left-0 right-0 mt-2 z-50
              bg-[var(--bg)]/95 backdrop-blur border border-white/20
              rounded-2xl shadow-xl overflow-hidden
            "
            role="listbox"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={suggestion}
                id={`suggestion-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`
                  w-full px-4 py-3 text-left transition-colors duration-150
                  hover:bg-white/10 focus:bg-white/10 focus:outline-none
                  ${index === activeSuggestionIndex ? 'bg-[var(--primary)]/20' : ''}
                  ${index === 0 ? 'rounded-t-2xl' : ''}
                  ${index === filteredSuggestions.length - 1 ? 'rounded-b-2xl' : ''}
                `}
                role="option"
                aria-selected={index === activeSuggestionIndex}
              >
                <div className="flex items-center gap-3">
                  <Search className="w-4 h-4 text-[var(--subtext)] flex-shrink-0" />
                  <span className="text-white truncate">{suggestion}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
