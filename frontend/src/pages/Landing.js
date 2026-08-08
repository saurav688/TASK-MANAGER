import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const FEATURES = [
  { icon: '✓', color: 'indigo', title: 'Smart Task Management', desc: 'Create, organize, and track your tasks with priority levels, due dates, and status tracking.' },
  { icon: '🔒', color: 'emerald', title: 'Secure Authentication', desc: 'Your data is protected with JWT-based authentication. Only you can see your tasks.' },
  { icon: '👤', color: 'amber', title: 'Personal Workspace', desc: 'A dedicated workspace for you. Your tasks, your rules — completely private.' },
  { icon: '⚡', color: 'red', title: 'Fast & Responsive', desc: 'Built with React for a snappy experience on any device, from desktop to mobile.' },
];

const Landing = () => (
  <div className="landing">
    {/* Navbar */}
    <nav className="ln-nav">
      <div className="ln-logo">
        <div className="ln-logo-icon">✓</div>
        <span className="ln-logo-text">TaskFlow</span>
      </div>
      <div className="ln-nav-links">
        <Link to="/login" className="ln-btn-ghost">Sign In</Link>
        <Link to="/signup" className="ln-btn-primary">Get Started</Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="ln-hero">
      <div className="ln-hero-left">
        <div className="ln-hero-badge">🚀 Your productivity, supercharged</div>
        <h1 className="ln-hero-title">
          Organize your work.<br />
          <span>Get things done.</span>
        </h1>
        <p className="ln-hero-subtitle">
          TaskFlow is a simple, beautiful task manager that helps you stay on top of your work.
          Create tasks, set priorities, track progress — all in one place.
        </p>
        <div className="ln-hero-cta">
          <Link to="/signup" className="ln-cta-primary">Get Started Free →</Link>
          <Link to="/login" className="ln-cta-outline">Sign In</Link>
        </div>
      </div>

      {/* Visual preview */}
      <div className="ln-hero-right">
        <div className="ln-visual">
          <div className="ln-visual-header">
            <span className="ln-visual-title">My Tasks</span>
            <span className="ln-visual-badge">3 tasks today</span>
          </div>
          {[
            { title: 'Design landing page', done: false, priority: 'High', color: '', pillColor: '' },
            { title: 'Review pull request', done: true,  priority: 'Done', color: 'done', pillColor: 'green' },
            { title: 'Update documentation', done: false, priority: 'Medium', color: '', pillColor: 'amber' },
          ].map((t, i) => (
            <div className="ln-fake-task" key={i}>
              <div className={`ln-fake-check${t.done ? ' done' : ''}`}>{t.done ? '✓' : ''}</div>
              <div className="ln-fake-info">
                <div className={`ln-fake-title${t.done ? ' done' : ''}`}>{t.title}</div>
                <div className="ln-fake-meta">
                  <span className={`ln-fake-pill ${t.pillColor}`}>{t.priority}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="ln-features">
      <div className="ln-section-label">Features</div>
      <h2 className="ln-section-title">Everything you need to stay productive</h2>
      <p className="ln-section-sub">A clean, focused tool built for people who want to get things done without the clutter.</p>
      <div className="ln-features-grid">
        {FEATURES.map(f => (
          <div className="ln-feat-card" key={f.title}>
            <div className={`ln-feat-icon ${f.color}`}>{f.icon}</div>
            <div className="ln-feat-title">{f.title}</div>
            <div className="ln-feat-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Stats */}
    <section className="ln-stats">
      <p className="ln-stats-title">Trusted by productive teams worldwide</p>
      <div className="ln-stats-grid">
        {[['10k+','Tasks Created'], ['99.9%','Uptime'], ['256-bit','Encryption']].map(([n, l]) => (
          <div className="ln-stat-item" key={l}>
            <div className="ln-stat-num">{n}</div>
            <div className="ln-stat-lbl">{l}</div>
          </div>
        ))}
      </div>
    </section>

    {/* Footer */}
    <footer className="ln-footer">
      <div className="ln-logo">
        <div className="ln-logo-icon" style={{ width: 28, height: 28, fontSize: '0.85rem' }}>✓</div>
        <span className="ln-logo-text" style={{ fontSize: '0.95rem' }}>TaskFlow</span>
      </div>
      <p className="ln-footer-copy">© 2026 TaskFlow. All rights reserved.</p>
    </footer>
  </div>
);

export default Landing;
