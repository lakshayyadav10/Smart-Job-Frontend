function SearchBar({ searchTerm, onSearchChange }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by job title, keyword, or company"
          className="flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
        />
        <button
          type="button"
          className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
        >
          Search Jobs
        </button>
      </div>
    </div>
  )
}

export default SearchBar
