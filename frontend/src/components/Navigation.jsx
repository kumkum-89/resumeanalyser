import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Upload, FileText, Briefcase, Target,
  GitBranch, Map, MessageSquare, History, Sun, Moon, X, Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload Resume', to: '/upload', icon: Upload },
  { section: 'Analysis' },
  { label: 'Resume Analysis', to: '/analysis', icon: FileText },
  { label: 'Job Description', to: '/job-description', icon: Briefcase },
  { label: 'Job Match', to: '/job-match', icon: Target },
  { section: 'Career' },
  { label: 'Skill Gap', to: '/skill-gap', icon: GitBranch },
  { label: 'Career Roadmap', to: '/roadmap', icon: Map },
  { label: 'Interview Prep', to: '/interview', icon: MessageSquare },
  { section: 'Account' },
  { label: 'History', to: '/history', icon: History }
];

export function Sidebar() {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useApp();
  const isLight = theme === 'light';

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 99, display: 'none'
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">✦</div>
          <div>
            <h2>ResumeX</h2>
            <span>AI Resume Intelligence</span>
          </div>
          <button
            className="btn btn-ghost btn-icon"
            style={{ marginLeft: 'auto', display: 'none' }}
            onClick={() => setSidebarOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((item, i) => {
            if (item.section) {
              return <div key={i} className="nav-section-label">{item.section}</div>;
            }
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} className="nav-icon" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            <span className="theme-toggle-label">
              {isLight ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </span>
            <div className={`toggle-switch ${isLight ? 'on' : ''}`}>
              <div className="toggle-knob" />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

export function Topbar({ title }) {
  const { setSidebarOpen } = useApp();

  return (
    <div className="topbar">
      <div className="flex items-center gap-4">
        <button
          className="btn btn-ghost btn-icon mobile-menu-btn"
          onClick={() => setSidebarOpen(s => !s)}
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>
        <span className="topbar-title">{title}</span>
      </div>
      <div className="topbar-actions">
        <div className="badge badge-green">● Live</div>
      </div>
    </div>
  );
}
