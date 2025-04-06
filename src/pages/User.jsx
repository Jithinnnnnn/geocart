import React, { useState } from 'react';
import './User.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const User = () => {
  const [isSignIn, setIsSignIn] = useState(true); // Toggle between Sign In and Sign Up
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
  const [error, setError] = useState(''); // Error message state
  const navigate = useNavigate(); // Initialize navigation hook

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setError(''); // Clear previous errors

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const url = isSignIn
      ? 'http://localhost:5000/api/users/login'
      : 'http://localhost:5000/api/users/signup';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        if (isSignIn) {
          // Successful sign-in: Navigate to /shop
          alert('Login successful!');
          navigate('/shop');
        } else {
          // Successful sign-up: Prompt to sign in
          alert('Sign up successful! Please sign in.');
          setIsSignIn(true); // Switch to sign-in form
        }
      } else {
        // API returned an error
        setError(result.message || 'An error occurred');
      }
    } catch (error) {
      // Network or unexpected error
      setError('Network error. Please try again later.');
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="user-module">
      <div className="form-container">
        <h1>{isSignIn ? 'Sign In to GeoCart' : 'Join GeoCart'}</h1>
        <p className="subtitle">
          {isSignIn ? 'Welcome back! Please sign in.' : 'Create your account today.'}
        </p>

        {error && (
          <div className="error-container">
            <p className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isSignIn && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading
              ? `${isSignIn ? 'Signing In...' : 'Signing Up...'}`
              : isSignIn
              ? 'Sign In'
              : 'Sign Up'}
          </button>
        </form>

        <p className="toggle-text">
          {isSignIn ? "Don't have an account?" : 'Already have an account?'}
          <span
            onClick={() => setIsSignIn(!isSignIn)}
            className="toggle-link"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default User;