import { useState, useEffect } from 'react'
import { Bell, ExternalLink, RefreshCw, BookmarkPlus, LogIn, Loader2 } from 'lucide-react'
import './App.css'

function App() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [token, setToken] = useState(null);
  const [targetPrice, setTargetPrice] = useState('');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Check if we have a token saved
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['pricepilot_token'], (result) => {
        if (result.pricepilot_token) setToken(result.pricepilot_token);
      });
    }
    fetchProductDetails();
  }, []);

  const fetchProductDetails = () => {
    setLoading(true);
    setSaveStatus(null);
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab && activeTab.id) {
          chrome.tabs.sendMessage(activeTab.id, { action: 'GET_PRODUCT_DETAILS' }, (response) => {
            if (chrome.runtime.lastError) {
              setProduct({ error: 'Unsupported page' });
            } else if (response) {
              setProduct(response);
            }
            setLoading(false);
          });
        }
      });
    } else {
      setTimeout(() => {
        setProduct({ title: 'Mock Product', price: '$99.99', domain: 'example.com', url: 'https://example.com' });
        setLoading(false);
      }, 500);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (data.success) {
        setToken(data.token);
        if (typeof chrome !== 'undefined' && chrome.storage) {
          chrome.storage.local.set({ pricepilot_token: data.token });
        }
      } else {
        setAuthError(data.error || 'Login failed');
      }
    } catch (err) {
      setAuthError('Network error connecting to backend');
    }
  };

  const saveToWatchlist = async () => {
    if (!product || product.error || !token) return;
    setSaving(true);
    
    try {
      // 1. Resolve Product
      const resolveRes = await fetch('http://localhost:3000/api/v1/products/resolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
      const resolveData = await resolveRes.json();
      
      if (resolveData.success) {
        // 2. Add to Watchlist
        const watchRes = await fetch('http://localhost:3000/api/v1/watchlist', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            productId: resolveData.data._id,
            targetPrice: targetPrice ? parseFloat(targetPrice) : 0
          })
        });
        
        const watchData = await watchRes.json();
        if (watchData.success) {
          setSaveStatus('Added to Watchlist!');
        } else {
          setSaveStatus(watchData.error || 'Failed to add to watchlist');
        }
      } else {
        setSaveStatus('Failed to resolve product');
      }
    } catch (err) {
      setSaveStatus('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (!token) {
    return (
      <div className="popup-container">
        <header className="header"><h1 className="logo">PricePilot</h1></header>
        <main className="main-content flex-center" style={{ flexDirection: 'column' }}>
          <h2 style={{fontSize: '1.2rem', marginBottom: '1rem'}}>Login to continue</h2>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
            <input type="email" placeholder="Email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}} required />
            <input type="password" placeholder="Password" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} style={{padding: '8px', borderRadius: '4px', border: '1px solid #ccc'}} required />
            <button type="submit" className="btn btn-primary"><LogIn size={16}/> Login</button>
            {authError && <div style={{color: 'red', fontSize: '0.8rem', textAlign: 'center'}}>{authError}</div>}
          </form>
          <div style={{marginTop: '1rem', fontSize: '0.8rem', color: '#666'}}>
            Don't have an account? Create one on the dashboard.
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="popup-container">
      <header className="header">
        <h1 className="logo">PricePilot</h1>
        <button className="icon-button" onClick={fetchProductDetails} title="Refresh"><RefreshCw size={16} /></button>
      </header>

      <main className="main-content">
        {loading ? (
          <div className="loading-state"><Loader2 className="animate-spin" size={24}/> Analyzing page...</div>
        ) : product?.error ? (
          <div className="empty-state">
            <p>No product detected on this page.</p>
            <p className="sub-text">Navigate to a supported product page to use PricePilot.</p>
          </div>
        ) : (
          <div className="product-details">
            {product.image && (
              <div className="product-image-container"><img src={product.image} alt="Product" className="product-image" /></div>
            )}
            <h2 className="product-title">{product.title}</h2>
            <div className="product-meta"><span className="domain-badge">{product.domain}</span></div>
            
            <div className="price-section">
              <div className="current-price">
                <span className="price-label">Current Price</span>
                <span className="price-value">{product.price}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Target Price Alert (Optional)</label>
              <input 
                type="number" 
                placeholder="e.g. 50.00" 
                value={targetPrice}
                onChange={e => setTargetPrice(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
              />
            </div>

            {saveStatus && <div style={{fontSize: '0.8rem', color: saveStatus.includes('Failed') ? 'red' : '#10B981', marginTop: '8px', textAlign: 'center'}}>{saveStatus}</div>}

            <div className="actions">
              <button className="btn btn-primary" onClick={saveToWatchlist} disabled={saving}>
                <Bell size={16} />
                {saving ? 'Saving...' : 'Set Alert & Watch'}
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <button className="link-button" onClick={() => { setToken(null); if(typeof chrome!=='undefined' && chrome.storage) chrome.storage.local.remove('pricepilot_token') }}>Logout</button>
      </footer>
    </div>
  )
}

export default App
