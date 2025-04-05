import React from 'react';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const currentYear = new Date().getFullYear();
  
  // Dummy featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "Apple",
      price: 120.00,
      rating: 4.7,
      image: "/The_Images/pple-leaves-tail-slice-wallpaper.jpg",
      description: "Kashmiri apples"
    },
    {
      id: 2,
      name: "Jackfruit",
      price: 150.00,
      rating: 4.5,
      image: "/The_Images/Jackfruit.jpeg",
      description: "Kerala jackfruits"
    },
    {
      id: 3,
      name: "Alphonsa mango",
      price: 135.00,
      rating: 4.9,
      image: "/The_Images/mango-.jpeg",
      description: "Fresh alphonsa mangoes"
    }
  ];
  
  return (
    <div className="home">
      {/* Hero Section with Video Background */}
      <header className="hero">
        <div className="video-container">
          <video autoPlay muted loop className="background-video">
            <source src="/The_Images/Beige Light Brown Collage Quote Desktop Wallpaper.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <img
              src="/The_Images/fb5b2fff-3752-4396-a00b-1cd010336807.jpg"
              alt="GeoCart background"
              className="hero-image"
            />
          </video>
        </div>
      
        <div className="hero-content">
         
          <Link to="/user" className="primary-button" aria-label="Explore GeoCart Platform">
            Let's Explore
          </Link>
        </div>
      </header>

      {/* Featured Products Section */}
      <section className="featured-products-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Discover our most popular items selected just for you</p>
          
          <div className="products-grid">
            {featuredProducts.map(product => (
              <div className="product-card" key={product.id}>
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="product-image"
                  />
                  <div className="product-badge">Featured</div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-details">
                    <span className="product-price">Rs {product.price.toFixed(2)}</span>
                    <div className="product-rating">
                      <span className="stars">{'★'.repeat(Math.floor(product.rating))}{product.rating % 1 >= 0.5 ? '½' : ''}</span>
                      <span className="rating-number">({product.rating})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="view-all-container">
            <Link to="/user" className="view-all-button">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="value-proposition-section">
        <h2 className="section-title">Enterprise Solutions</h2>
        <div className="solutions-grid">
          <div className="solution-card">
            <img
              src="/The_Images/3873446.jpg"
              alt="Advanced Geolocation Technology"
              className="solution-image"
            />
            <h3>Precision Geolocation</h3>
            <p>
              Leverage our industry-leading location services to connect with nearby retailers and optimize your shopping experience with unprecedented accuracy.
            </p>
          </div>
          <div className="solution-card">
            <img
              src="/The_Images/5995357.jpg"
              alt="Data-Driven Recommendations"
              className="solution-image"
            />
            <h3>Advanced Analytics</h3>
            <p>
              Experience personalized product recommendations powered by sophisticated algorithms that analyze preferences and shopping patterns for optimal results.
            </p>
          </div>
          <div className="solution-card">
            <img
              src="/The_Images/4b7be0fd-aa0b-4383-9f5f-95eb098746c2.jpg"
              alt="Enterprise-Grade Security"
              className="solution-image"
            />
            <h3>Enterprise Security</h3>
            <p>
              Conduct transactions with confidence through our enterprise-grade security infrastructure, ensuring data protection and transaction integrity at every step.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview Section */}
      <section className="company-section">
        <div className="company-content">
          <div className="company-text">
            <h2 className="section-title">About Us</h2>
            <p>
              GeoCart is the premier technology solution connecting consumers with local commerce opportunities. Our platform integrates seamlessly with existing retail infrastructure to provide an exceptional shopping experience for the modern consumer.
            </p>
            <p>
              We deliver a comprehensive suite of services across multiple retail categories, ensuring both consumers and merchants benefit from our proprietary technology. Our enterprise partnerships enable retailers of all sizes to compete effectively in today's digital marketplace.
            </p>
            <p>
              Join thousands of satisfied clients who have optimized their local commerce strategy with GeoCart's innovative solutions and industry-leading customer support.
            </p>
          </div>
          <img
            src="/The_Images/image.jpg"
            alt="Professional GeoCart Platform Interface"
            className="company-image"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>&copy; {currentYear} GeoCart, Inc. All rights reserved.</p>
            <p>A leader in location-based retail technology</p>
          </div>
          <div className="footer-links">
            <a href="/contact" className="footer-link">Contact Sales</a>
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/investors" className="footer-link">Investor Relations</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;