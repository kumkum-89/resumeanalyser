import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Target, ArrowRight, CheckCircle, XCircle, FileText, Briefcase } from 'lucide-react';
import {
  PageHeader, LoadingState, ErrorBanner, Card, ScoreRing,
  ProgressBar, SkillTag, SectionDivider, EmptyState
} from '../components/UI';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function JobMatchPage() {
  const { selectedResumeId } = useApp();
  const [searchParams] = useSearchParams();
  const jobIdFromUrl = searchParams.get('jobId');

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(jobIdFromUrl || '');
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobsLoading, setJobsLoading] = useState(true);

  useEffect(() => {
    api.getJobs()
      .then(setJobs)
      .catch(() => {})
      .finally(() => setJobsLoading(false));
  }, []);

  useEffect(() => {
    if (jobIdFromUrl) setSelectedJobId(jobIdFromUrl);
  }, [jobIdFromUrl]);

  const handleMatch = async () => {
    if (!selectedResumeId || !selectedJobId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.matchResume(selectedResumeId, selectedJobId);
      setMatchData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedResumeId) {
    return (
      <div className="page-container animate-in">
        <PageHeader title="Job Match" subtitle="Compare your resume against job descriptions" />
        <Card>
          <EmptyState
            icon={FileText}
            title="No Resume Selected"
            description="Upload a resume first to match it against job descriptions."
            action={<Link to="/upload" className="btn btn-primary">Upload Resume <ArrowRight size={16} /></Link>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Job Match"
        subtitle="See how well your resume matches a job description"
        breadcrumb="Home / Job Match"
      />

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

      {/* Job Selector */}
      <Card className="mb-6">
        <div className="flex items-center gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Select Job Description</label>
            {jobsLoading ? (
              <div className="skeleton" style={{ height: 40 }} />
            ) : jobs.length === 0 ? (
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                No jobs saved. <Link to="/job-description">Add a job description first</Link>
              </div>
            ) : (
              <select
                className="form-select"
                value={selectedJobId}
                onChange={e => { setSelectedJobId(e.target.value); setMatchData(null); }}
              >
                <option value="">Choose a job...</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} — {j.company}</option>
                ))}
              </select>
            )}
          </div>
          <div style={{ paddingTop: '1.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleMatch}
              disabled={!selectedJobId || loading}
            >
              {loading
                ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Matching...</>
                : <><Target size={18} /> Run Match</>
              }
            </button>
          </div>
          <div style={{ paddingTop: '1.5rem' }}>
            <Link to="/job-description" className="btn btn-secondary">
              <Briefcase size={16} /> Add Job
            </Link>
          </div>
        </div>
      </Card>

      {loading && <LoadingState message="Analyzing job match..." />}

      {matchData && !loading && (() => {
        const m = matchData.match;
        const barData = [
          { name: 'Overall Match', value: m.matchScore },
          { name: 'Experience', value: m.experienceMatch },
          { name: 'Education', value: m.educationMatch },
          { name: 'Keywords', value: m.keywordDensity }
        ];

        return (
          <div className="animate-in">
            <div className="grid grid-3 mb-6">
              <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                <ScoreRing score={m.matchScore} label="Match Score" />
              </Card>
              <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                <ScoreRing score={m.experienceMatch} label="Experience Match" />
              </Card>
              <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
                <ScoreRing score={m.educationMatch} label="Education Match" />
              </Card>
            </div>

            <div className="grid grid-2 mb-6">
              <Card>
                <SectionDivider title="Match Breakdown" />
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={barData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <YAxis dataKey="name" type="category" width={110} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                    />
                    <Bar dataKey="value" fill="#7c5cff" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <SectionDivider title="Skills Analysis" />
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    ✓ Matched Skills ({m.matchedSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {m.matchedSkills.map(s => <SkillTag key={s} name={s} matched />)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                    ✗ Missing Skills ({m.missingSkills.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {m.missingSkills.map(s => <SkillTag key={s} name={s} missing />)}
                  </div>
                </div>
              </Card>
            </div>

            <Card>
              <SectionDivider title="Recommendations" />
              <div className="grid grid-2">
                {m.recommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span style={{ color: 'var(--accent-light)', fontWeight: 700, fontSize: '1rem' }}>→</span>
                    <span style={{ fontSize: '0.875rem' }}>{r}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Link to="/skill-gap" className="btn btn-primary">View Skill Gap <ArrowRight size={16} /></Link>
                <Link to="/roadmap" className="btn btn-secondary">Career Roadmap</Link>
              </div>
            </Card>
          </div>
        );
      })()}
    </div>
  );
}
