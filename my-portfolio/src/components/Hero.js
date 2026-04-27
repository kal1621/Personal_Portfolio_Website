import React from 'react';
import { FiArrowRight, FiBriefcase, FiMail, FiMapPin } from 'react-icons/fi';
import heroPortrait from '../assets/hero-portrait.jpg';
import './Hero.css';

function Hero() {
  const technologies = ['React', 'Node.js', 'Python', 'MongoDB'];

  return (
    <section id="home" className="hero">
      <div className="hero-shell">
        <div className="hero-grid">
          <div className="hero-media">
            <div className="hero-image-card">
              <div className="hero-image-glow" />
              <img
                src={heroPortrait}
                alt="Portrait illustration of Kalkidan surrounded by development tools"
                className="hero-image"
              />
              <span className="hero-floating hero-floating-left">React</span>
              <span className="hero-floating hero-floating-right">Node.js</span>
              <span className="hero-floating hero-floating-bottom">Mongodb</span>
            </div>
          </div>

          <div className="hero-content">
            <span className="hero-eyebrow">Full Stack Developer / Modern Web Builder</span>
            
            <p className="hero-description">
              I&apos;m Kalkidan Adeba, a full stack developer who enjoys turning ideas into
              responsive interfaces and reliable web applications with React, Node.js,
              and Mongodb.
            </p>

            <div className="hero-meta">
              <div className="hero-meta-item">
                <FiMapPin />
                <span>Addis Ababa, Ethiopia</span>
              </div>
              <div className="hero-meta-item">
                <FiBriefcase />
                <span>Open to opportunities</span>
              </div>
            </div>

            <div className="hero-buttons">
              <a href="#portfolio" className="btn btn-primary">
                View Projects
                <FiArrowRight />
              </a>
              <a href="#contact" className="btn btn-outline">
                <FiMail />
                Let&apos;s Talk
              </a>
            </div>

            <div className="hero-stack">
              {technologies.map((item) => (
                <span key={item} className="hero-stack-item">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
