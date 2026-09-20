import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import {
  PageHeader, LoadingState, ErrorBanner, Card, ProgressBar,
  SectionDivider, EmptyState, Badge
} from '../components/UI';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';

export default function SkillGapPage() {
  const { selectedResumeId } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedResumeId) return;
    setLoading(true);
    api.getSkillGap(selectedResumeId)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedResumeId]);

  if (!selectedResumeId) {
    return (
      <div className="page-container animate-in">
        <PageHeader title="Skill Gap Analysis" subtitle="Discover the gap between your skills and market demand" />
        <Card>
          <EmptyState
            icon={GitBranch}
            title="No Resume Selected"
            description="Upload your resume to see a skill gap analysis."
            action={<Link to="/upload" className="btn btn-primary">Upload Resume <ArrowRight size={16} /></Link>}
          />
        </Card>
      </div>
    );
  }

  if (loading) return <LoadingState message="Analyzing skill gaps..." />;
  if (error) return <div className="page-container"><ErrorBanner message={error} /></div>;
  if (!data) return null;

  const radarData = [
    ...data.currentSkills.map(s => ({ subject: s.name, current: s.proficiency, required: 70 }))
  ];

  const barData = data.requiredSkills.map(s => ({
    name: s.name,
    current: s.proficiency,
    required: s.required,
    gap: Math.max(0, s.required - s.proficiency)
  }));

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Skill Gap Analysis"
        subtitle="Your current skills vs what the market demands"
        breadcrumb="Home / Skill Gap"
        action={
          <div className="flex gap-2 items-center">
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Est. time to close:</span>
            <Badge variant="orange">{data.estimatedLearningTime}</Badge>
          </div>
        }
      />

      <div className="grid grid-2 mb-6">
        {/* Current Skills */}
        <Card>
          <SectionDivider title="Your Current Skills" />
          {data.currentSkills.map(skill => (
            <div key={skill.name} style={{ marginBottom: '1.25rem' }}>
              <div className="flex justify-between items-center mb-1">
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{skill.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="blue">{skill.category}</Badge>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--success)' }}>{skill.proficiency}%</span>
                </div>
              </div>
              <ProgressBar value={skill.proficiency} color="green" />
            </div>
          ))}
        </Card>

        {/* Required Skills */}
        <Card>
          <SectionDivider title="Market Required Skills" />
          {data.requiredSkills.map(skill => {
            const gap = skill.required - skill.proficiency;
            return (
              <div key={skill.name} style={{ marginBottom: '1.25rem' }}>
                <div className="flex justify-between items-center mb-1">
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{skill.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={gap > 40 ? 'red' : gap > 20 ? 'orange' : 'green'}>
                      {gap > 0 ? `Gap: ${gap}%` : 'Met'}
                    </Badge>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <ProgressBar value={skill.proficiency} color={gap > 40 ? 'red' : gap > 20 ? 'orange' : 'green'} />
                  <div style={{
                    position: 'absolute', top: 0, left: `${skill.required}%`,
                    width: 2, height: '100%', background: 'var(--text-muted)',
                    transform: 'translateX(-50%)'
                  }} title={`Required: ${skill.required}%`} />
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                  Current: {skill.proficiency}% / Required: {skill.required}%
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* Gap Chart */}
      <Card className="mb-6">
        <SectionDivider title="Skills Comparison Chart" />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
              labelStyle={{ color: 'var(--text-primary)' }}
            />
            <Legend wrapperStyle={{ color: 'var(--text-secondary)', fontSize: 12 }} />
            <Bar dataKey="current" fill="#22d3a0" radius={[4, 4, 0, 0]} name="Current Level" />
            <Bar dataKey="required" fill="#7c5cff" radius={[4, 4, 0, 0]} name="Required Level" opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Priority Skills */}
      <Card>
        <SectionDivider title="Priority Skills to Learn" />
        <div className="grid grid-3">
          {data.prioritySkills.map((skill, i) => (
            <div key={skill} className="card card-gradient" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--accent-glow)', color: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.875rem', flexShrink: 0
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{skill}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High priority</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Link to="/roadmap" className="btn btn-primary">Create Learning Roadmap <ArrowRight size={16} /></Link>
          <Link to="/interview" className="btn btn-secondary">Practice Interview</Link>
        </div>
      </Card>
    </div>
  );
}
