import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, ArrowRight, CheckCircle, Clock, BookOpen, ExternalLink } from 'lucide-react';
import {
  PageHeader, LoadingState, ErrorBanner, Card, Badge,
  SectionDivider, EmptyState
} from '../components/UI';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

const statusColors = {
  current: 'purple',
  upcoming: 'blue',
  completed: 'green'
};

const statusIcons = {
  current: '🔥',
  upcoming: '🔜',
  completed: '✅'
};

export default function RoadmapPage() {
  const { selectedResumeId } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedResumeId) return;
    setLoading(true);
    api.getRoadmap(selectedResumeId)
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedResumeId]);

  if (!selectedResumeId) {
    return (
      <div className="page-container animate-in">
        <PageHeader title="Career Roadmap" subtitle="Your personalized path to career success" />
        <Card>
          <EmptyState
            icon={Map}
            title="No Resume Selected"
            description="Upload your resume to generate a personalized career roadmap."
            action={<Link to="/upload" className="btn btn-primary">Upload Resume <ArrowRight size={16} /></Link>}
          />
        </Card>
      </div>
    );
  }

  if (loading) return <LoadingState message="Building your career roadmap..." />;
  if (error) return <div className="page-container"><ErrorBanner message={error} /></div>;
  if (!data) return null;

  const completedCount = data.milestones.filter(m => m.status === 'completed').length;
  const progress = Math.round((completedCount / data.milestones.length) * 100);

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Career Roadmap"
        subtitle={`Your path to becoming a ${data.targetRole}`}
        breadcrumb="Home / Career Roadmap"
        action={<Badge variant="purple">⏱ {data.timelineMonths} month plan</Badge>}
      />

      {/* Overview */}
      <div className="grid grid-3 mb-6">
        <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{data.targetRole}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Role</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📅</div>
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{data.timelineMonths} Months</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Timeline</div>
        </Card>
        <Card style={{ textAlign: 'center', padding: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
          <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{progress}% Complete</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Progress</div>
        </Card>
      </div>

      <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Timeline */}
        <Card>
          <SectionDivider title="Learning Milestones" />
          <div className="timeline">
            {data.milestones.map((milestone, i) => (
              <div key={i} className={`timeline-item ${milestone.status}`}>
                <div className="timeline-dot" />
                <div style={{ paddingBottom: i < data.milestones.length - 1 ? '2rem' : 0 }}>
                  <div className="flex items-center gap-2 mb-2" style={{ flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '1rem' }}>{statusIcons[milestone.status]}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Month {milestone.month}: {milestone.title}</span>
                    <Badge variant={statusColors[milestone.status]}>{milestone.status}</Badge>
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '0.5rem' }}>
                    {milestone.tasks.map((task, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span style={{ color: milestone.status === 'completed' ? 'var(--success)' : 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
                          {milestone.status === 'completed' ? '✓' : '○'}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Resources */}
        <div className="flex flex-col gap-4">
          <Card>
            <SectionDivider title="Recommended Resources" />
            {data.resources.map((res, i) => (
              <div key={i} className="card" style={{ background: 'var(--bg-input)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="stat-icon blue" style={{ width: 36, height: 36 }}>
                  <BookOpen size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{res.title}</div>
                  <Badge variant="blue">{res.type}</Badge>
                </div>
                <ExternalLink size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            ))}
          </Card>

          <Card>
            <SectionDivider title="Quick Tips" />
            {[
              '🎯 Focus on one skill at a time for maximum retention',
              '📝 Build projects while learning to reinforce concepts',
              '🤝 Connect with professionals in your target role on LinkedIn',
              '📈 Track your progress weekly and adjust the plan as needed'
            ].map((tip, i) => (
              <p key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{tip}</p>
            ))}
          </Card>

          <div className="flex gap-3">
            <Link to="/interview" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
              Interview Prep <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
