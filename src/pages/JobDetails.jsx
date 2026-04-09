import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import jobs from '../data/jobs'
import {
  addTrackedJob,
  getTrackedJob,
  isJobTracked,
  removeTrackedJob,
  updateTrackedJobNotes,
  updateTrackedJobStatus,
} from '../utils/trackedJobs'

function JobDetails() {
  const { id } = useParams()
  const job = jobs.find((item) => item.id === Number(id))
  const [isTracked, setIsTracked] = useState(false)
  const [status, setStatus] = useState('Saved')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!job) return

    const trackedJob = getTrackedJob(job.id)

    if (trackedJob) {
      setIsTracked(true)
      setStatus(trackedJob.status)
      setNotes(trackedJob.notes)
    } else {
      setIsTracked(false)
      setStatus('Saved')
      setNotes('')
    }
  }, [job])

  if (!job) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Job not found</h2>
        <p className="mt-2 text-slate-500">
          The role you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700"
        >
          Back to Dashboard
        </Link>
      </div>
    )
  }

  const handleTrackJob = () => {
    if (!isJobTracked(job.id)) {
      addTrackedJob(job.id)
      setIsTracked(true)
      setStatus('Saved')
      setNotes('')
    }
  }

  const handleRemoveTrackedJob = () => {
    removeTrackedJob(job.id)
    setIsTracked(false)
    setStatus('Saved')
    setNotes('')
  }

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value
    setStatus(nextStatus)
    updateTrackedJobStatus(job.id, nextStatus)
  }

  const handleNotesBlur = () => {
    updateTrackedJobNotes(job.id, notes)
  }

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        ← Back to jobs
      </Link>

      <section className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {job.type}
              </span>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {job.mode}
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {job.experience}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-slate-900">{job.title}</h1>
            <p className="mt-2 text-lg text-slate-600">
              {job.company} • {job.location}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 px-5 py-4 text-left lg:min-w-[220px]">
            <p className="text-sm text-slate-500">Salary</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{job.salary}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-2xl font-bold text-slate-900">About this role</h2>
          <p className="mt-4 leading-7 text-slate-600">{job.description}</p>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Track this job</h3>

            {!isTracked ? (
              <button
                type="button"
                onClick={handleTrackJob}
                className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700"
              >
                Add to Tracker
              </button>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Application Status
                  </label>
                  <select
                    value={status}
                    onChange={handleStatusChange}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 outline-none"
                  >
                    <option value="Saved">Saved</option>
                    <option value="Interested">Interested</option>
                    <option value="Applied">Applied</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">
                    Notes
                  </label>
                  <textarea
                    rows="4"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    onBlur={handleNotesBlur}
                    placeholder="Add notes about this job..."
                    className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none"
                  />
                </div>

                {job.url && (
  <a
    href={job.url}
    target="_blank"
    rel="noreferrer"
    className="block rounded-xl bg-sky-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-sky-700"
  >
    Apply Now
  </a>
)}


                <button
                  type="button"
                  onClick={handleRemoveTrackedJob}
                  className="w-full rounded-xl bg-rose-50 px-4 py-3 font-medium text-rose-700 transition hover:bg-rose-100"
                >
                  Remove from Tracker
                </button>

                
              </div>

              
            )}
          </div>
          
        </aside>
      </section>
    </div>
  )
}

export default JobDetails
