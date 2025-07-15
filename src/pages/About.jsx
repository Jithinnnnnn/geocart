import React, { useState } from 'react';
import './About.css';

const About = () => {
  // State for contact form
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    const response = await fetch('http://localhost:5000/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      alert('Failed to send message');
    }
  };

  return (
    <div className="about-page">
      <header className="about-header">
        <h1>About GeoCart</h1>
        <p className="header-subtitle">
          GeoCart is an enterprise-grade platform that optimizes delivery logistics through strategic business collaboration. 
          We enable small to medium enterprises to reduce operational costs while enhancing service quality and market reach 
          through our proprietary geolocation technology and collaborative network infrastructure.
        </p>
      </header>

      <section className="about-intro">
        <div className="intro-content">
          <h2>Our Vision</h2>
          <p>
            At GeoCart, we envision a business ecosystem where logistics becomes a competitive advantage rather than an operational burden. 
            By connecting retailers with efficient delivery systems, we're transforming traditional commerce into a responsive, 
            technology-driven marketplace that better serves both businesses and consumers in the digital economy.
          </p>
        </div>
      </section>

      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>
          GeoCart's mission is to deliver measurable value through intelligent logistics solutions. We integrate advanced 
          geolocation technology with collaborative business networks to optimize resource allocation, minimize 
          environmental impact, and enhance revenue opportunities for our partners. Through continuous innovation 
          and data-driven insights, we provide scalable solutions that grow with your business.
        </p>
      </section>

      <section className="about-values">
        <h2>Core Values</h2>
        <div className="values-grid">
          <div className="value-item">
            <h3>Innovation</h3>
            <p>Pioneering technological solutions that anticipate market needs</p>
          </div>
          <div className="value-item">
            <h3>Collaboration</h3>
            <p>Building strategic partnerships that create mutual value</p>
          </div>
          <div className="value-item">
            <h3>Reliability</h3>
            <p>Delivering consistent, dependable service across our platform</p>
          </div>
          <div className="value-item">
            <h3>Integrity</h3>
            <p>Operating with transparency and ethical business practices</p>
          </div>
        </div>
      </section>

      <section className="about-team">
        <h2>Executive Leadership</h2>
        <p className="team-subtitle">
          Our management team brings decades of combined experience in technology, logistics, and business development.
        </p>
        <div className="team-grid">
          <div className="team-member">
            <img
              src="/The_Images/847.jpg"
              alt="Aravind S"
              className="team-image"
            />
            <div className="team-info">
              <h3>Aravind S</h3>
              <p className="team-role"></p>
              <p className="team-bio">
                Aravind leads GeoCart's strategic vision and oversees platform development with a 
                focus on scalability, performance, and market expansion. His background in enterprise 
                software architecture has been instrumental in creating GeoCart's robust technology foundation.
              </p>
            </div>
          </div>
          <div className="team-member">
            <img
              src="/The_Images/836.jpg"
              alt="Jithin Jose"
              className="team-image"
            />
            <div className="team-info">
              <h3>Jithin Jose</h3>
              <p className="team-role"></p>
              <p className="team-bio">
                Jithin brings extensive expertise in full-stack development and systems integration to GeoCart. 
                He leads our engineering team in developing scalable architecture and efficient APIs 
                that power our platform's performance. His focus on optimized solutions ensures 
                our technology remains at the forefront of industry standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-contact">
        <h2>Feedback</h2>
        <p className="contact-subtitle">
          We welcome inquiries regarding partnerships, technology implementation, and service offerings.
        </p>
        <div className="contact-form-container">
          {submitted ? (
            <p className="success-message">Your inquiry has been successfully submitted. A member of our team will respond within 24-48 business hours.</p>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Please describe how we can assist your business"
                  rows="6"
                  required
                ></textarea>
                {errors.message && <span className="error-message">{errors.message}</span>}
              </div>
              <button type="submit" className="submit-btn">Submit Inquiry</button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default About;