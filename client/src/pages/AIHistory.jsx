import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAIHistory } from '../utils/aiApi'

const filters = ['All', 'JOB_MATCH', 'INTERVIEW_PREP']

function AIHistory() {
  const [analyses, setAnalyses] = useState([])
  const [selectedType, setSelectedType] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true)
        setError('')
        const data = await fetchAIHistory()
        setAnalyses(data.analyses || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [])

  const filteredAnalyses = useMemo(() => {
    if (selectedType === 'All') return analyses
    return analyses.filter((analysis) => analysis.type === selectedType)
  }, [analyses, selectedType])

  const getTitle = (analysis) => {
    if (analysis.type === 'JOB_MATCH') return 'Resume Match Analysis'
    return 'Interview Prep'
  }

  const getSummary = (analysis) => {
    if (analysis.type === 'JOB_MATCH') {
      return analysis.result?.summary || 'No summary available.'
    }

    return analysis.result?.closingAdvice || 'No prep summary available.'
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
            AI Workspace
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">AI History</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review generated match scores and interview prep across your tracked jobs.
          </p>
        </div>

        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none lg:w-[240px]"
        >
          {filters.map((filter) => (
            <option key={filter} value={filter}>
              {filter === 'All'
                ? 'All AI Results'
                : filter === 'JOB_MATCH'
                  ? 'Match Analysis'
                  : 'Interview Prep'}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <p className="text-sm font-medium text-slate-600">Loading AI history...</p>
        </div>
      ) : filteredAnalyses.length > 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredAnalyses.map((analysis) => (
            <article
              key={analysis._id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="inline-flex rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {analysis.type === 'JOB_MATCH'
                      ? 'Match Analysis'
                      : 'Interview Prep'}
                  </span>
                  <h2 className="mt-3 text-lg font-bold text-slate-950">
                    {getTitle(analysis)}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {analysis.trackedJob?.title || 'Tracked job'} at{' '}
                    {analysis.trackedJob?.company || 'Company'}
                  </p>
                </div>

                {analysis.result?.matchScore !== undefined && (
                  <div className="rounded-lg bg-slate-900 px-4 py-3 text-center text-white">
                    <p className="text-2xl font-black">
                      {analysis.result.matchScore}
                    </p>
                    <p className="text-xs text-slate-300">score</p>
                  </div>
                )}
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {getSummary(analysis)}
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-400">
                  {new Date(analysis.createdAt).toLocaleString()}
                </p>

                {analysis.trackedJob && (
                  <Link
                    to={`/job/${analysis.trackedJob.jobId || analysis.trackedJob._id}`}
                    className="rounded-lg bg-slate-100 px-4 py-2 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-200"
                  >
                    Open Job
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800">No AI results yet</h2>
          <p className="mt-2 text-slate-500">
            Generate match analysis or interview prep from a tracked job.
          </p>
        </div>
      )}
    </div>
  )
}

export default AIHistory
