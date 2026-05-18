import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { useTracker } from '../context/TrackerContext'
import { TRACKING_STATUSES } from '../utils/trackedJobs'

function SavedJobs() {
  const { removeTrackedJob, trackedJobs, updateTrackedJob } = useTracker()
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [draftNotes, setDraftNotes] = useState({})
  const [draftFollowUpDates, setDraftFollowUpDates] = useState({})

  const trackedJobsList = useMemo(() => trackedJobs, [trackedJobs])

  const filteredTrackedJobs = useMemo(() => {
    if (selectedStatus === 'All') {
      return trackedJobsList
    }

    return trackedJobsList.filter((job) => job.trackingStatus === selectedStatus)
  }, [trackedJobsList, selectedStatus])

  useEffect(() => {
    const nextDraftNotes = {}
    const nextDraftFollowUpDates = {}

    trackedJobsList.forEach((job) => {
      nextDraftNotes[job.id] = job.trackingNotes || ''
      nextDraftFollowUpDates[job.id] = job.followUpDate || ''
    })

    setDraftNotes(nextDraftNotes)
    setDraftFollowUpDates(nextDraftFollowUpDates)
  }, [trackedJobsList])

  const handleStatusChange = async (jobId, nextStatus) => {
    await updateTrackedJob(jobId, { status: nextStatus })
  }

  const handleRemove = async (jobId) => {
    await removeTrackedJob(jobId)
  }

  const handleNotesChange = (jobId, value) => {
    setDraftNotes((prev) => ({
      ...prev,
      [jobId]: value,
    }))
  }

  const handleNotesSave = async (jobId) => {
    await updateTrackedJob(jobId, { notes: draftNotes[jobId] || '' })
  }

  const handleFollowUpDateChange = (jobId, value) => {
    setDraftFollowUpDates((prev) => ({
      ...prev,
      [jobId]: value,
    }))
  }

  const handleFollowUpDateSave = async (jobId) => {
    await updateTrackedJob(jobId, {
      followUpDate: draftFollowUpDates[jobId] || '',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
            Tracker
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">
            Applications
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Track saved roles, applications, interviews, and outcomes.
          </p>
        </div>

        <div className="w-full lg:w-[260px]">
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none"
          >
            <option value="All">All Statuses</option>
            {TRACKING_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <p className="text-sm text-slate-600">
          Showing{' '}
          <span className="font-semibold text-slate-900">
            {filteredTrackedJobs.length}
          </span>{' '}
          tracked job{filteredTrackedJobs.length !== 1 ? 's' : ''}
          {selectedStatus !== 'All' ? ` in ${selectedStatus}` : ''}
        </p>
      </div>

      {filteredTrackedJobs.length > 0 ? (
        <div className="space-y-4">
          {filteredTrackedJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge status={job.trackingStatus} />
                    <span className="text-xs font-medium text-slate-500">
                      {job.type}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {job.mode}
                    </span>
                  </div>

                  <h2 className="mt-3 text-lg font-bold text-slate-950">
                    {job.title}
                  </h2>

                  <p className="mt-1 text-slate-600">
                    {job.company} • {job.location}
                  </p>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {job.description}
                  </p>

                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Notes
                    </label>
                    <textarea
                      rows="4"
                      value={draftNotes[job.id] || ''}
                      onChange={(event) =>
                        handleNotesChange(job.id, event.target.value)
                      }
                      placeholder="Add notes about this application..."
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleNotesSave(job.id)}
                      className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 sm:w-auto"
                    >
                      Save Notes
                    </button>
                  </div>

                  <div className="mt-4 rounded-lg bg-slate-50 p-4">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Follow-Up Date
                    </label>
                    <input
                      type="date"
                      value={draftFollowUpDates[job.id] || ''}
                      onChange={(event) =>
                        handleFollowUpDateChange(job.id, event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleFollowUpDateSave(job.id)}
                      className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 sm:w-auto"
                    >
                      Save Date
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:w-[240px] xl:grid-cols-1">
                  <div className="sm:col-span-2 xl:col-span-1">
                    <label className="mb-2 block text-sm font-medium text-slate-600">
                      Update Status
                    </label>
                    <select
                      value={job.trackingStatus}
                      onChange={(event) =>
                        handleStatusChange(job.id, event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none"
                    >
                      {TRACKING_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Link
                    to={`/job/${job.id}`}
                    className="rounded-lg bg-slate-900 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    View Details
                  </Link>

                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-sky-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-sky-700"
                    >
                      Apply Now
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemove(job.id)}
                    className="sm:col-span-2 xl:col-span-1 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">
            No jobs found for this status
          </h2>
          <p className="mt-2 text-slate-500">
            Try switching the filter or update a tracked job to this stage.
          </p>
        </div>
      )}
    </div>
  )
}

export default SavedJobs
