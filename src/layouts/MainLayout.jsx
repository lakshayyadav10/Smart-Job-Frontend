import { NavLink, Outlet } from 'react-router-dom'
import { useMemo, useState } from 'react'
import ActivityDrawer from '../components/ActivityDrawer'
import { useTracker } from '../context/TrackerContext'
import jobs from '../data/jobs'

function MainLayout() {
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const { activityLog } = useTracker()

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
    }`

  const enrichedActivity = useMemo(() => {
    return activityLog.map((activity) => {
      const job = jobs.find((item) => item.id === activity.jobId)

      return {
        ...activity,
        jobTitle: job?.title || 'Unknown Job',
      }
    })
  }, [activityLog])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_35%,_#f8fafc_100%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <NavLink to="/" className="block">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                Career Suite
              </p>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                Smart Job Tracker
              </h1>
            </NavLink>
          </div>

          <div className="flex items-center gap-3">
            <nav className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <NavLink to="/" end className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/saved" className={navLinkClass}>
                My Applications
              </NavLink>
              <NavLink to="/pipeline" className={navLinkClass}>
                Pipeline
              </NavLink>
            </nav>

            <button
              type="button"
              onClick={() => setIsActivityOpen(true)}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Activity
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>

      <ActivityDrawer
        isOpen={isActivityOpen}
        onClose={() => setIsActivityOpen(false)}
        activities={enrichedActivity}
      />
    </div>
  )
}

export default MainLayout
