import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function ApplicationPipelineCard({ job }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{job.company}</p>
        </div>

        <div className="self-start">
          <StatusBadge status={job.trackingStatus} />
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500">{job.location}</p>

      {job.followUpDate && (
        <p className="mt-3 text-sm font-medium text-amber-700">
          Follow up: {job.followUpDate}
        </p>
      )}

      <p className="mt-3 text-sm leading-6 text-slate-500">
        {job.trackingNotes || 'No notes added yet.'}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Link
          to={`/job/${job.id}`}
          className="rounded-xl bg-slate-100 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-200"
        >
          Open Details
        </Link>

        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-sky-100 px-4 py-2 text-center text-sm font-medium text-sky-700 transition hover:bg-sky-200"
          >
            Apply
          </a>
        )}
      </div>
    </div>
  )
}

export default ApplicationPipelineCard
