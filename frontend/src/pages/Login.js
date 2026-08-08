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

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
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
      const { data } = await api.post('/auth/login', { email: form.email, password: form.password });
      login(data);
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding */}
      <div className="auth-left" aria-hidden="true">
        <div className="auth-left-logo">
          <div className="auth-left-logo-icon">✓</div>
          <span className="auth-left-logo-text">TaskFlow</span>
        </div>
        <h2 className="auth-left-heading">Welcome back 👋<br />Good to see you again.</h2>
        <p className="auth-left-sub">Sign in to access your personal workspace and pick up right where you left off.</p>
        <div className="auth-left-features">
          {['Your tasks, always in sync', 'Secure JWT authentication', 'Works on all your devices'].map(f => (
            <div className="auth-left-feat" key={f}>
              <div className="auth-left-feat-dot">✓</div>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h1 className="auth-heading">Sign in</h1>
          <p className="auth-subheading">Enter your credentials to access your account.</p>

          {apiError && <div className="auth-api-error" role="alert">{apiError}</div>}

          <form onSubmit={onSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <div className="auth-input-wrap">
                <input id="login-email" name="email" type="email" autoComplete="email"
                  value={form.email} onChange={onChange} placeholder="you@example.com"
                  className={errors.email ? 'has-error' : ''} disabled={loading} />
              </div>
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="auth-field">
              <label htmlFor="login-pw">Password</label>
              <div className="auth-input-wrap">
                <input id="login-pw" name="password" type={showPw ? 'text' : 'password'}
                  autoComplete="current-password" value={form.password} onChange={onChange}
                  placeholder="••••••••" className={errors.password ? 'has-error' : ''} disabled={loading} />
                <button type="button" className="auth-eye" onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <div className="auth-options">
              <label className="auth-remember">
                <input type="checkbox" /> Remember me
              </label>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading && <span className="auth-spinner" aria-hidden="true" />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="auth-divider">
            Don't have an account? <Link to="/signup">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
