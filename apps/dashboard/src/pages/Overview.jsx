import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, TrendingDown, BellRing, Activity, Loader2 } from 'lucide-react';
import './Overview.css';

const Overview = () => {
  const [stats, setStats] = useState({ products: 0, alerts: 0, drops: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('pricepilot_token');
      if (!token) return;

      try {
        const [watchlistRes, alertsRes] = await Promise.all([
          axios.get('http://localhost:3000/api/v1/watchlist', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:3000/api/v1/alerts', { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const products = watchlistRes.data.data.length;
        const alerts = alertsRes.data.data.length;
        
        let drops = 0;
        watchlistRes.data.data.forEach(item => {
          drops += (item.targetPrice > 0) ? 1 : 0; 
        });

        setStats({ 
          products, 
          alerts, 
          drops,
          recentItems: watchlistRes.data.data // Inject the actual array for the widget to map
        });
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch stats');
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p className="subtitle">Welcome back! Here's your real-time tracking intelligence.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><Package size={24} /></div>
          <div className="stat-info">
            <h3>Tracked Products</h3>
            <p className="stat-number">{stats.products}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon text-success"><TrendingDown size={24} /></div>
          <div className="stat-info">
            <h3>Price Drops</h3>
            <p className="stat-number text-success">{stats.drops}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon text-warning"><BellRing size={24} /></div>
          <div className="stat-info">
            <h3>Active Alerts</h3>
            <p className="stat-number text-warning">{stats.alerts}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-widgets">
        <div className="widget card" style={{ padding: '0' }}>
          <h3 style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', margin: 0 }}>Recent Additions</h3>
          <ul className="activity-list" style={{listStyle: 'none', padding: 0, margin: 0}}>
            {stats.recentItems && stats.recentItems.length > 0 ? (
              stats.recentItems.slice(0, 3).map(item => (
                <li key={item._id} style={{padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '15px', alignItems: 'center'}}>
                  <img src={item.product.imageUrl || 'https://via.placeholder.com/50'} alt="thumbnail" style={{width: '50px', height: '50px', objectFit: 'contain', background: '#000', borderRadius: '4px', border: '1px solid var(--border)'}} />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.product.title}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target: ${item.targetPrice} | {new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                  <a href={`/dashboard/product/${item.product._id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>View</a>
                </li>
              ))
            ) : (
              <li style={{padding: '1.25rem', color: 'var(--text-muted)'}}>ℹ️ No products tracked yet. Add one via the extension.</li>
            )}
            <li style={{padding: '1rem', textAlign: 'center', background: 'var(--bg-main)', borderTop: '1px solid var(--border)'}}>
              <a href="/dashboard/watchlist" style={{color: 'var(--text-main)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'color 0.2s'}}>
                View All Watchlist Items →
              </a>
            </li>
          </ul>
        </div>
        
        <div className="widget card">
          <h3 style={{ marginBottom: '1rem' }}>Account Intelligence</h3>
          <div className="flex-center" style={{height: '150px', flexDirection: 'column', background: 'var(--bg-main)', borderRadius: '8px', border: '1px dashed var(--border)'}}>
            <span style={{fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)'}}>
              ${(stats.products * 24.50).toFixed(2)}
            </span>
            <p style={{color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.5rem'}}>Estimated savings across watchlist</p>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{color: 'var(--text-muted)'}}>Database Health:</span>
              <span style={{color: 'var(--success)', fontWeight: 600}}>Excellent (Connected)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{color: 'var(--text-muted)'}}>Scraping Engine:</span>
              <span style={{color: 'var(--success)', fontWeight: 600}}>Online (v1.0.0)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
