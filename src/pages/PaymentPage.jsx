import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './PaymentPage.css';

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log('Received state:', state);
  const { cart, total, orderNumber, timestamp, userId, storeId } = state || {
    cart: [],
    total: 0,
    orderNumber: '',
    timestamp: '',
    userId: 'authenticatedUserId',
    storeId: 'selectedStoreId',
  };
  console.log('Cart in PaymentPage:', cart);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [upiId, setUpiId] = useState('');
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const validateCardNumber = (number) => /^\d{16}$/.test(number.replace(/\s/g, ''));
  const validateExpiry = (expiry) => /^\d{2}\/\d{2}$/.test(expiry) && new Date(`20${expiry.split('/')[1]}-${expiry.split('/')[0]}-01`) > new Date();
  const validateCvv = (cvv) => /^\d{3,4}$/.test(cvv);
  const validateUpi = (upi) => /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upi);

  useEffect(() => {
    setErrors({});
  }, [paymentMethod]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsProcessing(true);

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items to proceed.');
      setIsProcessing(false);
      return;
    }

    let newErrors = {};
    if (paymentMethod === 'card') {
      if (!validateCardNumber(cardDetails.number)) newErrors.number = 'Please enter a valid 16-digit card number.';
      if (!validateExpiry(cardDetails.expiry)) newErrors.expiry = 'Please enter a valid expiry date (MM/YY) in the future.';
      if (!validateCvv(cardDetails.cvv)) newErrors.cvv = 'Please enter a valid 3 or 4-digit CVV.';
    } else if (paymentMethod === 'upi') {
      if (!validateUpi(upiId)) newErrors.upi = 'Please enter a valid UPI ID (e.g., name@bank).';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsProcessing(false);
      return;
    }

    try {
      const orderData = {
        userId,
        storeId,
        products: cart.map(item => ({ product: item.id, quantity: item.quantity })),
        total,
        paymentMethod,
        orderNumber,
      };

      console.log('Sending order data:', orderData);

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Payment processing failed.');

      setTimeout(() => {
        if (paymentMethod === 'cod') {
          alert(`Order #${orderNumber} has been successfully placed. Please have ₹${total.toFixed(2)} ready for delivery.`);
        } else {
          alert(`Payment of ₹${total.toFixed(2)} for Order #${orderNumber} has been successfully processed. Thank you for your purchase!`);
        }
        navigate('/Shop', {
          state: { orderNumber, total, paymentMethod, orderedItems: cart },
        });
      }, 1000);
    } catch (error) {
      console.error('Payment error:', error);
      alert(`Error placing order: ${error.message}`);
      setIsProcessing(false);
    }
  };

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardDetails({ ...cardDetails, number: value });
  };

  const renderOrderSummary = () => {
    if (cart.length === 0) {
      return <p className="empty-cart">Your cart is currently empty.</p>;
    }

    return (
      <div className="order-summary-content">
        <div className="order-meta">
          <p><strong>Order Number:</strong> {orderNumber}</p>
          <p><strong>Placed On:</strong> {new Date(timestamp).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
        <table className="order-items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price.toFixed(2)}</td>
                <td>₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="order-total">
          <strong>Total Amount: ₹{total.toFixed(2)}</strong>
        </div>
      </div>
    );
  };

  return (
    <div className="payment-page">
      <header className="payment-header">
        <h1>Secure Payment</h1>
        <p>Finalize your order with our trusted payment options</p>
      </header>

      <div className="payment-container">
        <section className="order-summary card">
          <h2>Order Details</h2>
          {renderOrderSummary()}
          <button className="secondary-btn" onClick={() => navigate(-1)} disabled={isProcessing}>
            Modify Order
          </button>
        </section>

        <section className="payment-methods card">
          <h2>Payment Options</h2>
          <div className="method-options">
            <label className="radio-label">
              <input
                type="radio"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={() => setPaymentMethod('card')}
                disabled={isProcessing}
              />
              <span>Credit/Debit Card</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="upi"
                checked={paymentMethod === 'upi'}
                onChange={() => setPaymentMethod('upi')}
                disabled={isProcessing}
              />
              <span>UPI</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                disabled={isProcessing}
              />
              <span>Cash on Delivery</span>
            </label>
          </div>

          <form onSubmit={handlePayment} className="payment-form">
            {paymentMethod === 'card' && (
              <>
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input
                    id="card-number"
                    type="text"
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    disabled={isProcessing}
                  />
                  {errors.number && <span className="error-text">{errors.number}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group half-width">
                    <label htmlFor="expiry-date">Expiry Date</label>
                    <input
                      id="expiry-date"
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      placeholder="MM/YY"
                      maxLength="5"
                      disabled={isProcessing}
                    />
                    {errors.expiry && <span className="error-text">{errors.expiry}</span>}
                  </div>
                  <div className="form-group half-width">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      id="cvv"
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                      placeholder="123"
                      maxLength="4"
                      disabled={isProcessing}
                    />
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div className="form-group">
                <label htmlFor="upi-id">UPI ID</label>
                <input
                  id="upi-id"
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="example@upi"
                  disabled={isProcessing}
                />
                {errors.upi && <span className="error-text">{errors.upi}</span>}
              </div>
            )}

            {paymentMethod === 'cod' && (
              <p className="cod-info">You will pay ₹{total.toFixed(2)} in cash upon delivery of your order.</p>
            )}

            <button
              type="submit"
              className="primary-btn"
              disabled={isProcessing || cart.length === 0}
            >
              {isProcessing ? (
                <span className="spinner">Processing...</span>
              ) : paymentMethod === 'cod' ? (
                'Confirm Order'
              ) : (
                `Pay ₹${total.toFixed(2)}`
              )}
            </button>
          </form>
        </section>
      </div>

      <footer className="payment-footer">
        <p>© {new Date().getFullYear()} GeoCart, Inc. All Rights Reserved.</p>
        <p>Payments secured by <span className="highlight">GeoPay</span> technology</p>
      </footer>
    </div>
  );
};

export default PaymentPage;