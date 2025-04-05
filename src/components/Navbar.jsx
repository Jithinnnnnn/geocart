import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the new CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="navbar-logo">GeoCart</h1>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Home</Link>
          </li>
          <li className="navbar-item">
            <Link to="/user" className="navbar-link">User</Link>
          </li>
          <li className="navbar-item">
            <Link to="/admin" className="navbar-link">Admin</Link>
          </li>
          <li className="navbar-item">
          <Link to="/shop" className="navbar-link">Shop</Link>
          </li>
          <li className="navbar-item">
          <Link to="/about" className="navbar-link">About</Link>
            
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;