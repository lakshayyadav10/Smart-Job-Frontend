function FilterSidebar({
  filters,
  onFilterChange,
  onResetFilters,
  title = 'Filters',
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Location Mode
          </label>
          <select
            value={filters.mode}
            onChange={(event) => onFilterChange('mode', event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
          >
            <option value="All">All Modes</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Job Type
          </label>
          <select
            value={filters.type}
            onChange={(event) => onFilterChange('type', event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
          >
            <option value="All">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Experience Level
          </label>
          <select
            value={filters.experience}
            onChange={(event) => onFilterChange('experience', event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
          >
            <option value="All">All Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="w-full rounded-xl bg-slate-100 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-200"
        >
          Reset Filters
        </button>
      </div>
    </aside>
  )
}

export default FilterSidebar
