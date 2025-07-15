import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Shop.css';

const Shop = () => {
  const navigate = useNavigate();

  // ### State Management
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [cart, setCart] = useState([]);
  const [locationError, setLocationError] = useState('');
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // ### Static Data (for fallback or initial display)
  const quotes = [
    "Supporting local businesses creates a ripple effect of economic prosperity throughout your community.",
    "Local shops aren't just stores—they're the foundation of neighborhood identity and cultural heritage.",
    "When you shop locally, 68% more of your money recirculates in your community compared to chain retailers.",
    "Local businesses create 60% more jobs per unit of sales compared to larger retail establishments.",
    "Discover the perfect blend of quality, personalization, and community impact when you shop locally.",
  ];

  // ### Effects
  useEffect(() => {
    // Set random quote
    setSelectedQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    // Fetch featured products from the database
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const products = await response.json();
        // Select up to 4 products as featured
        const featured = products.slice(0, 4).map(product => ({
          id: product._id.toString(),
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          storeName: product.store?.name || 'Unknown Store',
        }));
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLocationError('Error loading featured products');
      }
    };
    fetchFeaturedProducts();
  }, []);

  // ### Utility Functions
  const toRadian = (degree) => degree * (Math.PI / 180);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = toRadian(lat2 - lat1);
    const dLon = toRadian(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ### Event Handlers
  const handleSearchClick = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = { lat: position.coords.latitude, lon: position.coords.longitude };
          setUserLocation(location);
          try {
            const response = await fetch(`http://localhost:5000/api/stores/nearby?lat=${location.lat}&lon=${location.lon}`);
            if (!response.ok) throw new Error('Failed to fetch stores');
            const nearby = await response.json();
            // Normalize product data from the database
            const normalizedStores = nearby.map(store => ({
              ...store,
              id: store._id.toString(),
              products: store.products.map(product => ({
                id: product._id.toString(),
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                description: product.description,
              })),
            }));
            setNearbyStores(normalizedStores);
            if (normalizedStores.length > 0) setSelectedStore(normalizedStores[0]);
            setLocationError('');
          } catch (error) {
            setLocationError('Error fetching stores');
            console.error('Fetch error:', error);
          }
          setIsFetchingLocation(false);
        },
        (error) => {
          setLocationError('Unable to access location');
          setIsFetchingLocation(false);
        }
      );
    } else {
      setLocationError('Geolocation not supported');
      setIsFetchingLocation(false);
    }
  };

  const handleStoreClick = (store) => {
    setSelectedStore(store);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    navigate('/');
  };

  // ### Cart Management
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id);
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1,
        };
        console.log('Updated cart (increment quantity):', updatedCart);
        return updatedCart;
      } else {
        const newCart = [...prevCart, { ...product, quantity: 1 }];
        console.log('Updated cart (new item):', newCart);
        return newCart;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== productId);
      console.log('Updated cart (remove item):', updatedCart);
      return updatedCart;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      console.log('Updated cart (update quantity):', updatedCart);
      return updatedCart;
    });
  };

  const calculateTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);
  const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleProceedToPayment = () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before proceeding to checkout.');
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please log in to proceed.');
      navigate('/user');
      return;
    }
    if (!selectedStore) {
      alert('Please select a store before proceeding.');
      return;
    }
    const orderDetails = {
      cart: cart.map(item => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
      total: calculateTotal(),
      timestamp: new Date().toISOString(),
      orderNumber: `GC-${Math.floor(100000 + Math.random() * 900000)}`,
      userId,
      storeId: selectedStore._id,
    };
    console.log('Cart before navigation:', orderDetails);
    navigate('/payment', { state: orderDetails });
  };

  // ### Render Helper Functions
  const renderFeaturedProducts = () => (
    <section className="featured-products">
      <h2>Featured Products</h2>
      <div className="featured-grid">
        {featuredProducts.length > 0 ? (
          featuredProducts.map(product => (
            <div key={product.id} className="featured-item">
              <img src={product.imageUrl} alt={product.name} className="featured-image" />
              <div className="featured-details">
                <h3>{product.name}</h3>
                <p className="store-label">From {product.storeName}</p>
                <p className="price">₹{product.price.toFixed(2)}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No featured products available.</p>
        )}
      </div>
    </section>
  );

  const renderStoreList = () => (
    <section className="store-list">
      <h2>Nearby Stores</h2>
      {nearbyStores.length > 0 ? (
        <div className="store-grid">
          {nearbyStores.map((store) => (
            <div
              key={store._id}
              className={`store-card ${selectedStore?._id === store._id ? 'selected-store' : ''}`}
              onClick={() => handleStoreClick(store)}
            >
              <h3>{store.name}</h3>
              <p className="store-description">{store.description}</p>
              <div className="store-details">
                <span className="store-rating">
                  <i className="fas fa-star"></i> {store.rating}
                </span>
                <span className="store-distance">{store.distance.toFixed(1)} km away</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-results">
          <i className="fas fa-map-marker-alt"></i>
          <p>No stores found within 10 km of your location.</p>
          <p>Try expanding your search radius or visit again later as we add more partners.</p>
        </div>
      )}
    </section>
  );

  const renderProductList = () => (
    <section className="product-section">
      <div className="product-header">
        <h2>{selectedStore.name}</h2>
        <p className="store-tagline">{selectedStore.description}</p>
        <div className="store-meta">
          <span className="distance-badge">{selectedStore.distance.toFixed(1)} km</span>
          <span className="rating-badge">
            <i className="fas fa-star"></i> {selectedStore.rating}
          </span>
        </div>
      </div>
      <div className="product-grid">
        {selectedStore.products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
            </div>
            <div className="product-details">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="price-action">
                <span className="product-price">₹{product.price.toFixed(2)}</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                  aria-label={`Add ${product.name} to cart`}
                >
                  <i className="fas fa-plus"></i> Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  const renderCart = () => (
    <div className="cart-summary">
      <h3>Cart</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul className="cart-items">
          {cart.map(item => (
            <li key={item.id} className="cart-item-detailed">
              <img
                src={item.imageUrl}
                alt={item.name}
                style={{ width: '50px', height: '50px', marginRight: '10px' }}
              />
              <div className="cart-item-details">
                <p><strong>{item.name}</strong></p>
                {item.description && <p>{item.description}</p>}
                <p>Price: ₹{item.price.toFixed(2)}</p>
                <p>
                  Quantity:
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  {item.quantity}
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </p>
                <p>Subtotal: ₹{(item.price * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="cart-details">
        <span>{calculateTotalItems()} items</span>
        <span className="cart-total">₹{calculateTotal().toFixed(2)}</span>
      </div>
      <button
        className="checkout-btn"
        onClick={handleProceedToPayment}
        aria-label="Proceed to checkout"
      >
        <i className="fas fa-shopping-cart"></i> Checkout
      </button>
    </div>
  );

  // ### JSX Render
  return (
    <div className="shop-container">
      <header className="shop-header">
        <div className="header-content">
          <div className="logo-container">
            <h1 className="logo">GeoCart</h1>
            <span className="tagline">Shop Local, Delivered Fast</span>
          </div>
          <div className="header-actions">
            {cart.length > 0 && (
              <div className="cart-icon">
                <i className="fas fa-shopping-cart"></i>
                <span className="cart-badge">{calculateTotalItems()}</span>
              </div>
            )}
            <Link style={{ marginTop: '65px' }} to="/order-history" className="order-history-link">
             My Orders
            </Link>
            <button className="logout-button" onClick={handleLogout} aria-label="Logout">
              <i className="fas fa-sign-out-alt"></i> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <h2 style={{ color: 'white' }}>Discover Local Treasures Near You</h2>
          <p style={{ color: 'white' }}>Explore unique products from your neighborhood's finest shops</p>
          {!userLocation && !isFetchingLocation && (
            <button
              className="primary-button location-btn"
              onClick={handleSearchClick}
              disabled={isFetchingLocation}
            >
              <i className="fas fa-location-arrow"></i> Find Shops Near Me
            </button>
          )}
          {isFetchingLocation && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <p className="bold-white-large">Finding nearby shops...</p>
            </div>
          )}
          {locationError && (
            <div className="error-container">
              <p className="error-message">
                <i className="fas fa-exclamation-circle"></i> {locationError}
              </p>
              <button className="retry-button" onClick={handleSearchClick}>
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedQuote && (
        <div className="quote-banner">
          <blockquote>
            <i className="fas fa-quote-left"></i>
            {selectedQuote}
            <i className="fas fa-quote-right"></i>
          </blockquote>
        </div>
      )}

      <main className="main-content">
        {!userLocation && !isFetchingLocation && !locationError ? (
          renderFeaturedProducts()
        ) : (
          <>
            {userLocation && renderStoreList()}
            {selectedStore && renderProductList()}
          </>
        )}
      </main>

      {cart.length > 0 && (
        <div className="floating-cart">
          {renderCart()}
        </div>
      )}

      <footer className="shop-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>GeoCart</h3>
            <p>Connecting communities through local commerce</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>About</h4>
              <ul>
                <li><a href="/about">Our Mission</a></li>
                <li><a href="/partners">Partner With Us</a></li>
                <li><a href="/careers">Careers</a></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>Help</h4>
              <ul>
                <li><a href="/faq">FAQ</a></li>
                <li><a href="/contact">Contact Us</a></li>
                <li><a href="/returns">Returns Policy</a></li>
              </ul>
            </div>
            <div className="link-group">
              <h4>Legal</h4>
              <ul>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/shipping">Shipping Info</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="copyright">
          <p>© {new Date().getFullYear()} GeoCart, Inc. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Shop;