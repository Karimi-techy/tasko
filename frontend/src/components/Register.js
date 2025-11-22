import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
    try {
      await axios.post('/api/auth/register', formData);
      setSuccess('Account created successfully! Logging you in...');
      setTimeout(async () => {
        await login(formData.email, formData.password);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            <p className="brand-tagline">Join thousands of users getting things done</p>
            <div className="brand-features">
              <div className="brand-feature-item">
                <span className="feature-icon">✓</span>
                <span>Quick Registration</span>
              </div>
              <div className="brand-feature-item">
                <span className="feature-icon">✓</span>
                <span>Start Immediately</span>
              </div>
              <div className="brand-feature-item">
                <span className="feature-icon">✓</span>
                <span>No Hidden Fees</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="auth-form-header">
              <h2>Create Account</h2>
              <p>Get started with Tasko today</p>
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✓</span>
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="modern-form">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-input-modern"
                  />
                </div>
              </div>

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
                <label className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <span className="input-icon">📱</span>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+254 700 000 000"
                    value={formData.phone}
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="form-input-modern"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">I want to</label>
                <div className="role-selector">
                  <label className={`role-option ${formData.role === 'client' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="client"
                      checked={formData.role === 'client'}
                      onChange={handleChange}
                    />
                    <div className="role-content">
                      <span className="role-emoji">👤</span>
                      <span className="role-title">Post Tasks</span>
                      <span className="role-desc">I need help with tasks</span>
                    </div>
                  </label>
                  <label className={`role-option ${formData.role === 'worker' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value="worker"
                      checked={formData.role === 'worker'}
                      onChange={handleChange}
                    />
                    <div className="role-content">
                      <span className="role-emoji">🔧</span>
                      <span className="role-title">Complete Tasks</span>
                      <span className="role-desc">I want to earn money</span>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary-modern"
                disabled={loading}
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <div className="auth-footer-modern">
              <p>
                Already have an account?{' '}
                <button 
                  onClick={() => navigate('/login')} 
                  className="link-button"
                >
                  Sign In
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

export default Register;