const statusClasses = {
  Saved: 'bg-slate-100 text-slate-700',
  Interested: 'bg-sky-100 text-sky-700',
  Applied: 'bg-blue-100 text-blue-700',
  Interview: 'bg-amber-100 text-amber-700',
  Offer: 'bg-emerald-100 text-emerald-700',
  Rejected: 'bg-rose-100 text-rose-700',
}

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        statusClasses[status] || 'bg-slate-100 text-slate-700'
      }`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
