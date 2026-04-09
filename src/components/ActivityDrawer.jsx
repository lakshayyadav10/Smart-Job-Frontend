function ActivityDrawer({ isOpen, onClose, activities }) {
  return (
    <div
      className={`fixed inset-0 z-40 transition ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-slate-900/30 transition ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
            <p className="mt-1 text-sm text-slate-500">
              Latest tracker updates
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Close
          </button>
        </div>

        <div className="h-[calc(100%-81px)] overflow-y-auto px-6 py-5">
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <p className="text-sm font-semibold text-slate-900">
                    {activity.jobTitle || 'Tracked job'}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{activity.message}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center text-sm text-slate-500">
              No recent activity yet
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}

export default ActivityDrawer
