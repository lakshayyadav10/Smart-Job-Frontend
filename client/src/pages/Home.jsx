import { useEffect, useMemo, useState } from 'react'
import DashboardWidget from '../components/DashboardWidget'
import DeadlineList from '../components/DeadlineList'
import FilterDrawer from '../components/FilterDrawer'
import FilterSidebar from '../components/FilterSidebar'
import JobCard from '../components/JobCard'
import SearchBar from '../components/SearchBar'
import StatsCard from '../components/StatsCard'
import { useTracker } from '../context/TrackerContext'
import fallbackJobs from '../data/jobs'
import { fetchJobs } from '../utils/jobsApi'

function Home() {
  const { trackedJobs } = useTracker()

  const [jobs, setJobs] = useState(fallbackJobs)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)
  const [filters, setFilters] = useState({
    mode: 'All',
    type: 'All',
    experience: 'All',
  })

  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true)
        setError('')
        const apiJobs = await fetchJobs()
        setJobs(apiJobs)
      } catch {
        setError('Using fallback data because live jobs could not be loaded.')
        setJobs(fallbackJobs)
      } finally {
        setIsLoading(false)
      }
    }

    loadJobs()
  }, [])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleResetFilters = () => {
    setFilters({
      mode: 'All',
      type: 'All',
      experience: 'All',
    })
    setSearchTerm('')
    setSortBy('latest')
  }

  const filteredJobs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const result = jobs.filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(normalizedSearch) ||
        job.company.toLowerCase().includes(normalizedSearch) ||
        job.description.toLowerCase().includes(normalizedSearch)

      const matchesMode = filters.mode === 'All' || job.mode === filters.mode
      const matchesType = filters.type === 'All' || job.type === filters.type
      const matchesExperience =
        filters.experience === 'All' || job.experience === filters.experience

      return matchesSearch && matchesMode && matchesType && matchesExperience
    })

    if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title))
    }

    if (sortBy === 'company') {
      result.sort((a, b) => a.company.localeCompare(b.company))
    }

    return result
  }, [filters, jobs, searchTerm, sortBy])

  const trackerJobs = useMemo(() => {
    return trackedJobs
  }, [trackedJobs])

  const trackingStats = useMemo(() => {
    return {
      tracked: trackedJobs.length,
      applied: trackedJobs.filter((job) => job.status === 'Applied').length,
      interview: trackedJobs.filter((job) => job.status === 'Interview').length,
      offer: trackedJobs.filter((job) => job.status === 'Offer').length,
      rejected: trackedJobs.filter((job) => job.status === 'Rejected').length,
      interested: trackedJobs.filter((job) => job.status === 'Interested').length,
    }
  }, [trackedJobs])

  const todayString = new Date().toISOString().split('T')[0]

  const overdueJobs = useMemo(() => {
    return trackerJobs.filter(
      (job) => job.followUpDate && job.followUpDate < todayString
    )
  }, [todayString, trackerJobs])

  const upcomingJobs = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const nextWeek = new Date(today)
    nextWeek.setDate(today.getDate() + 7)

    return trackerJobs.filter((job) => {
      if (!job.followUpDate) return false

      const followUp = new Date(job.followUpDate)
      return followUp >= today && followUp <= nextWeek
    })
  }, [trackerJobs])

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
            Smart Job Tracker
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Application command center
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track your pipeline, follow-ups, AI insights, and live job opportunities
            from one focused workspace.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            Current Focus
          </p>
          <p className="mt-1 text-sm font-bold text-slate-800">
            {overdueJobs.length > 0
              ? `${overdueJobs.length} overdue follow-up${overdueJobs.length > 1 ? 's' : ''}`
              : `${upcomingJobs.length} upcoming action${upcomingJobs.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          label="Tracked Jobs"
          value={trackingStats.tracked}
          accent="text-slate-900"
        />
        <StatsCard
          label="Applied"
          value={trackingStats.applied}
          accent="text-blue-600"
        />
        <StatsCard
          label="Interviews"
          value={trackingStats.interview}
          accent="text-amber-600"
        />
        <StatsCard
          label="Offers"
          value={trackingStats.offer}
          accent="text-emerald-600"
        />
        <StatsCard
          label="Rejected"
          value={trackingStats.rejected}
          accent="text-rose-600"
        />
        <StatsCard
          label="Interested"
          value={trackingStats.interested}
          accent="text-sky-600"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <DashboardWidget
          title="Overdue Follow-Ups"
          subtitle="Jobs that need immediate attention"
        >
          <DeadlineList
            jobs={overdueJobs}
            emptyText="No overdue follow-ups right now."
            tone="rose"
          />
        </DashboardWidget>

        <DashboardWidget
          title="Upcoming This Week"
          subtitle="Planned follow-ups in the next 7 days"
        >
          <DeadlineList
            jobs={upcomingJobs}
            emptyText="No upcoming follow-ups scheduled."
            tone="amber"
          />
        </DashboardWidget>
      </section>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}
        </div>
      )}

      <section className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Job Opportunities</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredJobs.length} opportunit
                {filteredJobs.length === 1 ? 'y' : 'ies'}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm lg:hidden"
              >
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none"
              >
                <option value="latest">Sort by Latest</option>
                <option value="title">Sort by Title</option>
                <option value="company">Sort by Company</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">Loading jobs...</h3>
              <p className="mt-2 text-slate-500">Fetching the latest opportunities.</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-slate-800">No jobs found</h3>
              <p className="mt-2 text-slate-500">
                Try changing your search or clearing the filters.
              </p>
            </div>
          )}
        </div>
      </section>

      <FilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={() => {
          handleResetFilters()
          setIsFilterDrawerOpen(false)
        }}
      />
    </div>
  )
}

export default Home
