import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Target, Zap, TrendingUp, ArrowRight, Upload } from 'lucide-react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { PageHeader, StatCard, LoadingState, ErrorBanner, Card } from '../components/UI';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

const mockRadarData = [
  { subject: 'Experience', A: 82, fullMark: 100 },
  { subject: 'Skills', A: 70, fullMark: 100 },
  { subject: 'Education', A: 88, fullMark: 100 },
  { subject: 'ATS Score', A: 75, fullMark: 100 },
  { subject: 'Keywords', A: 65, fullMark: 100 },
  { subject: 'Readability', A: 80, fullMark: 100 }
];

const mockBarData = [
  { name: 'Jan', score: 62 },
  { name: 'Feb', score: 68 },
  { name: 'Mar', score: 71 },
  { name: 'Apr', score: 74 },
  { name: 'May', score: 78 },
  { name: 'Jun', score: 82 }
];

const quickActions = [
  { to: '/upload', icon: Upload, label: 'Upload Resume', desc: 'Add a new resume', color: 'purple' },
  { to: '/analysis', icon: FileText, label: 'View Analysis', desc: 'See detailed breakdown', color: 'green' },
  { to: '/job-match', icon: Target, label: 'Match to Job', desc: 'Check job fit score', color: 'orange' },
  { to: '/interview', icon: Zap, label: 'Interview Prep', desc: 'Practice questions', color: 'pink' }
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedResumeId } = useApp();

  useEffect(() => {
    api.stats()
      .then(setStats)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState message="Loading dashboard..." />;

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Dashboard"
        subtitle="Your AI-powered career intelligence overview"
        breadcrumb="Home / Dashboard"
      />

      {error && <ErrorBanner message={error} />}

      {/* Stats */}
      <div className="grid grid-4 mb-6">
        <StatCard icon={FileText} label="Total Resumes" value={stats?.totalResumes ?? 0} color="purple" change="+2 this week" />
        <StatCard icon={Zap} label="Analyses Done" value={stats?.analysesCompleted ?? 0} color="green" change="+1 today" />
        <StatCard icon={TrendingUp} label="Average Score" value={stats?.avgScore ? `${stats.avgScore}%` : 'N/A'} color="orange" />
        <StatCard icon={Target} label="Jobs Matched" value={stats?.jobsMatched ?? 0} color="pink" change="+3 this week" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-2 mb-6">
        <Card>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Resume Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={mockRadarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Radar name="Score" dataKey="A" stroke="#7c5cff" fill="#7c5cff" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>Score Trend (6 months)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockBarData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis domain={[50, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Bar dataKey="score" fill="#7c5cff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Quick Actions</h3>
        <div className="grid grid-4">
          {quickActions.map(a => {
            const Icon = a.icon;
            return (
              <Link key={a.to} to={a.to} style={{ textDecoration: 'none' }}>
                <div className="card card-gradient" style={{ cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className={`stat-icon ${a.color}`}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{a.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.desc}</div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Status Banner */}
      {!selectedResumeId && (
        <div className="card" style={{ background: 'var(--accent-glow)', borderColor: 'rgba(124,92,255,0.3)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h4 style={{ color: 'var(--accent-light)', marginBottom: '0.25rem' }}>Get Started!</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                Upload your resume to unlock AI-powered analysis and career insights.
              </p>
            </div>
            <Link to="/upload" className="btn btn-primary">
              Upload Resume <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
