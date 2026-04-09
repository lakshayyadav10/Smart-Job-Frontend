import { Link } from 'react-router-dom'

function JobCard({ job }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              {job.type}
            </span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {job.mode}
            </span>
          </div>

          <h3 className="mt-3 text-xl font-bold text-slate-800">{job.title}</h3>

          <p className="mt-1 text-slate-600">
            {job.company} • {job.location}
          </p>

          <p className="mt-2 text-sm text-slate-500">{job.experience}</p>

          <p className="mt-4 text-sm leading-6 text-slate-500">
            {job.description}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <p className="text-sm font-medium text-slate-500">{job.salary}</p>
          <Link
            to={`/job/${job.id}`}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobCard
