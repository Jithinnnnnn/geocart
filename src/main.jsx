import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Home from './pages/Home';
import User from './pages/User';
import Admin from './pages/Admin';
import About from './pages/About';
import Shop from './pages/Shop';
import PaymentPage from './pages/PaymentPage';
import OrderHistory from './pages/OrderHistory';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path="user" element={<User />} />
        <Route path="admin" element={<Admin />} />
        <Route path="about" element={<About />} />  
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/order-history" element={<OrderHistory />} />
      </Route>
    </Routes>
  </Router>
);