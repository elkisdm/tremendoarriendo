export function SortSelect({ value, onChange }: { value: string; onChange: (v: string)=>void }){
  return (
    <div className="inline-flex items-center gap-2 text-sm">
      <span className="text-[var(--subtext)]">Ordenar:</span>
      <select aria-label="Ordenar resultados" className="ui-input" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="price-asc">Precio ↑</option>
        <option value="price-desc">Precio ↓</option>
        <option value="comuna">Comuna A–Z</option>
      </select>
    </div>
  );
}
