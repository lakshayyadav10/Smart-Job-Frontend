import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'

function ApplicationPipelineCard({ job }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">{job.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{job.company}</p>
        </div>

        <StatusBadge status={job.trackingStatus} />
        
      </div>

      <p className="mt-3 text-sm text-slate-500">{job.location}</p>

      

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
        {job.trackingNotes || 'No notes added yet.'}
      </p>

      {job.followUpDate && (
  <p className="mt-3 text-sm font-medium text-amber-700">
    Follow up: {job.followUpDate}
  </p>
)}


     <div className="mt-4 flex items-center gap-4">

    
  <Link
    to={`/job/${job.id}`}
    className="text-sm font-medium text-sky-700 hover:text-sky-900"
  >
    Open Details
  </Link>

  {job.url && (
    <a
      href={job.url}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
    >
      Apply
    </a>
  )}



 

</div>

 

    </div>
  )
}

export default ApplicationPipelineCard
