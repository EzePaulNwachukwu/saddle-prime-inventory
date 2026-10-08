const inputClass =
  'rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500';

export default function ProductFilters({ filters, onChange, categories, suppliers }) {
  const set = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  const handleClear = () => {
    onChange({
      name: '',
      category: '',
      supplier: '',
      priceMin: '',
      priceMax: '',
      quantityMin: '',
      quantityMax: '',
    });
  };

  return (
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Search name</label>
        <input
          value={filters.name}
          onChange={set('name')}
          placeholder="e.g. phone"
          className={`${inputClass} w-40`}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
        <select value={filters.category} onChange={set('category')} className={`${inputClass} w-40`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Supplier</label>
        <select value={filters.supplier} onChange={set('supplier')} className={`${inputClass} w-40`}>
          <option value="">All suppliers</option>
          {suppliers.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Price min</label>
        <input
          type="number"
          min="0"
          value={filters.priceMin}
          onChange={set('priceMin')}
          className={`${inputClass} w-24`}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Price max</label>
        <input
          type="number"
          min="0"
          value={filters.priceMax}
          onChange={set('priceMax')}
          className={`${inputClass} w-24`}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Qty min</label>
        <input
          type="number"
          min="0"
          value={filters.quantityMin}
          onChange={set('quantityMin')}
          className={`${inputClass} w-20`}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-slate-500">Qty max</label>
        <input
          type="number"
          min="0"
          value={filters.quantityMax}
          onChange={set('quantityMax')}
          className={`${inputClass} w-20`}
        />
      </div>

      {hasActiveFilters && (
        <button
          onClick={handleClear}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
