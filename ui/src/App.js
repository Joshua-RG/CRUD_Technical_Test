import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import MyOrders from './pages/MyOrders';
import AddEditOrder from './pages/AddEditOrder';
import ManageProducts from './pages/ManageProducts';
import './styles/App.css';

function App() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__logo">
          Orders <span>Manager</span>
        </div>
        <nav className="app-header__nav">
          <Link
            to="/"
            className={`app-header__link ${isActive('/') && !isActive('/products') ? 'app-header__link--active' : ''}`}
          >
            Mis Órdenes
          </Link>
          <Link
            to="/products"
            className={`app-header__link ${isActive('/products') ? 'app-header__link--active' : ''}`}
          >
            Productos
          </Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<MyOrders />} />
          <Route path="/orders/new" element={<AddEditOrder />} />
          <Route path="/orders/edit/:id" element={<AddEditOrder />} />
          <Route path="/products" element={<ManageProducts />} />
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
