import { Link } from 'react-router-dom';
import {
  Zap, FileText, Target, GitBranch, Map, MessageSquare,
  ArrowRight, Star, CheckCircle, ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'AI Resume Analysis',
    desc: 'Get a comprehensive ATS score, readability score, and detailed feedback on every section of your resume.'
  },
  {
    icon: Target,
    title: 'Job Match Intelligence',
    desc: 'Upload a job description and instantly see how well your resume matches. Know exactly what to fix.'
  },
  {
    icon: GitBranch,
    title: 'Skill Gap Detection',
    desc: 'Visualize the gap between your current skills and what top employers are hiring for right now.'
  },
  {
    icon: Map,
    title: 'Career Roadmap',
    desc: 'Get a personalized month-by-month learning roadmap to close your skill gaps and land your dream role.'
  },
  {
    icon: MessageSquare,
    title: 'Interview Preparation',
    desc: 'Practice with AI-generated interview questions tailored to your target role with expert tips.'
  },
  {
    icon: Zap,
    title: 'Instant Optimization',
    desc: 'Get actionable suggestions to improve your resume score and beat ATS filters in minutes.'
  }
];

const stats = [
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '89%', label: 'Interview Rate' },
  { value: '4.9★', label: 'User Rating' },
  { value: '200+', label: 'Companies Hired' }
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Nav */}
      <nav className="landing-nav">
        <div className="flex items-center gap-3">
          <div className="sidebar-logo-icon" style={{ width: 36, height: 36, fontSize: '1rem' }}>✦</div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            ResumeX
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="btn btn-ghost">Dashboard</Link>
          <Link to="/upload" className="btn btn-primary">Get Started <ArrowRight size={16} /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-badge">
          <Zap size={14} />
          Powered by Advanced AI Intelligence
        </div>
        <h1 className="hero-title">
          Land Your Dream Job with{' '}
          <span className="hero-gradient-text">AI-Powered</span>{' '}
          Resume Intelligence
        </h1>
        <p className="hero-subtitle">
          ResumeX analyzes your resume, matches it to job descriptions, identifies skill gaps,
          and creates a personalized career roadmap — all in seconds.
        </p>
        <div className="hero-actions">
          <Link to="/upload" className="btn btn-primary btn-lg">
            Analyze My Resume <ArrowRight size={18} />
          </Link>
          <Link to="/dashboard" className="btn btn-secondary btn-lg">
            View Dashboard
          </Link>
        </div>
      </section>

      {/* Stats Bar */}
      <div style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
          {stats.map(s => (
            <div key={s.value}>
              <div style={{ fontSize: '2rem', fontWeight: 900, background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.value}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="feature-section">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge badge-purple mb-4" style={{ marginBottom: '1rem' }}>Features</div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Everything You Need to{' '}
            <span className="hero-gradient-text">Stand Out</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 600, margin: '0 auto' }}>
            A complete career intelligence platform that turns your resume into a job-winning machine.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <Icon size={24} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <h2 style={{ marginBottom: '1rem' }}>Ready to Accelerate Your Career?</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          Join thousands of professionals who've landed their dream jobs with ResumeX.
        </p>
        <Link to="/upload" className="btn btn-primary btn-lg">
          Start for Free <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--border)' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          © 2026 ResumeX — AI Resume Intelligence Platform
        </p>
      </footer>
    </div>
  );
}
