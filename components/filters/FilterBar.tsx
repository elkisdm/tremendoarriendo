"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Filter, X, Search } from "lucide-react";
import { SortSelect } from "./SortSelect";
import type { FilterValues } from "../../types/filters";

// Re-export for backward compatibility
export type { FilterValues };

interface FilterBarProps {
  value: FilterValues;
  onChange: (filters: FilterValues) => void;
  onApply: () => void;
  onClear: () => void;
  sort: string;
  onSort: (sort: string) => void;
  isLoading?: boolean;
}

export function FilterBar({ 
  value, 
  onChange, 
  onApply,
  onClear, 
  sort, 
  onSort,
  isLoading = false
}: FilterBarProps) {
  const [open, setOpen] = useState(false);
  
  const set = (patch: Partial<FilterValues>) => onChange({ ...value, ...patch });
  
  const comunas = ["Todas", "Las Condes", "Ñuñoa", "Providencia", "Santiago", "Macul"];
  const tipologias = ["Todas", "Studio", "1D/1B", "2D/1B", "2D/2B"];

  return (
    <div className="sticky top-0 z-30 backdrop-blur bg-[var(--bg)]/75 ring-1 ring-white/10 rounded-2xl p-3">
      <div className="flex flex-wrap items-center gap-2">
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition-colors" 
          aria-expanded={open}
          aria-controls="mobile-filters"
        >
          <Filter className="w-4 h-4" aria-hidden="true" /> 
          Filtros
        </button>
        <div className="ml-auto md:ml-0">
          <SortSelect value={sort} onChange={onSort} />
        </div>
        <button 
          onClick={onClear} 
          className="md:ml-auto inline-flex items-center gap-2 text-sm text-[var(--subtext)] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" aria-hidden="true" /> 
          Limpiar
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            id="mobile-filters"
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="mt-3 grid grid-cols-1 gap-3 md:hidden"
          >
            <select 
              aria-label="Comuna" 
              className="ui-input" 
              value={value.comuna} 
              onChange={(e) => set({ comuna: e.target.value })}
            >
              {comunas.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            
            <select 
              aria-label="Tipología" 
              className="ui-input" 
              value={value.tipologia} 
              onChange={(e) => set({ tipologia: e.target.value })}
            >
              {tipologias.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <input 
                aria-label="Precio mínimo" 
                className="ui-input w-full" 
                type="number" 
                placeholder="Mín $" 
                value={value.minPrice ?? ""} 
                onChange={(e) => set({ minPrice: e.target.value ? Number(e.target.value) : null })} 
              />
              <input 
                aria-label="Precio máximo" 
                className="ui-input w-full" 
                type="number" 
                placeholder="Máx $" 
                value={value.maxPrice ?? ""} 
                onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : null })} 
              />
            </div>
            
            <button
              onClick={onApply}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Search className="w-4 h-4" aria-hidden="true" />
              {isLoading ? "Buscando..." : "Aplicar"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden md:flex items-center gap-3 mt-3">
        <select 
          aria-label="Comuna" 
          className="ui-input" 
          value={value.comuna} 
          onChange={(e) => set({ comuna: e.target.value })}
        >
          {comunas.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        
        <select 
          aria-label="Tipología" 
          className="ui-input" 
          value={value.tipologia} 
          onChange={(e) => set({ tipologia: e.target.value })}
        >
          {tipologias.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        
        <input 
          aria-label="Precio mínimo" 
          className="ui-input" 
          type="number" 
          placeholder="Mín $" 
          value={value.minPrice ?? ""} 
          onChange={(e) => set({ minPrice: e.target.value ? Number(e.target.value) : null })} 
        />
        
        <input 
          aria-label="Precio máximo" 
          className="ui-input" 
          type="number" 
          placeholder="Máx $" 
          value={value.maxPrice ?? ""} 
          onChange={(e) => set({ maxPrice: e.target.value ? Number(e.target.value) : null })} 
        />
        
        <button
          onClick={onApply}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
          {isLoading ? "Buscando..." : "Aplicar"}
        </button>
      </div>
    </div>
  );
}
