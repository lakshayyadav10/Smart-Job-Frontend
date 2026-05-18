import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import AIHistory from './pages/AIHistory'
import Home from './pages/Home'
import JobDetails from './pages/JobDetails'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Pipeline from './pages/Pipeline'
import Profile from './pages/Profile'
import Register from './pages/Register'
import SavedJobs from './pages/MyApplications'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="job/:id" element={<JobDetails />} />
            <Route path="saved" element={<SavedJobs />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="profile" element={<Profile />} />
            <Route path="ai-history" element={<AIHistory />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
