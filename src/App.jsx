import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import JobDetails from './pages/JobDetails'
import SavedJobs from './pages/MyApplications'
import NotFound from './pages/NotFound'
import Pipeline from './pages/Pipeline'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="job/:id" element={<JobDetails />} />
          <Route path="saved" element={<SavedJobs />} />
          <Route path="pipeline" element={<Pipeline />} />  
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
