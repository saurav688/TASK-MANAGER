import React from 'react';
import './TaskCard.css';

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const STATUS_LABELS = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
const PRIORITY_LABELS = { low: 'Low', medium: 'Medium', high: 'High' };

const formatDate = (d) => {
  if (!d) return null;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'completed') return false;
  return new Date(dueDate) < new Date();
};

const TaskCard = ({ task, onEdit, onDelete, onToggle, delay = 0 }) => {
  const overdue = isOverdue(task.dueDate, task.status);
  const done = task.status === 'completed';

  return (
    <article
      className={`task-card priority-${task.priority}${done ? ' task-completed' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card-header">
        <button
          className={`task-check-btn${done ? ' checked' : ''}`}
          onClick={() => onToggle(task)}
          aria-label={done ? 'Mark as pending' : 'Mark as completed'}
          aria-pressed={done}
          title={done ? 'Mark pending' : 'Mark complete'}
        >
          {done && '✓'}
        </button>

        <div className="task-title-wrap">
          <h3 className="task-title">{task.title}</h3>
        </div>

        <div className="task-actions">
          <button className="task-action-btn edit" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">
            <EditIcon />
          </button>
          <button className="task-action-btn delete" onClick={() => onDelete(task._id)} aria-label="Delete task" title="Delete">
            <TrashIcon />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`badge badge-priority-${task.priority}`}>
          {PRIORITY_LABELS[task.priority]}
        </span>
        <span className={`badge badge-status-${task.status}`}>
          {STATUS_LABELS[task.status]}
        </span>
        {task.dueDate && (
          <span className={`task-due${overdue ? ' overdue' : ''}`}>
            <CalendarIcon />
            {formatDate(task.dueDate)}{overdue ? ' · Overdue' : ''}
          </span>
        )}
      </div>
    </article>
  );
};

export default TaskCard;
