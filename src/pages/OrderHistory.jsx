import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderHistory.css';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/user');
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}/orders`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="order-history-container">
      <header className="order-history-header">
        <h1 style={{ marginTop: '80px' }}>Your Order History</h1>
        <p>View all your past and current orders</p>
      </header>
      <main className="order-history-content">
        {orders.length > 0 ? (
          <table className="order-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Date</th>
                <th>Store</th>
                <th>Total</th>
                <th>Status</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order.orderNumber}</td>
                  <td>{new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{order.store.name}</td>
                  <td>₹{order.total.toFixed(2)}</td>
                  <td>{order.status}</td>
                  <td>
                    <ul>
                      {order.products.map(item => (
                        <li key={item.product._id}>
                          {item.product.name} (Qty: {item.quantity})
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </main>
      <button className="back-btn" onClick={() => navigate('/shop')}>
        Back to Shop
      </button>
    </div>
  );
};

export default OrderHistory;