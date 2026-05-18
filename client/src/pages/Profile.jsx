import { useEffect, useState } from 'react'
import { fetchProfile, saveProfile } from '../utils/profileApi'

const initialFormData = {
  resumeText: '',
  targetRole: '',
  skills: '',
  experienceLevel: '',
  preferredLocations: '',
}

function Profile() {
  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        const data = await fetchProfile()
        const profile = data.profile

        if (profile) {
          setFormData({
            resumeText: profile.resumeText || '',
            targetRole: profile.targetRole || '',
            skills: profile.skills?.join(', ') || '',
            experienceLevel: profile.experienceLevel || '',
            preferredLocations: profile.preferredLocations?.join(', ') || '',
          })
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const splitList = (value) => {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setIsSaving(true)
      setError('')
      setSuccess('')

      await saveProfile({
        resumeText: formData.resumeText,
        targetRole: formData.targetRole,
        skills: splitList(formData.skills),
        experienceLevel: formData.experienceLevel,
        preferredLocations: splitList(formData.preferredLocations),
      })

      setSuccess('Profile saved. AI analysis can now use your resume.')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-medium text-slate-600">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">
          AI Profile
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">
          Resume and career preferences
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          This profile powers AI job-match analysis, skill-gap feedback, and
          application advice.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-5 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Target Role
            </label>
            <input
              type="text"
              name="targetRole"
              value={formData.targetRole}
              onChange={handleChange}
              placeholder="Frontend Developer"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
            >
              <option value="">Select level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, JavaScript, Tailwind CSS"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Preferred Locations
            </label>
            <input
              type="text"
              name="preferredLocations"
              value={formData.preferredLocations}
              onChange={handleChange}
              placeholder="Remote, Bangalore, Pune"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Resume Text
          </label>
          <textarea
            name="resumeText"
            rows="12"
            value={formData.resumeText}
            onChange={handleChange}
            placeholder="Paste your resume text here..."
            className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 outline-none focus:border-sky-400"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Profile
