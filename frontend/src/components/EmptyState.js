import React from 'react';
import './EmptyState.css';

const EmptyState = ({ icon = '📋', title, subtitle, actionLabel, onAction }) => (
  <div className="empty-state">
    <div className="empty-state-icon" aria-hidden="true">{icon}</div>
    <h3 className="empty-state-title">{title}</h3>
    {subtitle && <p className="empty-state-subtitle">{subtitle}</p>}
    {actionLabel && onAction && (
      <button className="btn btn-primary" onClick={onAction}>{actionLabel}</button>
    )}
  </div>
);

export default EmptyState;
