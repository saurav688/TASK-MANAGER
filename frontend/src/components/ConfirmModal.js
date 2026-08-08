import React, { useEffect } from 'react';
import './TaskModal.css';

const ConfirmModal = ({ onClose, onConfirm, loading, title = 'Delete this task?', subtitle = 'This action cannot be undone.' }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card" style={{ maxWidth: 400, textAlign: 'center' }}>
        <div style={{ padding: '32px 24px 8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'var(--danger-light)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem'
          }} aria-hidden="true">🗑️</div>
          <h2 id="confirm-title" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)' }}>{title}</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{subtitle}</p>
        </div>
        <div className="modal-footer" style={{ justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading && <span className="btn-spinner" aria-hidden="true" />}
            {loading ? 'Deleting…' : 'Delete Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
