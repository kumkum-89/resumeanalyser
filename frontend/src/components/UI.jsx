// Reusable UI primitives

export function Card({ children, className = '', style }) {
  return <div className={`card ${className}`} style={style}>{children}</div>;
}

export function StatCard({ icon: Icon, label, value, change, color = 'purple' }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}>
        <Icon size={22} />
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {change && (
        <div className={`stat-change ${change.startsWith('+') ? 'up' : 'down'}`}>
          {change}
        </div>
      )}
    </div>
  );
}

export function ProgressBar({ value, max = 100, color = 'purple' }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  const cls = pct >= 75 ? 'green' : pct >= 50 ? 'orange' : 'red';
  return (
    <div className="progress-bar">
      <div
        className={`progress-fill ${color === 'auto' ? cls : color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function ScoreRing({ score, label, size = 120 }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(score, 100) / 100;
  const dash = pct * circ;
  const color = score >= 75 ? '#22d3a0' : score >= 50 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="score-ring-container">
      <div className="score-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--bg-input)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={r} fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ}`}
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div className="score-ring-value">
          <span className="score-ring-number">{score}</span>
          <span className="score-ring-label">/ 100</span>
        </div>
      </div>
      {label && <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>}
    </div>
  );
}

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="loading-state">
      <div className="spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{message}</p>
    </div>
  );
}

export function ErrorBanner({ message }) {
  return (
    <div className="error-banner">
      <span>⚠</span>
      <span>{message}</span>
    </div>
  );
}

export function SuccessBanner({ message }) {
  return (
    <div className="success-banner">
      <span>✓</span>
      <span>{message}</span>
    </div>
  );
}

export function Badge({ children, variant = 'purple' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {Icon && <Icon size={36} />}
      </div>
      <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: 400 }}>{description}</p>
      {action}
    </div>
  );
}

export function PageHeader({ breadcrumb, title, subtitle, action }) {
  return (
    <div className="page-header">
      {breadcrumb && <div className="page-header-breadcrumb">{breadcrumb}</div>}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

export function SkillTag({ name, matched, missing }) {
  const cls = matched ? 'matched' : missing ? 'missing' : '';
  return <span className={`skill-tag ${cls}`}>{name}</span>;
}

export function SectionDivider({ title }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h3 style={{ fontSize: '1rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{title}</h3>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}
