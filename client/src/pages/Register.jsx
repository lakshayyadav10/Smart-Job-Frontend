import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const navigate = useNavigate()
  const { register, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setError('')
      await register(formData)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-2 text-sm text-slate-500">
          Start managing your applications.
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white"
          >
            Create account
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sky-700">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}

export default Register
