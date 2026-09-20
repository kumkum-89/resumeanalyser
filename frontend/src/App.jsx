import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar, Topbar } from './components/Navigation';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import JobDescriptionPage from './pages/JobDescriptionPage';
import JobMatchPage from './pages/JobMatchPage';
import SkillGapPage from './pages/SkillGapPage';
import RoadmapPage from './pages/RoadmapPage';
import InterviewPage from './pages/InterviewPage';
import HistoryPage from './pages/HistoryPage';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/upload': 'Upload Resume',
  '/analysis': 'Resume Analysis',
  '/job-description': 'Job Description',
  '/job-match': 'Job Match',
  '/skill-gap': 'Skill Gap',
  '/roadmap': 'Career Roadmap',
  '/interview': 'Interview Prep',
  '/history': 'History'
};

function AppLayout({ children }) {
  const path = window.location.pathname;
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Topbar title={PAGE_TITLES[path] || 'ResumeX'} />
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing - no sidebar */}
          <Route path="/" element={<LandingPage />} />

          {/* App pages - with sidebar */}
          <Route path="/dashboard" element={
            <AppLayout><Dashboard /></AppLayout>
          } />
          <Route path="/upload" element={
            <AppLayout><UploadPage /></AppLayout>
          } />
          <Route path="/analysis" element={
            <AppLayout><AnalysisPage /></AppLayout>
          } />
          <Route path="/job-description" element={
            <AppLayout><JobDescriptionPage /></AppLayout>
          } />
          <Route path="/job-match" element={
            <AppLayout><JobMatchPage /></AppLayout>
          } />
          <Route path="/skill-gap" element={
            <AppLayout><SkillGapPage /></AppLayout>
          } />
          <Route path="/roadmap" element={
            <AppLayout><RoadmapPage /></AppLayout>
          } />
          <Route path="/interview" element={
            <AppLayout><InterviewPage /></AppLayout>
          } />
          <Route path="/history" element={
            <AppLayout><HistoryPage /></AppLayout>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
