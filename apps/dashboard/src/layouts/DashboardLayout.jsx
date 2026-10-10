import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, List, Bell, Settings, LogOut } from 'lucide-react';
import axios from 'axios';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('pricepilot_token');
      if (!token) return navigate('/');
      try {
        const res = await axios.get('http://localhost:3000/api/v1/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setUser(res.data.data);
        }
      } catch (err) {
        // Token invalid or expired
        localStorage.removeItem('pricepilot_token');
        navigate('/');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('pricepilot_token');
    navigate('/');
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Watchlist', path: '/dashboard/watchlist', icon: <List size={20} /> },
    { name: 'Alerts', path: '/dashboard/alerts', icon: <Bell size={20} /> },
    { name: 'Settings', path: '/dashboard/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>PricePilot</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout} style={{background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', width: '100%', textAlign: 'left'}}>
            <LogOut size={20} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
      
      <main className="dashboard-main">
        <header className="top-nav">
          <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', padding: '0.5rem 1rem', borderRadius: '6px', width: '300px', border: '1px solid var(--border)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" placeholder="Search products, brands, or history..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.9rem', color: 'var(--text-main)' }} />
          </div>
          <div className="user-profile" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            {user && <span style={{fontWeight: 500, color: 'var(--text-main)'}}>{user.name}</span>}
            <div className="avatar" style={{background: 'var(--border)', color: 'var(--text-main)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '1px solid var(--border-hover)'}}>
              {user ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
