import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Plus, ArrowRight } from 'lucide-react';
import { PageHeader, Card, LoadingState, ErrorBanner, SuccessBanner, EmptyState } from '../components/UI';
import { api } from '../services/api';

const SAMPLE_JD = `We are looking for a Senior Full Stack Engineer to join our growing team.

Requirements:
- 4+ years of experience with React, Node.js, and TypeScript
- Strong knowledge of PostgreSQL and Redis
- Experience with Docker, Kubernetes, and AWS services
- Familiarity with GraphQL and REST APIs
- Experience with CI/CD pipelines and GitHub Actions
- Excellent problem-solving skills and attention to detail

Nice to have:
- Open source contributions
- Experience with microservices architecture
- Knowledge of system design principles`;

export default function JobDescriptionPage() {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Job title and description are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await api.createJob({ title, company, description });
      setSuccess(`Job "${title}" saved! Redirecting to match page...`);
      setTimeout(() => navigate(`/job-match?jobId=${data.job.id}`), 1500);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Job Description"
        subtitle="Paste a job description to compare against your resume"
        breadcrumb="Home / Job Description"
      />

      <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        <Card>
          <h3 style={{ marginBottom: '1.5rem' }}>Add Job Description</h3>

          {error && <div className="mb-4"><ErrorBanner message={error} /></div>}
          {success && <div className="mb-4"><SuccessBanner message={success} /></div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                className="form-input"
                placeholder="e.g. Senior Full Stack Engineer"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                className="form-input"
                placeholder="e.g. Acme Corp"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Job Description *</label>
              <textarea
                className="form-textarea"
                placeholder="Paste the full job description here..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ minHeight: 200 }}
                required
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={loading}
              >
                {loading
                  ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</>
                  : <><Plus size={18} /> Save & Match</>
                }
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDescription(SAMPLE_JD)}
              >
                Use Sample
              </button>
            </div>
          </form>
        </Card>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          <Card>
            <h4 style={{ marginBottom: '1rem' }}>How Job Matching Works</h4>
            {[
              { step: '1', title: 'Paste Job Description', desc: 'Copy the full job posting including requirements and responsibilities.' },
              { step: '2', title: 'AI Extracts Keywords', desc: 'Our system identifies key skills, technologies, and qualifications.' },
              { step: '3', title: 'Match Against Resume', desc: 'Your resume is analyzed against the job requirements in real time.' },
              { step: '4', title: 'Get Your Match Score', desc: 'Receive a match percentage with specific gaps and recommendations.' }
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3" style={{ marginBottom: '1rem' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--accent-glow)', color: 'var(--accent-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.78rem', fontWeight: 800, flexShrink: 0
                }}>
                  {item.step}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.15rem' }}>{item.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <h4 style={{ marginBottom: '0.75rem' }}>Tips for Best Results</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                'Include the full job description, not just bullet points',
                'Add requirements, nice-to-haves, and about sections',
                'Use the exact text from the posting for accurate keyword matching'
              ].map((tip, i) => (
                <li key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '0.5rem' }}>
                  <span style={{ color: 'var(--accent-light)' }}>→</span> {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
