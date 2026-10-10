import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Globe, Bell, Save, Loader2 } from 'lucide-react';
import './Overview.css'; // Reuse basic layout CSS

const Settings = () => {
  const [profile, setProfile] = useState({ name: '', email: '', currency: 'USD' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('pricepilot_token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:3000/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          const user = res.data.data;
          setProfile({
            name: user.name,
            email: user.email,
            currency: user.preferences?.currency || 'USD'
          });
        }
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('pricepilot_token');
    
    try {
      const res = await axios.put('http://localhost:3000/api/v1/auth/me', 
        { name: profile.name, currency: profile.currency },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (res.data.success) {
        setMessage('Profile settings saved successfully to Database!');
      }
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  if (loading) return <div className="flex-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Profile & Settings</h1>
        <p className="subtitle">Manage your account details and notification preferences.</p>
      </div>

      <div className="card" style={{ maxWidth: '600px', padding: '2rem' }}>
        {message && <div style={{background: message.includes('Failed') ? '#FEE2E2' : '#D1FAE5', color: message.includes('Failed') ? '#991B1B' : '#065F46', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem'}}>{message}</div>}
        
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              <User size={16} /> Full Name
            </label>
            <input 
              type="text" 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})} 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              <Mail size={16} /> Email Address
            </label>
            <input 
              type="email" 
              value={profile.email} 
              disabled
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'var(--bg-card)', color: 'var(--text-muted)' }}
            />
            <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>Email cannot be changed.</small>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
              <Globe size={16} /> Preferred Currency
            </label>
            <select 
              value={profile.currency}
              onChange={e => setProfile({...profile, currency: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '1rem', background: 'var(--bg-main)', color: 'var(--text-main)' }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Notification Preferences</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={profile.emailAlerts !== false} 
                  onChange={e => setProfile({...profile, emailAlerts: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 500 }}>Email Alerts</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>Receive price drops via email</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={profile.pushAlerts === true} 
                  onChange={e => setProfile({...profile, pushAlerts: e.target.checked})}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ fontWeight: 500 }}>Push Notifications</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: 'auto' }}>Browser notifications on your desktop</span>
              </label>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {saving ? 'Saving...' : 'Save All Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
