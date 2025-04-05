import React, { useState, useEffect } from 'react';
import './Admin.css';

// --- Login Form Component ---
const LoginForm = ({ onLogin, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card shadow-lg rounded-lg p-6">
        <div className="admin-login-header text-center mb-6">
          <h1 className="text-3xl font-bold">GeoCart Admin</h1>
          <div className="admin-logo">
            <span className="text-blue-600">Geo</span>
            <span className="text-green-600">Cart</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@geocart.com"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Sidebar Component ---
const Sidebar = ({ activeSection, setActiveSection, onLogout }) => (
  <aside className="bg-gray-800 text-white w-64 py-7 px-2">
    <div className="flex items-center space-x-2 mb-6">
      <div className="text-2xl">
        <span className="text-blue-400">Geo</span>
        <span className="text-green-400">Cart</span>
      </div>
      <h2 className="text-xl font-semibold">Admin</h2>
    </div>
    <nav className="space-y-2">
      <SidebarItem label="Dashboard" isActive={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} />
      <SidebarItem label="Manage Shops" isActive={activeSection === 'manageShops'} onClick={() => setActiveSection('manageShops')} />
      <SidebarItem label="Manage Users" isActive={activeSection === 'manageUsers'} onClick={() => setActiveSection('manageUsers')} />
      <SidebarItem label="Manage Products" isActive={activeSection === 'manageProducts'} onClick={() => setActiveSection('manageProducts')} />
      <SidebarItem label="Orders" disabled={true} />
      <SidebarItem label="Contact" isActive={activeSection === 'contact'} onClick={() => setActiveSection('contact')} />
    </nav>
    <div className="mt-6">
      <button onClick={onLogout} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">
        Logout
      </button>
    </div>
  </aside>
);

const SidebarItem = ({ label, isActive, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full text-left py-2 px-4 rounded transition ${
      isActive ? 'bg-gray-700' : disabled ? 'text-gray-500 cursor-not-allowed' : 'hover:bg-gray-700'
    }`}
  >
    {label}
  </button>
);

// --- Dashboard Component ---
const Dashboard = ({ setActiveSection }) => {
  const dashboardItems = [
    { title: "Products", description: "Manage your product inventory", action: () => setActiveSection('manageProducts'), color: "blue", disabled: false },
    { title: "Shops", description: "Manage registered shops", action: () => setActiveSection('manageShops'), color: "green", disabled: false },
    { title: "Orders", description: "Process and track customer orders", action: null, color: "yellow", disabled: true },
    { title: "Contact", description: "View customer messages", action: () => setActiveSection('contact'), color: "purple", disabled: false },
    { title: "Users", description: "Manage user accounts and permissions", action: () => setActiveSection('manageUsers'), color: "purple", disabled: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardItems.map((item) => (
        <DashboardCard key={item.title} title={item.title} description={item.description} onAction={item.action} color={item.color} disabled={item.disabled} />
      ))}
    </div>
  );
};

const DashboardCard = ({ title, description, onAction, color, disabled }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg">
    <div className={`text-4xl text-${color}-500`}></div>
    <div className="mt-4">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
      <button
        className={`mt-4 py-2 px-4 rounded ${disabled ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        onClick={onAction}
        disabled={disabled}
      >
        {disabled ? `View ${title}` : `Go to ${title}`}
      </button>
    </div>
  </div>
);

// --- Manage Shops Component ---
const AddShopForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (isNaN(lat) || lat < -90 || lat > 90 || isNaN(lon) || lon < -180 || lon > 180) {
      alert('Invalid latitude or longitude');
      return;
    }
    onAdd({ name, description, location: { lat, lon } });
    setName('');
    setDescription('');
    setLatitude('');
    setLongitude('');
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-6">
      <h3 className="text-xl font-semibold mb-4">Add New Shop</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter shop name" required={true} />
        <FormField id="description" label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" required={true} />
        <FormField id="latitude" label="Latitude" type="number" step="0.0001" value={latitude} onChange={(e) => setLatitude(e.target.value)} placeholder="e.g. 12.981255" required={true} />
        <FormField id="longitude" label="Longitude" type="number" step="0.0001" value={longitude} onChange={(e) => setLongitude(e.target.value)} placeholder="e.g. 77.64686" required={true} />
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Add Shop</button>
          <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </div>
  );
};

const AddProductForm = ({ onAdd, onCancel, storeId }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      alert('Price must be a positive number');
      return;
    }
    onAdd({ name, price: priceNum, imageUrl, store: storeId });
    setName('');
    setPrice('');
    setImageUrl('');
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mt-2">
      <h4 className="text-lg font-semibold mb-2"></h4>
      <form onSubmit={handleSubmit} className="space-y-2">
        <FormField id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter product name" required={true} />
        <FormField id="price" label="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter price" required={true} />
        <FormField id="imageUrl" label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Enter image URL" required={true} />
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700">Add</button>
          <button type="button" onClick={onCancel} className="bg-gray-300 text-gray-700 py-1 px-2 rounded hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </div>
  );
};

