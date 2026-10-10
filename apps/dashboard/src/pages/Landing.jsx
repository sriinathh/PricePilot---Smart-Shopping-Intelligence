import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, TrendingDown, BellRing } from 'lucide-react';
import axios from 'axios';
import './Landing.css';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/api/v1/auth/register' : '/api/v1/auth/login';
      const payload = isRegistering ? { name, email, password } : { email, password };
      
      const res = await axios.post(`http://localhost:3000${endpoint}`, payload);
      
      if (res.data.success) {
        localStorage.setItem('pricepilot_token', res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Network or Server Error';
      alert(`${isRegistering ? 'Registration' : 'Login'} failed: ${errorMessage}`);
    }
  };

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="logo-text">PricePilot</div>
        <div className="nav-links">
          {localStorage.getItem('pricepilot_token') ? (
            <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
          ) : (
            <>
              <button onClick={() => { setIsRegistering(false); setShowAuthModal(true); }}>Log in</button>
              <button onClick={() => { setIsRegistering(true); setShowAuthModal(true); }} className="btn btn-primary" style={{color: '#000'}}>Sign up</button>
            </>
          )}
        </div>
      </nav>

      <main className="hero">
        <div className="hero-content">
          <h1>Shop smarter. Never miss a better price.</h1>
          <p>
            Track products across your favorite stores, compare historical prices, and get instantly notified when the price hits your target.
          </p>
          <div className="cta-group">
            {localStorage.getItem('pricepilot_token') ? (
              <Link to="/dashboard" className="btn btn-primary" style={{padding: '1rem 2rem', fontSize: '1.1rem', color: '#000'}}>Go to Dashboard</Link>
            ) : (
              <button onClick={() => { setIsRegistering(true); setShowAuthModal(true); }} className="btn btn-primary" style={{padding: '1rem 2rem', fontSize: '1.1rem', color: '#000'}}>Start Tracking Free</button>
            )}
          </div>
        </div>
      </main>

      <section className="features">
        <div className="feature-card">
          <div className="feature-icon"><TrendingDown size={32} /></div>
          <h3>Price History</h3>
          <p>See real historical price trends based on our validated tracking engine, not fake countdowns.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><ShieldCheck size={32} /></div>
          <h3>Validated Savings</h3>
          <p>We ensure you're actually saving money by filtering out fake discounts and tracking true minimums.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon"><BellRing size={32} /></div>
          <h3>Smart Alerts</h3>
          <p>Set a target price and receive instant notifications exactly when the product becomes affordable.</p>
        </div>
      </section>

      {showAuthModal && (
        <div className="auth-modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="auth-modal" onClick={e => e.stopPropagation()}>
            <h2>{isRegistering ? 'Create an account' : 'Welcome back'}</h2>
            <form onSubmit={handleAuth} className="auth-form">
              {isRegistering && (
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                </div>
              )}
              <div className="input-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{marginTop: '1rem', padding: '0.8rem', fontSize: '1rem', color: '#000'}}>
                {isRegistering ? 'Create Account' : 'Sign In'}
              </button>
            </form>
            <div style={{marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)'}}>
              {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsRegistering(!isRegistering)} 
                style={{background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 600, padding: 0}}
              >
                {isRegistering ? 'Log in' : 'Sign up'}
              </button>
            </div>
            <button className="btn close-btn" onClick={() => setShowAuthModal(false)} style={{width: '100%'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Landing;
