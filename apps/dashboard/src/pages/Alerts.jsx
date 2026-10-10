import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BellRing, Loader2, ExternalLink, Trash2 } from 'lucide-react';
import './Watchlist.css'; // Reuse watchlist grid layout

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      const token = localStorage.getItem('pricepilot_token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:3000/api/v1/alerts', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setAlerts(res.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch active alerts.');
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="flex-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>;

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Active Alerts</h1>
        <p className="subtitle">Products you are tracking for a specific target price drop.</p>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '1rem', background: '#FEE2E2', borderRadius: '8px' }}>{error}</div>}

      {alerts.length === 0 && !error ? (
        <div className="card flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
          <BellRing size={48} opacity={0.5} />
          <p>You have no active price alerts.</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {alerts.map(alert => (
            <div key={alert._id} className="watchlist-card">
              <div className="watchlist-card-content" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                    {alert.status.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Target: <strong style={{ color: 'var(--primary)', fontSize: '1rem' }}>${alert.targetPrice}</strong>
                  </span>
                </div>
                
                <h3 className="watchlist-card-title">{alert.watchlistItem?.product?.title || 'Unknown Product'}</h3>
                
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Created on: {new Date(alert.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="watchlist-card-footer">
                <a href={alert.watchlistItem?.product?.url} target="_blank" rel="noreferrer" className="btn-icon" title="View Product">
                  <ExternalLink size={16} />
                </a>
                <button className="btn-icon text-danger" title="Delete Alert">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
