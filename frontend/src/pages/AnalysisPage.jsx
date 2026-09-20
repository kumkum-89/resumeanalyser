import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, TrendingUp, FileText, ArrowRight } from 'lucide-react';
import {
  PageHeader, LoadingState, ErrorBanner, Card, ScoreRing,
  ProgressBar, SkillTag, SectionDivider, EmptyState, Badge
} from '../components/UI';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export default function AnalysisPage() {
  const { selectedResumeId } = useApp();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedResumeId) return;
    setLoading(true);
    setError(null);
    api.analyzeResume(selectedResumeId)
      .then(setAnalysis)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedResumeId]);

  if (!selectedResumeId) {
    return (
      <div className="page-container animate-in">
        <PageHeader title="Resume Analysis" subtitle="AI-powered deep dive into your resume" />
        <Card>
          <EmptyState
            icon={FileText}
            title="No Resume Selected"
            description="Upload a resume first to see your AI-powered analysis results."
            action={<Link to="/upload" className="btn btn-primary">Upload Resume <ArrowRight size={16} /></Link>}
          />
        </Card>
      </div>
    );
  }

  if (loading) return <LoadingState message="AI is analyzing your resume..." />;

  if (error) {
    return (
      <div className="page-container animate-in">
        <PageHeader title="Resume Analysis" />
        <ErrorBanner message={error} />
      </div>
    );
  }

  if (!analysis) return null;

  const a = analysis.analysis;

  const radarData = [
    { subject: 'Experience', A: a.sections.experience.score },
    { subject: 'Education', A: a.sections.education.score },
    { subject: 'Skills', A: a.sections.skills.score },
    { subject: 'Summary', A: a.sections.summary.score },
    { subject: 'ATS', A: a.atsScore },
    { subject: 'Readable', A: a.readabilityScore }
  ];

  const scoreColor = (s) => s >= 80 ? 'green' : s >= 60 ? 'orange' : 'red';

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Resume Analysis"
        subtitle={`Analysis for ${analysis.resumeName}`}
        breadcrumb="Home / Analysis"
      />

      {/* Top Scores */}
      <div className="grid grid-3 mb-6">
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '2rem' }}>
          <ScoreRing score={a.overallScore} label="Overall Score" />
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '2rem' }}>
          <ScoreRing score={a.atsScore} label="ATS Score" />
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '2rem' }}>
          <ScoreRing score={a.readabilityScore} label="Readability" />
        </Card>
      </div>

      <div className="grid grid-2 mb-6">
        {/* Section Scores */}
        <Card>
          <SectionDivider title="Section Scores" />
          {Object.entries(a.sections).map(([key, sec]) => (
            <div key={key} style={{ marginBottom: '1.25rem' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontWeight: 600, fontSize: '0.875rem', textTransform: 'capitalize' }}>{key}</span>
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: sec.score >= 80 ? 'var(--success)' : sec.score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
                  {sec.score}/100
                </span>
              </div>
              <ProgressBar value={sec.score} color={scoreColor(sec.score)} />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>{sec.feedback}</p>
            </div>
          ))}
        </Card>

        {/* Radar */}
        <Card>
          <SectionDivider title="Score Overview" />
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Radar dataKey="A" stroke="#7c5cff" fill="#7c5cff" fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-2 mb-6">
        {/* Strengths */}
        <Card>
          <SectionDivider title="Strengths" />
          {a.strengths.map((s, i) => (
            <div key={i} className="flex items-start gap-2" style={{ marginBottom: '0.75rem' }}>
              <CheckCircle size={16} style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: '0.875rem' }}>{s}</span>
            </div>
          ))}
        </Card>

        {/* Suggestions */}
        <Card>
          <SectionDivider title="Suggestions" />
          {a.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-2" style={{ marginBottom: '0.75rem' }}>
              <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0, marginTop: 2 }} />
              <span style={{ fontSize: '0.875rem' }}>{s}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Keywords */}
      <Card>
        <SectionDivider title="Keyword Analysis" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              ✓ Found Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {a.keywords.map(k => <SkillTag key={k} name={k} matched />)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              ✗ Missing Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {a.missingKeywords.map(k => <SkillTag key={k} name={k} missing />)}
            </div>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <div className="flex gap-3 mt-6">
        <Link to="/job-description" className="btn btn-primary">
          Match to a Job <ArrowRight size={16} />
        </Link>
        <Link to="/skill-gap" className="btn btn-secondary">
          View Skill Gap
        </Link>
      </div>
    </div>
  );
}
