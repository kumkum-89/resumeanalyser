import { useState, useEffect } from 'react';
import { History, Trash2, FileText, Target, Clock, Filter } from 'lucide-react';
import {
  PageHeader, LoadingState, ErrorBanner, Card, Badge, EmptyState
} from '../components/UI';
import { api } from '../services/api';

const typeConfig = {
  analysis: { icon: FileText, label: 'Analysis', variant: 'purple' },
  match: { icon: Target, label: 'Job Match', variant: 'green' },
  upload: { icon: Clock, label: 'Upload', variant: 'blue' }
};

function formatRelativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api.getHistory()
      .then(setHistory)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await api.deleteHistory(id);
      setHistory(h => h.filter(item => item.id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Clear all history? This cannot be undone.')) return;
    try {
      await Promise.all(history.map(h => api.deleteHistory(h.id)));
      setHistory([]);
    } catch (e) {
      setError(e.message);
    }
  };

  const filtered = filter === 'all' ? history : history.filter(h => h.type === filter);

  if (loading) return <LoadingState message="Loading history..." />;

  return (
    <div className="page-container animate-in">
      <PageHeader
        title="Activity History"
        subtitle="Track all your resume analyses and job matches"
        breadcrumb="Home / History"
        action={
          history.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={handleClearAll}>
              <Trash2 size={14} /> Clear All
            </button>
          )
        }
      />

      {error && <div className="mb-4"><ErrorBanner message={error} /></div>}

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6" style={{ flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All', count: history.length },
          { key: 'analysis', label: 'Analyses', count: history.filter(h => h.type === 'analysis').length },
          { key: 'match', label: 'Job Matches', count: history.filter(h => h.type === 'match').length }
        ].map(tab => (
          <button
            key={tab.key}
            className={`btn ${filter === tab.key ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label} <Badge variant={filter === tab.key ? 'green' : 'blue'}>{tab.count}</Badge>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={History}
            title="No History Yet"
            description="Your activity will appear here after you analyze resumes or run job matches."
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(item => {
            const cfg = typeConfig[item.type] || typeConfig.upload;
            const Icon = cfg.icon;
            return (
              <Card key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className={`stat-icon ${item.type === 'analysis' ? 'purple' : item.type === 'match' ? 'green' : 'blue'}`}
                  style={{ width: 44, height: 44, flexShrink: 0 }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.label}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {formatRelativeTime(item.timestamp)}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-ghost btn-icon"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  title="Delete"
                >
                  {deleting === item.id
                    ? <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                    : <Trash2 size={16} style={{ color: 'var(--text-muted)' }} />
                  }
                </button>
              </Card>
            );
          })}
        </div>
      )}

      {/* Stats Footer */}
      {history.length > 0 && (
        <div className="grid grid-3 mt-6">
          {[
            { label: 'Total Activities', value: history.length, color: 'purple' },
            { label: 'Analyses', value: history.filter(h => h.type === 'analysis').length, color: 'green' },
            { label: 'Job Matches', value: history.filter(h => h.type === 'match').length, color: 'orange' }
          ].map(stat => (
            <div key={stat.label} className={`stat-card ${stat.color}`}>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