const ManageShops = () => {
  const [shops, setShops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddShopForm, setShowAddShopForm] = useState(false);
  const [showAddProductForm, setShowAddProductForm] = useState(null);

  const fetchShops = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/shops');
      if (!response.ok) throw new Error(`Failed to fetch shops: ${response.statusText}`);
      const data = await response.json();
      setShops(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch shops error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleAddShop = async (shopData) => {
    try {
      const response = await fetch('http://localhost:5000/api/shops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shopData),
      });
      if (!response.ok) throw new Error('Failed to add shop');
      await fetchShops();
      setShowAddShopForm(false);
    } catch (err) {
      console.error('Add shop error:', err);
      setError(err.message);
    }
  };

  const handleDeleteShop = async (shopId) => {
    if (window.confirm('Are you sure you want to delete this shop?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/shops/${shopId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete shop');
        setShops(shops.filter((shop) => shop._id !== shopId));
      } catch (err) {
        console.error('Delete shop error:', err);
        setError(err.message);
      }
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to add product');
      await fetchShops();
      setShowAddProductForm(null);
    } catch (err) {
      console.error('Add product error:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Manage Shops</h3>
          <div>
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2" onClick={fetchShops}>
              Refresh
            </button>
            <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700" onClick={() => setShowAddShopForm(true)}>
              Add Shop
            </button>
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-center text-gray-600">Loading shops...</p>
        ) : shops.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Name</th>
                <th className="p-3">Description</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Latitude</th>
                <th className="p-3">Longitude</th>
                <th className="p-3">Products Count</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shops.map((shop) => (
                <React.Fragment key={shop._id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">{shop.name}</td>
                    <td className="p-3">{shop.description}</td>
                    <td className="p-3">{shop.rating.toFixed(1)}</td>
                    <td className="p-3">{shop.location.lat}</td>
                    <td className="p-3">{shop.location.lon}</td>
                    <td className="p-3">{shop.products.length}</td>
                    <td className="p-3">
                      <div className="shop-action-buttons">
                        <button
                          className="delete-shop-btn"
                          onClick={() => handleDeleteShop(shop._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="add-product-btn"
                          onClick={() => setShowAddProductForm(shop._id)}
                        >
                          Add Product
                        </button>
                      </div>
                    </td>
                  </tr>
                  {showAddProductForm === shop._id && (
                    <tr>
                      <td colSpan="7" className="p-0">
                        <AddProductForm onAdd={handleAddProduct} onCancel={() => setShowAddProductForm(null)} storeId={shop._id} />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">No shops found in the database.</p>
          </div>
        )}
      </div>
      {showAddShopForm && <AddShopForm onAdd={handleAddShop} onCancel={() => setShowAddShopForm(false)} />}
    </div>
  );
};

// --- Manage Users Component ---
const ManageUsers = ({ users, handleDeleteUser, fetchUsers, isLoadingUsers }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-semibold">User Accounts</h3>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={fetchUsers}>
        Refresh
      </button>
    </div>
    {isLoadingUsers ? (
      <p className="text-center text-gray-600">Loading users...</p>
    ) : users.length > 0 ? (
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteUser(user._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="text-center">
        <p className="text-gray-600">No users found in the database.</p>
      </div>
    )}
  </div>
);



const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData) => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error('Failed to add product');
      await fetchProducts();
      setShowAddForm(false);
    } catch (err) {
      console.error('Add product error:', err);
      setError(err.message);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete product');
        setProducts(products.filter((product) => product._id !== productId));
      } catch (err) {
        console.error('Delete product error:', err);
        setError(err.message);
      }
    }
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Manage Products</h3>
          <div>
            <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mr-2" onClick={fetchProducts}>
              Refresh
            </button>
         
          </div>
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-center text-gray-600">Loading products...</p>
        ) : products.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3">Name</th>
                <th className="p-3">Price</th>
                <th className="p-3">Image</th>
                <th className="p-3">Store</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{product.name}</td>
                  <td className="p-3">₹{product.price.toFixed(2)}</td>
                  <td className="p-3">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded" onError={(e) => (e.target.src = '/fallback-image.jpg')} />
                  </td>
                  <td className="p-3">{product.store?.name || product.store || 'N/A'}</td>
                  <td className="p-3">
                    <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteProduct(product._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">
            <p className="text-gray-600">No products found in the database.</p>
          </div>
        )}
      </div>
      {showAddForm && <AddProductFormStandalone onAdd={handleAddProduct} onCancel={() => setShowAddForm(false)} />}
    </div>
  );
};

