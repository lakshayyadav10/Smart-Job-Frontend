import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { TrackerProvider } from './context/TrackerContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <TrackerProvider>
        <App />
      </TrackerProvider>
    </AuthProvider>
  </React.StrictMode>
)
