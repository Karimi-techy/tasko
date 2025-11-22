import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container-modern">
        {/* Left Side - Branding */}
        <div className="auth-brand-side">
          <div className="brand-content">
            <h1 className="brand-logo">Tasko</h1>
            <p className="brand-tagline">Your trusted marketplace for getting things done</p>
            <div className="brand-features">
              <div className="brand-feature-item">
                <span className="feature-icon">✓</span>
                <span>Secure Payments</span>
              </div>
              <div className="brand-feature-item">
                <span className="feature-icon">✓</span>
                <span>Verified Workers</span>
              </div>
              <div className="brand-feature-item">
                <span className="feature-icon">✓</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue to Tasko</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input-modern"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input-modern"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary-modern"
                disabled={loading}
              >
                {loading ? (
                  <span>Signing in...</span>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <div className="auth-footer-modern">
              <p>
                Don't have an account?{' '}
                <button 
                  onClick={() => navigate('/register')} 
                  className="link-button"
                >
                  Create Account
                </button>
              </p>
            </div>

            <button 
              onClick={() => navigate('/')} 
              className="back-home-btn"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;