// --- Manage Contacts Component ---
const ManageContacts = ({ contacts, fetchContacts, isLoadingContacts, handleDeleteContact }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-semibold">Contact Messages</h3>
      <button className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={fetchContacts}>
        Refresh
      </button>
    </div>
    {isLoadingContacts ? (
      <p className="text-center text-gray-600">Loading contacts...</p>
    ) : contacts.length > 0 ? (
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Message</th>
            <th className="p-3">Received At</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{contact.name}</td>
              <td className="p-3">{contact.email}</td>
              <td className="p-3">{contact.message}</td>
              <td className="p-3">{new Date(contact.createdAt).toLocaleString()}</td>
              <td className="p-3">
                <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteContact(contact._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="text-center">
        <p className="text-gray-600">No contact messages found.</p>
      </div>
    )}
  </div>
);

// --- Form Field Component ---
const FormField = ({ id, label, type = "text", placeholder, required, value, onChange, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium">{label}</label>
    <input
      type={type}
      id={id}
      name={id}
      placeholder={placeholder}
      required={required}
      value={value}
      onChange={onChange}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);

// --- Main Admin Component ---
const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        setIsLoggedIn(true);
        setError('');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(`Server error: ${error.message}`);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
  };

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('http://localhost:5000/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const usersData = await response.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Fetch users error:', error);
      setError(error.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Delete user error:', error);
        setError(error.message);
      }
    }
  };

  const fetchContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const response = await fetch('http://localhost:5000/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const contactsData = await response.json();
      setContacts(Array.isArray(contactsData) ? contactsData : []);
    } catch (error) {
      console.error('Fetch contacts error:', error);
      setError(error.message);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact message?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/contacts/${contactId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete contact');
        setContacts(contacts.filter((contact) => contact._id !== contactId));
      } catch (error) {
        console.error('Delete contact error:', error);
        setError(error.message);
      }
    }
  };

  useEffect(() => {
    if (activeSection === 'manageUsers') fetchUsers();
    if (activeSection === 'contact') fetchContacts();
  }, [activeSection]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} error={error} />
      ) : (
        <div className="flex">
          <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} onLogout={handleLogout} />
          <main className="flex-1 p-6">
            <header className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">
                {activeSection === 'dashboard' && 'Dashboard'}
                {activeSection === 'manageShops' && 'Manage Shops'}
                {activeSection === 'manageUsers' && 'Manage Users'}
                {activeSection === 'manageProducts' && 'Manage Products'}
                {activeSection === 'contact' && 'Contact Messages'}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="text-lg">Admin</span>
                <div className="w-10 h-10 bg-blue-600 rounded-full"></div>
              </div>
            </header>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {activeSection === 'dashboard' && <Dashboard setActiveSection={setActiveSection} />}
            {activeSection === 'manageShops' && <ManageShops />}
            {activeSection === 'manageUsers' && (
              <ManageUsers users={users} handleDeleteUser={handleDeleteUser} fetchUsers={fetchUsers} isLoadingUsers={isLoadingUsers} />
            )}
            {activeSection === 'manageProducts' && <ManageProducts />}
            {activeSection === 'contact' && (
              <ManageContacts contacts={contacts} fetchContacts={fetchContacts} isLoadingContacts={isLoadingContacts} handleDeleteContact={handleDeleteContact} />
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default Admin;