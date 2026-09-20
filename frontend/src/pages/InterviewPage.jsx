import { useState, useEffect } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, Lightbulb, Search } from 'lucide-react';
import {
  PageHeader, LoadingState, ErrorBanner, Card, Badge, SectionDivider
} from '../components/UI';
import { api } from '../services/api';

const ROLES = [
  'Software Engineer', 'Senior Full Stack Engineer', 'Frontend Developer',
  'Backend Engineer', 'Data Scientist', 'Machine Learning Engineer',
  'DevOps Engineer', 'Product Manager', 'UX Designer'
];

function QuestionCard({ q, tip, difficulty }) {
  const [showTip, setShowTip] = useState(false);
  const [practiced, setPracticed] = useState(false);

  const diffCls = difficulty.toLowerCase() === 'easy' ? 'easy' : difficulty.toLowerCase() === 'hard' ? 'hard' : 'medium';

  return (
    <div className={`question-card ${practiced ? 'card-gradient' : ''}`} style={{ opacity: practiced ? 0.7 : 1 }}>
      <div className="flex justify-between items-start mb-3" style={{ gap: '1rem' }}>
        <p style={{ fontWeight: 600, fontSize: '0.9rem', flex: 1 }}>{q}</p>
        <span className={`question-difficulty diff-${diffCls}`}>{difficulty}</span>
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-ghost btn-sm flex items-center gap-1"
          onClick={() => setShowTip(s => !s)}
        >
          <Lightbulb size={14} />
          {showTip ? 'Hide Tip' : 'Show Tip'}
          {showTip ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button
          className={`btn btn-sm ${practiced ? 'btn-secondary' : 'btn-ghost'}`}
          onClick={() => setPracticed(s => !s)}
        >
          {practiced ? '✓ Practiced' : 'Mark Practiced'}
        </button>
      </div>

      {showTip && (
        <div className="tip-box">
          <Lightbulb size={14} style={{ flexShrink: 0, marginTop: 2 }} />
          <span>{tip}</span>
        </div>
      )}
    </div>
  );
}

export default function InterviewPage() {
  const [role, setRole] = useState('Software Engineer');
  const [customRole, setCustomRole] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

  const loadQuestions = async (r) => {
    setLoading(true);
    setError(null);
    try {
      const d = await api.getInterviewQuestions(r);
      setData(d);
      setActiveCategory(d.categories[0]?.name || null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadQuestions(role); }, [role]);

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customRole.trim()) {
      setRole(customRole.trim());
      setCustomRole('');
    }
  };

  const activeQuestions = data?.categories.find(c => c.name === activeCategory)?.questions || [];
  const totalQuestions = data?.categories.reduce((acc, c) => acc + c.questions.length, 0) || 0;

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Interview Preparation"
        subtitle="Practice role-specific interview questions with expert tips"
        breadcrumb="Home / Interview Prep"
        action={<Badge variant="purple">{totalQuestions} Questions</Badge>}
      />

      {/* Role Selector */}
      <Card className="mb-6">
        <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Select Your Target Role</h3>
        <div className="flex gap-2 flex-wrap mb-4">
          {ROLES.map(r => (
            <button
              key={r}
              className={`btn btn-sm ${role === r ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setRole(r)}
            >
              {r}
            </button>
          ))}
        </div>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            className="form-input"
            placeholder="Or type a custom role..."
            value={customRole}
            onChange={e => setCustomRole(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <button type="submit" className="btn btn-secondary">
            <Search size={16} /> Load
          </button>
        </form>
      </Card>

      {loading && <LoadingState message="Loading interview questions..." />}
      {error && <ErrorBanner message={error} />}

      {data && !loading && (
        <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
          {/* Category Tabs */}
          <div className="flex flex-col gap-4">
            {/* Category Selector */}
            <Card>
              <SectionDivider title="Categories" />
              <div className="flex flex-col gap-2">
                {data.categories.map(cat => (
                  <button
                    key={cat.name}
                    className={`btn ${activeCategory === cat.name ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'space-between' }}
                    onClick={() => setActiveCategory(cat.name)}
                  >
                    <span>{cat.name}</span>
                    <Badge variant={activeCategory === cat.name ? 'green' : 'blue'}>
                      {cat.questions.length}
                    </Badge>
                  </button>
                ))}
              </div>
            </Card>

            {/* Stats */}
            <Card>
              <SectionDivider title="Progress" />
              <div className="grid grid-3" style={{ gap: '1rem', textAlign: 'center' }}>
                {data.categories.map(cat => {
                  const practiced = cat.questions.filter(q => false).length; // mock
                  return (
                    <div key={cat.name}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-light)' }}>
                        {cat.questions.length}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cat.name}</div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Questions Panel */}
          <div>
            <SectionDivider title={`${activeCategory} Questions`} />
            <div className="flex flex-col gap-3">
              {activeQuestions.map((q, i) => (
                <QuestionCard key={i} q={q.q} tip={q.tip} difficulty={q.difficulty} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
