import FilterSidebar from './FilterSidebar'

function FilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
}) {
  return (
    <div
      className={`fixed inset-0 z-40 transition ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      } lg:hidden`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/40 transition ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-slate-50 p-4 transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Filters</h2>
            <p className="text-sm text-slate-500">
              Narrow down job opportunities
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Close
          </button>
        </div>

        <FilterSidebar
          title="Refine Search"
          filters={filters}
          onFilterChange={onFilterChange}
          onResetFilters={onResetFilters}
        />
      </div>
    </div>
  )
}

export default FilterDrawer
