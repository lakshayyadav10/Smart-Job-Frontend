import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AIInterviewPrepCard from '../components/AIInterviewPrepCard'
import AIJobMatchCard from '../components/AIJobMatchCard'
import { useTracker } from '../context/TrackerContext'
import jobs from '../data/jobs'
import {
  analyzeJobMatch,
  fetchLatestInterviewPrep,
  fetchLatestJobMatch,
  generateInterviewPrep,
} from '../utils/aiApi'

function JobDetails() {
  const { id } = useParams()
  const { addTrackedJob, removeTrackedJob, trackedJobs, updateTrackedJob } =
    useTracker()
  const selectedJob = (() => {
    try {
      const storedJob = sessionStorage.getItem('selectedJob')
      return storedJob ? JSON.parse(storedJob) : null
    } catch {
      return null
    }
  })()
  const job =
    jobs.find((item) => String(item.id) === String(id)) ||
    trackedJobs.find((item) => String(item.jobId) === String(id)) ||
    (String(selectedJob?.id) === String(id) ? selectedJob : null)
  const [isTracked, setIsTracked] = useState(false)
  const [status, setStatus] = useState('Saved')
  const [notes, setNotes] = useState('')
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [interviewPrep, setInterviewPrep] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingPrep, setIsGeneratingPrep] = useState(false)
  const [aiError, setAiError] = useState('')

  const currentTrackedJob = trackedJobs.find(
    (item) => String(item.jobId) === String(job?.id)
  )

  useEffect(() => {
    if (!job) return

    if (currentTrackedJob) {
      setIsTracked(true)
      setStatus(currentTrackedJob.status)
      setNotes(currentTrackedJob.notes)
    } else {
      setIsTracked(false)
      setStatus('Saved')
      setNotes('')
    }
  }, [job, currentTrackedJob])

  useEffect(() => {
    const loadLatestAnalysis = async () => {
      if (!currentTrackedJob?.trackingId) {
        setAiAnalysis(null)
        return
      }

      try {
        const data = await fetchLatestJobMatch(currentTrackedJob.trackingId)
        setAiAnalysis(data.analysis)
      } catch {
        setAiAnalysis(null)
      }
    }

    loadLatestAnalysis()
  }, [currentTrackedJob?.trackingId])

  useEffect(() => {
    const loadLatestInterviewPrep = async () => {
      if (!currentTrackedJob?.trackingId) {
        setInterviewPrep(null)
        return
      }

      try {
        const data = await fetchLatestInterviewPrep(currentTrackedJob.trackingId)
        setInterviewPrep(data.analysis)
      } catch {
        setInterviewPrep(null)
      }
    }

    loadLatestInterviewPrep()
  }, [currentTrackedJob?.trackingId])

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

  const handleTrackJob = async () => {
    if (!isTracked) {
      await addTrackedJob(job)
      setIsTracked(true)
      setStatus('Saved')
      setNotes('')
    }
  }

  const handleRemoveTrackedJob = async () => {
    await removeTrackedJob(job.id)
    setIsTracked(false)
    setStatus('Saved')
    setNotes('')
  }

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value
    setStatus(nextStatus)
    await updateTrackedJob(job.id, { status: nextStatus })
  }

  const handleNotesBlur = async () => {
    await updateTrackedJob(job.id, { notes })
  }

  const handleAnalyzeMatch = async () => {
    if (!currentTrackedJob?.trackingId) {
      setAiError('Add this job to your tracker before running AI analysis.')
      return
    }

    try {
      setIsAnalyzing(true)
      setAiError('')
      const data = await analyzeJobMatch(currentTrackedJob.trackingId)
      setAiAnalysis(data.analysis)
    } catch (error) {
      setAiError(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateInterviewPrep = async () => {
    if (!currentTrackedJob?.trackingId) {
      setAiError('Add this job to your tracker before generating interview prep.')
      return
    }

    try {
      setIsGeneratingPrep(true)
      setAiError('')
      const data = await generateInterviewPrep(currentTrackedJob.trackingId)
      setInterviewPrep(data.analysis)
    } catch (error) {
      setAiError(error.message)
    } finally {
      setIsGeneratingPrep(false)
    }
  }

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        Back to jobs
      </Link>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
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

            <h1 className="mt-4 text-3xl font-black text-slate-950">
              {job.title}
            </h1>
            <p className="mt-2 text-base text-slate-600">
              {job.company} • {job.location}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-left lg:min-w-[220px]">
            <p className="text-sm text-slate-500">Salary</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{job.salary}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">About this role</h2>
          <p className="mt-4 leading-7 text-slate-600">{job.description}</p>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Track this job</h3>

            {!isTracked ? (
              <button
                type="button"
                onClick={handleTrackJob}
                className="mt-4 w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white transition hover:bg-slate-700"
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none"
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
                    className="w-full rounded-lg border border-slate-200 px-3 py-3 outline-none"
                  />
                </div>

                {job.url && (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg bg-sky-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-sky-700"
                  >
                    Apply Now
                  </a>
                )}


                <button
                  type="button"
                  onClick={handleRemoveTrackedJob}
                  className="w-full rounded-lg bg-rose-50 px-4 py-3 font-medium text-rose-700 transition hover:bg-rose-100"
                >
                  Remove from Tracker
                </button>

                
              </div>

              
            )}
          </div>
          
        </aside>
      </section>

      <section className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sky-600">
                AI Career Assistant
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                Analyze and prepare for this role
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Use your saved profile to generate job-fit insights and interview prep.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
              <button
                type="button"
                onClick={handleAnalyzeMatch}
                disabled={isAnalyzing}
                className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-4 text-left transition hover:bg-sky-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <span className="block text-sm font-bold text-sky-800">
                  {isAnalyzing ? 'Analyzing...' : 'Match Analysis'}
                </span>
                <span className="mt-1 block text-xs leading-5 text-sky-700">
                  Score fit, skills, gaps, and advice.
                </span>
              </button>

              <button
                type="button"
                onClick={handleGenerateInterviewPrep}
                disabled={isGeneratingPrep}
                className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-4 text-left transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <span className="block text-sm font-bold text-emerald-800">
                  {isGeneratingPrep ? 'Generating...' : 'Interview Prep'}
                </span>
                <span className="mt-1 block text-xs leading-5 text-emerald-700">
                  Questions, study plan, talking points.
                </span>
              </button>
            </div>
          </div>

          {aiError && (
            <div className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {aiError}
            </div>
          )}
        </div>

        <AIJobMatchCard analysis={aiAnalysis} />
        <AIInterviewPrepCard analysis={interviewPrep} />
      </section>
    </div>
  )
}

export default JobDetails
