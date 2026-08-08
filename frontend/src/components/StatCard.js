import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon, color = 'indigo', subtitle, delay = 0 }) => (
  <div className="stat-card" style={{ animationDelay: `${delay}ms` }}>
    <div className={`stat-icon-wrap stat-icon-${color}`} aria-hidden="true">{icon}</div>
    <div className="stat-body">
      <div className="stat-value">{value}</div>
      <div className="stat-title">{title}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  </div>
);

export default StatCard;
