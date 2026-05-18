
import { Link } from 'react-router-dom'

function DeadlineList({ jobs, emptyText, tone = 'amber' }) {
  const toneClasses = {
    amber: 'bg-amber-50 text-amber-700',
    rose: 'bg-rose-50 text-rose-700',
  }

  if (jobs.length === 0) {
    return <p className="text-sm text-slate-500">{emptyText}</p>
  }

  return (
    <div className="space-y-3">
      {jobs.map((job) => (
        <div
          key={job.id}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate font-medium text-slate-900">{job.title}</p>
            <p className="text-sm text-slate-500">{job.company}</p>
          </div>

          <div className="ml-4 text-right">
            <p
              className={`rounded-full px-3 py-1 text-xs font-semibold ${toneClasses[tone]}`}
            >
              {job.followUpDate}
            </p>
            <Link
              to={`/job/${job.id}`}
              className="mt-2 inline-block text-sm font-medium text-sky-700 hover:text-sky-900"
            >
              Open
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DeadlineList
