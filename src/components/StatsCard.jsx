function StatsCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className={`mt-3 text-3xl font-bold ${accent}`}>{value}</h3>
    </div>
  )
}

export default StatsCard
