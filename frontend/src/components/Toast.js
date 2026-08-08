import React from 'react';
import './Toast.css';

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
};

const Toast = ({ toasts, removeToast }) => (
  <div className="toast-container" role="region" aria-live="polite">
    {toasts.map(toast => (
      <div key={toast.id} className={`toast toast-${toast.type}`} role="alert">
        <span className="toast-icon" aria-hidden="true">{ICONS[toast.type]}</span>
        <span className="toast-message">{toast.message}</span>
        <button
          className="toast-close"
          onClick={() => removeToast(toast.id)}
          aria-label="Dismiss notification"
        >×</button>
      </div>
    ))}
  </div>
);

export default Toast;
