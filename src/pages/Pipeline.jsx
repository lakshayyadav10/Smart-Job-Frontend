import { useMemo } from 'react'
import ApplicationPipelineCard from '../components/ApplicationPipelineCard'
import { useTracker } from '../context/TrackerContext'
import jobs from '../data/jobs'
import { TRACKING_STATUSES } from '../utils/trackedJobs'

function Pipeline() {
  const { trackedJobs } = useTracker()

  const trackedJobsList = useMemo(() => {
    return trackedJobs
      .map((trackedJob) => {
        const fullJob = jobs.find((job) => job.id === trackedJob.jobId)

        if (!fullJob) return null

        return {
          ...fullJob,
          trackingStatus: trackedJob.status,
          trackingNotes: trackedJob.notes,
          savedAt: trackedJob.savedAt,
          followUpDate: trackedJob.followUpDate,
        }
      })
      .filter(Boolean)
  }, [trackedJobs])

  const groupedJobs = useMemo(() => {
    return TRACKING_STATUSES.reduce((acc, status) => {
      acc[status] = trackedJobsList.filter((job) => job.trackingStatus === status)
      return acc
    }, {})
  }, [trackedJobsList])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Application Pipeline</h1>
        <p className="mt-2 text-slate-600">
          View your applications by stage and monitor progress at a glance.
        </p>
      </div>

      <div className="space-y-5 xl:hidden">
        {TRACKING_STATUSES.map((status) => (
          <section
            key={status}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{status}</h2>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {groupedJobs[status]?.length || 0}
              </span>
            </div>

            <div className="space-y-3">
              {groupedJobs[status]?.length > 0 ? (
                groupedJobs[status].map((job) => (
                  <ApplicationPipelineCard key={job.id} job={job} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-6 text-center text-sm text-slate-500">
                  No jobs in this stage
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className="hidden gap-5 xl:grid xl:grid-cols-3">
        {TRACKING_STATUSES.map((status) => (
          <section
            key={status}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{status}</h2>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                {groupedJobs[status]?.length || 0}
              </span>
            </div>

            <div className="space-y-3">
              {groupedJobs[status]?.length > 0 ? (
                groupedJobs[status].map((job) => (
                  <ApplicationPipelineCard key={job.id} job={job} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
                  No jobs in this stage
                </div>
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default Pipeline
