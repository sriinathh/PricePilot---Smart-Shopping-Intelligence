import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/Overview';
import Watchlist from './pages/Watchlist';
import ProductDetails from './pages/ProductDetails';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="settings" element={<Settings />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
