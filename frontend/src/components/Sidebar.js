import React from 'react';
import './Sidebar.css';

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconList = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
    <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: <IconDashboard /> },
  { key: 'tasks',     label: 'My Tasks',  icon: <IconList /> },
  { key: 'completed', label: 'Completed', icon: <IconCheck /> },
  { key: 'pending',   label: 'Pending',   icon: <IconClock /> },
];

const Sidebar = ({ activeView, onViewChange, user, onLogout, mobileOpen, onMobileClose, taskCounts }) => {
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleNav = (key) => {
    onViewChange(key);
    onMobileClose && onMobileClose();
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-backdrop" onClick={onMobileClose} aria-hidden="true" />}
      <aside className={`sidebar${mobileOpen ? ' mobile-open' : ''}`} aria-label="Main navigation">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">✓</div>
          <span className="sidebar-logo-text">Task<span>Flow</span></span>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`sidebar-item${activeView === item.key ? ' active' : ''}`}
              onClick={() => handleNav(item.key)}
              aria-current={activeView === item.key ? 'page' : undefined}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span>{item.label}</span>
              {taskCounts && taskCounts[item.key] != null && (
                <span className="sidebar-item-badge">{taskCounts[item.key]}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar" aria-hidden="true">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'User'}</div>
              <div className="sidebar-user-role">Free plan</div>
            </div>
            <button className="sidebar-logout" onClick={onLogout} aria-label="Log out" title="Log out">
              <IconLogout />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
