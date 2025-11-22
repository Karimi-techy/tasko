import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="brand-name">Tasko</span>
          </h1>
          <p className="hero-subtitle">
            Connect with skilled workers or find tasks to earn. 
            Your trusted marketplace for getting things done.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/register')} className="btn btn-hero-primary">
              Get Started
            </button>
            <button onClick={() => navigate('/login')} className="btn btn-hero-secondary">
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">How Tasko Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Post a Task</h3>
            <p>Describe what you need done, set a price, and choose a deadline.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Find Workers</h3>
            <p>Skilled workers nearby accept your task and get started.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>Payment is held securely until the task is completed.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Get It Done</h3>
            <p>Review the work and release payment when satisfied.</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <div className="benefits-container">
          <div className="benefit-box">
            <h3>For Clients</h3>
            <ul className="benefit-list">
              <li>✓ Post tasks in minutes</li>
              <li>✓ Choose from skilled workers</li>
              <li>✓ Secure escrow payment</li>
              <li>✓ Rate and review workers</li>
              <li>✓ Track task progress</li>
            </ul>
            <button onClick={() => navigate('/register')} className="btn btn-benefit">
              Post a Task
            </button>
          </div>
          <div className="benefit-box">
            <h3>For Workers</h3>
            <ul className="benefit-list">
              <li>✓ Find tasks nearby</li>
              <li>✓ Flexible work schedule</li>
              <li>✓ Guaranteed payment</li>
              <li>✓ Build your reputation</li>
              <li>✓ Earn extra income</li>
            </ul>
            <button onClick={() => navigate('/register')} className="btn btn-benefit">
              Start Earning
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="categories-section">
        <h2 className="section-title">Popular Task Categories</h2>
        <div className="categories-grid">
          <div className="category-card">
            <span className="category-emoji">🚚</span>
            <p>Delivery</p>
          </div>
          <div className="category-card">
            <span className="category-emoji">📦</span>
            <p>Pickup</p>
          </div>
          <div className="category-card">
            <span className="category-emoji">⌨️</span>
            <p>Data Entry</p>
          </div>
          <div className="category-card">
            <span className="category-emoji">👕</span>
            <p>Laundry</p>
          </div>
          <div className="category-card">
            <span className="category-emoji">📚</span>
            <p>Tutoring</p>
          </div>
          <div className="category-card">
            <span className="category-emoji">👶</span>
            <p>Babysitting</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-number">1,000+</h3>
            <p>Tasks Completed</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">500+</h3>
            <p>Active Workers</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">4.8★</h3>
            <p>Average Rating</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Ready to Get Started?</h2>
        <p>Join thousands of clients and workers on Tasko today.</p>
        <button onClick={() => navigate('/register')} className="btn btn-cta">
          Create Your Account
        </button>
      </div>

      {/* Footer */}
      <div className="landing-footer">
        <p>&copy; 2024 Tasko. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Landing;