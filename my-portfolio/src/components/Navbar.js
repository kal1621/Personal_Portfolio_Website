
import React, { useState } from 'react';
import { FiMenu, FiX, FiHome, FiBriefcase, FiUser, FiMail, FiMoon, FiSun } from 'react-icons/fi';
import './Navbar.css';

function Navbar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 1, text: 'Home', icon: <FiHome />, link: '#home' },
    { id: 2, text: 'Portfolio', icon: <FiBriefcase />, link: '#portfolio' },
    { id: 3, text: 'About', icon: <FiUser />, link: '#about' },
    { id: 4, text: 'Contact', icon: <FiMail />, link: '#contact' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <a href="#home" className="navbar-logo">
          Portfolio
        </a>

        {/* Desktop Menu */}
        <ul className="navbar-menu">
          {navItems.map((item) => (
            <li key={item.id} className="navbar-item">
              <a href={item.link} className="navbar-link">
                <span className="navbar-icon">{item.icon}</span>
                {item.text}
              </a>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
            <span className="theme-toggle-label">
              {theme === 'light' ? 'Dark mode' : 'Light mode'}
            </span>
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="mobile-menu-btn"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <ul className={`mobile-menu ${isOpen ? 'active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.id} className="mobile-item">
              <a 
                href={item.link} 
                className="mobile-link"
                onClick={() => setIsOpen(false)}
              >
                <span className="mobile-icon">{item.icon}</span>
                {item.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
