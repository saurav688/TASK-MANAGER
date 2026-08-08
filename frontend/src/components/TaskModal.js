import React, { useState, useEffect, useRef } from 'react';
import './TaskModal.css';

const EMPTY = { title: '', description: '', priority: 'medium', status: 'pending', dueDate: '' };

const TaskModal = ({ task, onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [saving, setSaving] = useState(false);
  const titleRef = useRef(null);
  const isEdit = Boolean(task);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      });
    }
    setTimeout(() => titleRef.current?.focus(), 60);
  }, [task]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    else if (form.title.trim().length > 100) e.title = 'Max 100 characters';
    return e;
  };

  const onChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    setErrors(p => ({ ...p, [e.target.name]: '' }));
    setApiError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave({
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        dueDate: form.dueDate || null,
      });
      onClose();
    } catch (err) {
      setApiError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <div className="modal-header">
          <div>
            <h2 className="modal-title" id="modal-title">{isEdit ? 'Edit Task' : 'New Task'}</h2>
            <p className="modal-subtitle">{isEdit ? 'Update task details below' : 'Fill in the details for your new task'}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        {apiError && <div className="alert-error" role="alert">{apiError}</div>}

        <form onSubmit={onSubmit} noValidate>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="m-title">Task Title *</label>
              <input ref={titleRef} id="m-title" name="title" type="text"
                value={form.title} onChange={onChange}
                placeholder="e.g. Design landing page" maxLength={100} disabled={saving} />
              {errors.title && <p className="input-error">{errors.title}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="m-desc">Description</label>
              <textarea id="m-desc" name="description" value={form.description}
                onChange={onChange} placeholder="Add more details..." maxLength={500} disabled={saving} />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="m-priority">Priority</label>
                <select id="m-priority" name="priority" value={form.priority} onChange={onChange} disabled={saving}>
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="m-due">Due Date</label>
                <input id="m-due" name="dueDate" type="date" value={form.dueDate} onChange={onChange} disabled={saving} />
              </div>
            </div>

            {isEdit && (
              <div className="form-group">
                <label htmlFor="m-status">Status</label>
                <select id="m-status" name="status" value={form.status} onChange={onChange} disabled={saving}>
                  <option value="pending">⏳ Pending</option>
                  <option value="in-progress">🔄 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving && <span className="btn-spinner" aria-hidden="true" />}
              {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
