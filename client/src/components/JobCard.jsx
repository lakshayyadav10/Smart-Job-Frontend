import { Link } from 'react-router-dom'

function JobCard({ job }) {
  const handleViewDetails = () => {
    sessionStorage.setItem('selectedJob', JSON.stringify(job))
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {job.type}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {job.mode}
            </span>
          </div>

          <h3 className="mt-3 text-lg font-bold text-slate-900">{job.title}</h3>

          <p className="mt-1 text-slate-600">
            {job.company} • {job.location}
          </p>

          <p className="mt-2 text-sm text-slate-500">{job.experience}</p>

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
            {job.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-3 md:items-end">
          <p className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-600">
            {job.salary}
          </p>
          <Link
            to={`/job/${job.id}`}
            onClick={handleViewDetails}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobCard
