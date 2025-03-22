import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const handleScanClick = () => {
    navigate('/scan');
  };

  return (
    <div className="hero">
      <div className="transparency-badge">Label Intelligence</div>
      
      <h1 className="hero-title">
        Understand What's In Your <span className="highlight">Products</span>
      </h1>
      
      <p className="hero-description">
        Analyze ingredients, scan labels, and make informed decisions about what's in your products.
      </p>
      
      <div className="search-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search ingredients or scan a product label..." 
            className="search-input" 
          />
        </div>
        <button className="search-button">Search</button>
      </div>
      
      <div className="cta-buttons">
        <button 
          className="cta-button primary"
          onClick={handleScanClick}
        >
          Scan Label
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default Hero;
