import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import './Login.css';

const EyeIcon = ({ open }) => open ? (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Signup = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const pwLong = form.password.length >= 6;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (!pwLong) e.password = 'At least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
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
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { name: form.name, email: form.email, password: form.password });
      login(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left" aria-hidden="true">
        <div className="auth-left-logo">
          <div className="auth-left-logo-icon">✓</div>
          <span className="auth-left-logo-text">TaskFlow</span>
        </div>
        <h2 className="auth-left-heading">Start for free 🎉<br />No credit card needed.</h2>
        <p className="auth-left-sub">Create your account and start organizing your work today. It only takes 30 seconds.</p>
        <div className="auth-left-features">
          {['Free forever plan available', 'No setup required', 'Instant access after signup'].map(f => (
            <div className="auth-left-feat" key={f}>
              <div className="auth-left-feat-dot">✓</div>
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-heading">Create account</h1>
          <p className="auth-subheading">Start organizing your work today.</p>

          {apiError && <div className="auth-api-error" role="alert">{apiError}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="su-name">Full name</label>
              <div className="auth-input-wrap">
                <input id="su-name" name="name" type="text" autoComplete="name"
                  value={form.name} onChange={onChange} placeholder="Jane Doe"
                  className={errors.name ? 'has-error' : ''} disabled={loading} />
              </div>
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="su-email">Email address</label>
              <div className="auth-input-wrap">
                <input id="su-email" name="email" type="email" autoComplete="email"
                  value={form.email} onChange={onChange} placeholder="you@example.com"
                  className={errors.email ? 'has-error' : ''} disabled={loading} />
              </div>
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="su-pw">Password</label>
              <div className="auth-input-wrap">
                <input id="su-pw" name="password" type={showPw ? 'text' : 'password'}
                  autoComplete="new-password" value={form.password} onChange={onChange}
                  placeholder="Min. 6 characters" className={errors.password ? 'has-error' : ''} disabled={loading} />
                <button type="button" className="auth-eye" onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? 'Hide' : 'Show'}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
              {form.password.length > 0 && (
                <p style={{ fontSize: '0.78rem', marginTop: 5, color: pwLong ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {pwLong ? '✓' : '○'} At least 6 characters
                </p>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="su-confirm">Confirm password</label>
              <div className="auth-input-wrap">
                <input id="su-confirm" name="confirm" type={showPw ? 'text' : 'password'}
                  autoComplete="new-password" value={form.confirm} onChange={onChange}
                  placeholder="Re-enter password" className={errors.confirm ? 'has-error' : ''} disabled={loading} />
              </div>
              {errors.confirm && <p className="field-error">{errors.confirm}</p>}
            </div>

            <button type="submit" className="auth-submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading && <span className="auth-spinner" aria-hidden="true" />}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="auth-divider">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
