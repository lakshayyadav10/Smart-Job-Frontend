function DashboardWidget({ title, subtitle, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  )
}

export default DashboardWidget
