import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import SavedJobs from './pages/SavedJobs';
import PostJob from './pages/PostJob';
import MyApplications from './pages/MyApplications';
import EmployerDashboard from './pages/EmployerDashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <LanguageProvider>
        {/* الخلفية السماوية العامة للشاشة بالكامل */}
        <div className="min-h-screen bg-gradient-to-b from-[#0099FF] via-[#38bdf8] to-[#EAF5FF] bg-fixed text-slate-800">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/savedJobs"
              element={<ProtectedRoute role="JobSeeker"><SavedJobs /></ProtectedRoute>}
            />
            <Route
              path="/applications"
              element={<ProtectedRoute role="JobSeeker"><MyApplications /></ProtectedRoute>}
            />
            <Route
              path="/dashboard"
              element={<ProtectedRoute role="Employer"><EmployerDashboard /></ProtectedRoute>}
            />
            <Route
              path="/post-job"
              element={<ProtectedRoute role="Employer"><PostJob /></ProtectedRoute>}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </LanguageProvider>
    </Router>
  );
}

export default App;