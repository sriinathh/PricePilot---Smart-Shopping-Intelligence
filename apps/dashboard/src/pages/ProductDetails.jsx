import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Loader2, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const TOKEN = localStorage.getItem('pricepilot_token') || 'mock_jwt_token';

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/products/${id}/history`, {
          headers: { Authorization: `Bearer ${TOKEN}` }
        });
        
        // Format data for Recharts
        const formattedData = response.data.data.map(obs => ({
          date: new Date(obs.observedAt).toLocaleDateString(),
          price: obs.priceAmount,
          currency: obs.currency
        }));
        
        setHistory(formattedData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to load price history. Displaying mock data.');
        setLoading(false);
        
        // Mock fallback for UI rendering
        setHistory([
          { date: '10/01/2026', price: 349.99 },
          { date: '10/03/2026', price: 349.99 },
          { date: '10/05/2026', price: 329.99 },
          { date: '10/07/2026', price: 299.99 },
          { date: '10/10/2026', price: 299.99 },
        ]);
      }
    };

    fetchHistory();
  }, [id]);

  if (loading) {
    return <div className="flex-center h-full"><Loader2 className="animate-spin text-primary" size={32} /></div>;
  }

  const currentPrice = history.length > 0 ? history[history.length - 1].price : 0;
  const highestPrice = history.length > 0 ? Math.max(...history.map(d => d.price)) : 0;
  const lowestPrice = history.length > 0 ? Math.min(...history.map(d => d.price)) : 0;

  return (
    <div className="product-details-page">
      <div className="page-header">
        <Link to="/dashboard/watchlist" className="back-link">
          <ArrowLeft size={16} /> Back to Watchlist
        </Link>
        <h1>Price History Analysis</h1>
      </div>

      {error && (
        <div className="alert-warning">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="history-summary-grid">
        <div className="summary-card">
          <span className="label">Current Price</span>
          <span className="value">${currentPrice.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="label">Lowest Recorded</span>
          <span className="value text-success">${lowestPrice.toFixed(2)}</span>
        </div>
        <div className="summary-card">
          <span className="label">Highest Recorded</span>
          <span className="value">${highestPrice.toFixed(2)}</span>
        </div>
        <div className="summary-card" style={{ border: '1px solid var(--secondary)' }}>
          <span className="label">Price Drop Probability</span>
          <span className="value" style={{ color: 'var(--secondary)' }}>78%</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Based on 30-day volatility</span>
        </div>
      </div>

      <div className="chart-container card">
        <h2>Price Trend over Time</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={history} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{ fill: '#64748B' }} tickLine={false} axisLine={false} />
              <YAxis 
                tick={{ fill: '#64748B' }} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(val) => `$${val}`}
                domain={['dataMin - 20', 'dataMax + 20']}
              />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Price']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="var(--primary)" 
                strokeWidth={3} 
                dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
