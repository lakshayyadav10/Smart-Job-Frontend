import { useMemo, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import ActivityDrawer from '../components/ActivityDrawer'
import { useTracker } from '../context/TrackerContext'
import jobs from '../data/jobs'

function MainLayout() {
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { activityLog } = useTracker()

  const navLinkClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
    }`

  const mobileNavLinkClass = ({ isActive }) =>
    `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-900 text-white'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e0f2fe_0%,_#f8fafc_35%,_#f8fafc_100%)] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <NavLink to="/" className="block" onClick={closeMobileMenu}>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
                  Career Suite
                </p>
                <h1 className="truncate text-lg font-black tracking-tight text-slate-900 sm:text-xl">
                  Smart Job Tracker
                </h1>
              </NavLink>
            </div>

            <div className="hidden items-center gap-3 lg:flex">
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

            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setIsActivityOpen(true)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                Activity
              </button>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                {isMobileMenuOpen ? 'Close' : 'Menu'}
              </button>
            </div>
          </div>

          {isMobileMenuOpen && (
            <div className="mt-4 space-y-2 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm lg:hidden">
              <NavLink
                to="/"
                end
                className={mobileNavLinkClass}
                onClick={closeMobileMenu}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/saved"
                className={mobileNavLinkClass}
                onClick={closeMobileMenu}
              >
                My Applications
              </NavLink>
              <NavLink
                to="/pipeline"
                className={mobileNavLinkClass}
                onClick={closeMobileMenu}
              >
                Pipeline
              </NavLink>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
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
