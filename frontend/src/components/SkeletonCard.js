import React from 'react';
import './SkeletonCard.css';

const SkeletonCard = () => (
  <div className="skeleton-card" aria-hidden="true">
    <div className="skeleton-line sk-title" />
    <div className="skeleton-line sk-desc1" />
    <div className="skeleton-line sk-desc2" />
    <div className="sk-meta">
      <div className="skeleton-line sk-badge" />
      <div className="skeleton-line sk-badge2" />
      <div className="skeleton-line sk-date" />
    </div>
  </div>
);

export default SkeletonCard;
