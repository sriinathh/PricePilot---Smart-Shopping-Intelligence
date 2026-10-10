import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ExternalLink, TrendingDown, Edit3, Trash2 } from 'lucide-react';
import './Watchlist.css';

const Watchlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      const token = localStorage.getItem('pricepilot_token');
      if (!token) return;
      try {
        const res = await axios.get('http://localhost:3000/api/v1/watchlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setItems(res.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch watchlist.');
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const token = localStorage.getItem('pricepilot_token');
      const response = await axios.delete(`http://localhost:3000/api/v1/watchlist/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setItems(items.filter(item => item._id !== id));
      }
    } catch (err) {
      alert('Failed to delete item from database.');
    }
  };

  const handleEdit = async (id, currentPrice) => {
    const newTarget = window.prompt('Enter new target price:', currentPrice);
    if (!newTarget || isNaN(newTarget)) return;
    
    try {
      const token = localStorage.getItem('pricepilot_token');
      const response = await axios.put(`http://localhost:3000/api/v1/watchlist/${id}`, {
        targetPrice: parseFloat(newTarget)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setItems(items.map(item => item._id === id ? { ...item, targetPrice: parseFloat(newTarget) } : item));
        alert('Target price updated and alert created!');
      }
    } catch (err) {
      alert('Failed to update target price.');
    }
  };

  if (loading) return <div className="flex-center h-full"><Loader2 className="animate-spin text-muted" size={32} /></div>;

  return (
    <div className="overview-page">
      <div className="page-header">
        <h1>My Watchlist</h1>
        <p className="subtitle">Track and manage your saved products.</p>
      </div>

      {error && <div style={{ color: 'var(--danger)', padding: '1rem', background: '#FEE2E2', borderRadius: '8px' }}>{error}</div>}

      {items.length === 0 && !error ? (
        <div className="card flex-center" style={{ padding: '3rem', flexDirection: 'column', gap: '1rem', color: 'var(--text-muted)' }}>
          <p>Your watchlist is empty.</p>
          <p style={{ fontSize: '0.9rem' }}>Use the PricePilot extension to add products.</p>
        </div>
      ) : (
        <div className="watchlist-grid">
          {items.map(item => (
            <div key={item._id} className="watchlist-card">
              <img src={item.product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'} alt={item.product.title} className="watchlist-card-image" />
              
              <div className="watchlist-card-content">
                <div className="watchlist-card-brand">{item.product.brand || item.product.source}</div>
                <h3 className="watchlist-card-title">{item.product.title}</h3>
                
                <div className="price-row">
                  <div className="current-price">
                    <span className="price-label">Current Price</span>
                    <span className="price-value" style={{fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px'}}>
                      <Loader2 size={12} className="animate-spin" /> Engine Syncing
                    </span>
                  </div>
                  <div className="target-price">
                    <span className="price-label">Target Alert</span>
                    <span className="price-value">${item.targetPrice}</span>
                  </div>
                </div>
              </div>
              
              <div className="watchlist-card-footer">
                <a href={item.product.url} target="_blank" rel="noreferrer" className="btn-icon" title="Original Link">
                  <ExternalLink size={16} />
                </a>
                <Link to={`/dashboard/product/${item.product._id || '1'}`} className="btn-icon" title="View History">
                  <TrendingDown size={16} />
                </Link>
                <button className="btn-icon" title="Edit Target" onClick={() => handleEdit(item._id, item.targetPrice)}>
                  <Edit3 size={16} />
                </button>
                <button className="btn-icon text-danger" title="Remove" onClick={() => handleDelete(item._id)}>
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

export default Watchlist;
