function StatsCard({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`h-1 w-10 rounded-full ${accent.replace('text-', 'bg-')}`} />
      <p className="mt-4 text-sm font-medium text-slate-500">{label}</p>
      <h3 className={`mt-2 text-3xl font-black ${accent}`}>{value}</h3>
    </div>
  )
}

export default StatsCard
