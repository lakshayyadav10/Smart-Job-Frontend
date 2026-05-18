import { useMemo, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import ActivityDrawer from '../components/ActivityDrawer'
import { useAuth } from '../context/AuthContext'
import { useTracker } from '../context/TrackerContext'
import jobs from '../data/jobs'

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/saved', label: 'Applications' },
  { to: '/pipeline', label: 'Pipeline' },
  { to: '/ai-history', label: 'AI History' },
  { to: '/profile', label: 'Profile' },
]

function MainLayout() {
  const navigate = useNavigate()
  const [isActivityOpen, setIsActivityOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { activityLog } = useTracker()
  const { logout } = useAuth()

  const navLinkClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-slate-900 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    }`

  const enrichedActivity = useMemo(() => {
    return activityLog.map((activity) => {
      const job = jobs.find((item) => String(item.id) === String(activity.jobId))

      return {
        ...activity,
        jobTitle: activity.jobTitle || job?.title || 'Tracked job',
      }
    })
  }, [activityLog])

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMobileMenu()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:flex lg:flex-col">
        <NavLink to="/" className="block">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
            Career Suite
          </p>
          <h1 className="mt-2 text-xl font-black tracking-tight text-slate-950">
            Smart Job Tracker
          </h1>
        </NavLink>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            onClick={() => setIsActivityOpen(true)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
          >
            Activity
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg bg-rose-50 px-3 py-2.5 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-100"
          >
            Logout
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-4">
          <NavLink to="/" className="min-w-0" onClick={closeMobileMenu}>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-600">
              Career Suite
            </p>
            <h1 className="truncate text-lg font-black tracking-tight text-slate-950">
              Smart Job Tracker
            </h1>
          </NavLink>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsActivityOpen(true)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
            >
              Activity
            </button>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm"
            >
              {isMobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="space-y-1 border-t border-slate-200 bg-white p-3">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClass}
                onClick={closeMobileMenu}
              >
                {item.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg bg-rose-50 px-3 py-2.5 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-100"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:ml-72">
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
