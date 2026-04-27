import React, { useState } from 'react';
import { FiMail, FiUser, FiMessageSquare, FiSend, FiMapPin, FiPhone, FiLinkedin, FiGithub, FiTwitter } from 'react-icons/fi';
import './Contact.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    type: 'idle',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message.');
      }

      setStatus({
        type: data.emailSent ? 'success' : 'warning',
        message: data.message,
      });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Could not connect to the server.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Get In Touch</h2>
          <p className="section-subtitle">Have a project in mind? Let's talk!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <div className="info-icon">
                <FiMail />
              </div>
              <div className="info-content">
                <h4>Email</h4>
                <p>kalkidanadeba5@gmail.com</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FiPhone />
              </div>
              <div className="info-content">
                <h4>Phone</h4>
                <p>+251993594635</p>
              </div>
            </div>

            <div className="info-card">
              <div className="info-icon">
                <FiMapPin />
              </div>
              <div className="info-content">
                <h4>Location</h4>
                <p>Addis Ababa, Ethiopia</p>
              </div>
            </div>

            <div className="social-links">
              <h4>Follow Me</h4>
              <div className="social-icons">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <FiGithub />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <FiLinkedin />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FiTwitter />
                </a>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-icon">
                  <FiUser />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <FiMail />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <FiMessageSquare />
                </div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="form-textarea"
                ></textarea>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <FiSend /> Send Message
                  </>
                )}
              </button>

              {status.type === 'success' && (
                <p className="success-message">{status.message}</p>
              )}
              {status.type === 'warning' && (
                <p className="warning-message">{status.message}</p>
              )}
              {status.type === 'error' && (
                <p className="error-message">{status.message}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
