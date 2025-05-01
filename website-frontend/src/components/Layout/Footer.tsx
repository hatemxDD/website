/**
 * Footer Component
 * 
 * Site-wide footer component that appears on all pages.
 * Features:
 * - Contact information
 * - Social media links
 * - Copyright information
 * - Quick links to important pages
 */

import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedinIn, FaResearchgate, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-content">
          <div className="footer-section brand-section">
            <Link to="/" className="footer-logo">
              Research<span>Lab</span>
            </Link>
            <p className="brand-description">
              Pioneering research in thermal comfort, control systems, and sustainable energy solutions for a better tomorrow.
            </p>
            <div className="newsletter">
              <h4>Stay Updated</h4>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button type="submit">
                  <FaArrowRight />
                </button>
              </div>
            </div>
          </div>

          <div className="footer-section links-section">
            <h4>Explore</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/about">About Us</Link>
              <Link to="/group">Research Teams</Link>
              <Link to="/publications">Publications</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/news">Latest News</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/resources">Resources</Link>
            </div>
          </div>

          <div className="footer-section contact-section">
            <h4>Get in Touch</h4>
            <div className="contact-info">
              <a href="mailto:contact@researchlab.com" className="contact-item">
                <FaEnvelope />
                <span>contact@researchlab.com</span>
              </a>
              <a href="tel:+1234567890" className="contact-item">
                <FaPhone />
                <span>+1 234 567 890</span>
              </a>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <address>
                  University Campus, Research Building<br />
                  Innovation District, City 12345
                </address>
              </div>
            </div>
          </div>

          <div className="footer-section social-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="ResearchGate">
                <FaResearchgate />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
            </div>
            <div className="certifications">
              <img src="/certification1.png" alt="Certification 1" />
              <img src="/certification2.png" alt="Certification 2" />
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-bottom-left">
            <p>&copy; {new Date().getFullYear()} ResearchLab. All rights reserved.</p>
          </div>
          <div className="footer-bottom-right">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Use</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 