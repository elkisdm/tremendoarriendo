"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  suggestions?: string[];
  autoFocus?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onSuggestionSelect?: (suggestion: string) => void;
  maxSuggestions?: number;
}

export function SearchInput({ 
  value, 
  onChange, 
  placeholder = "Buscar por dirección, comuna, tipología...", 
  className = "",
  debounceMs = 300,
  suggestions = [],
  autoFocus = false,
  isLoading = false,
  disabled = false,
  onSuggestionSelect,
  maxSuggestions = 5
}: SearchInputProps) {
  const [localValue, setLocalValue] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced change handler
  const debouncedOnChange = useCallback((newValue: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedOnChange(newValue);
  }, [debouncedOnChange]);

  // Handle clear
  const handleClear = useCallback(() => {
    setLocalValue("");
    onChange("");
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [onChange]);

  // Handle key press
  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredSuggestions = suggestions.filter(s => 
      s.toLowerCase().includes(localValue.toLowerCase())
    ).slice(0, maxSuggestions);

    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && filteredSuggestions[selectedSuggestionIndex]) {
        const selectedSuggestion = filteredSuggestions[selectedSuggestionIndex];
        setLocalValue(selectedSuggestion);
        onChange(selectedSuggestion);
        onSuggestionSelect?.(selectedSuggestion);
        setShowSuggestions(false);
      } else {
        // Trigger immediate search on Enter
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        onChange(localValue);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      handleClear();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
    }
  }, [localValue, onChange, handleClear, suggestions, maxSuggestions, selectedSuggestionIndex, onSuggestionSelect]);

  // Handle focus
  const handleFocus = useCallback(() => {
    if (suggestions.length > 0 && localValue.trim() !== "") {
      setShowSuggestions(true);
    }
  }, [suggestions.length, localValue]);

  // Handle blur
  const handleBlur = useCallback(() => {
    // Delay hiding suggestions to allow for suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }, 200);
  }, []);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setLocalValue(suggestion);
    onChange(suggestion);
    onSuggestionSelect?.(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    inputRef.current?.focus();
  }, [onChange, onSuggestionSelect]);

  // Sync with external value changes
  useEffect(() => {
    if (value !== localValue && value !== undefined) {
      setLocalValue(value);
    }
  }, [value, localValue]);

  // Show suggestions when typing
  useEffect(() => {
    if (localValue.trim() !== "" && suggestions.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  }, [localValue, suggestions.length]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const hasValue = localValue && localValue.trim() !== "";

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          value={localValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className={`
            w-full 
            pl-10 pr-10 py-3 
            bg-gray-800 
            border border-gray-600 
            rounded-2xl 
            text-gray-100 
            placeholder-gray-400
            focus:outline-none 
            focus:ring-2 
            focus:ring-blue-500 
            focus:border-transparent
            transition-colors
            duration-200
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          aria-label="Buscar propiedades"
          aria-expanded={showSuggestions}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-activedescendant={selectedSuggestionIndex >= 0 ? `suggestion-${selectedSuggestionIndex}` : undefined}
        />
        
        {/* Search icon */}
        <MagnifyingGlassIcon 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          aria-hidden="true"
        />
        
        {/* Loading indicator or Clear button */}
        {isLoading ? (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-gray-400 border-t-transparent rounded-full" />
          </div>
        ) : hasValue && (
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled}
            className="
              absolute right-3 top-1/2 transform -translate-y-1/2 
              h-5 w-5 
              text-gray-400 
              hover:text-gray-200 
              focus:outline-none 
              focus:text-gray-200
              transition-colors
              duration-200
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            aria-label="Limpiar búsqueda"
          >
            <XMarkIcon className="h-full w-full" />
          </button>
        )}
      </div>
      
      {/* Suggestions dropdown */}
      {showSuggestions && (
        (() => {
          const filteredSuggestions = suggestions
            .filter(s => s.toLowerCase().includes(localValue.toLowerCase()))
            .slice(0, maxSuggestions);
          
          return filteredSuggestions.length > 0 ? (
            <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-xl shadow-lg z-50">
              <ul role="listbox" className="py-2">
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={suggestion}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={index === selectedSuggestionIndex}
                    className={`
                      px-4 py-2 cursor-pointer transition-colors
                      ${index === selectedSuggestionIndex 
                        ? 'bg-blue-600 text-white' 
                        : 'text-gray-200 hover:bg-gray-700'
                      }
                    `}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          ) : hasValue ? (
            <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-400 px-3">
              Buscando: "{localValue.trim()}"
            </div>
          ) : null;
        })()
      )}
    </div>
  );
}