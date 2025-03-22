import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleScanClick = () => {
    navigate('/scan');
  };

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const options = [
    { value: 'products', label: 'Products' },
    { value: 'ingredients', label: 'Ingredients' },
  ];

  return (
    <div className="hero">
      <div className="transparency-badge">Label Intelligence</div>
      
      <h1 className="hero-title">
        Understand What's In Your <span className="highlight">Products</span>
      </h1>
      
      <p className="hero-description">
        Analyze ingredients, scan labels, and make informed decisions about what's in your products.
      </p>

      <div className="profile-notice">
        <p>
          <Link to="/profile" style={{ color: 'var(--primary-color)' }}>Create your profile</Link> to get personalized product recommendations!
        </p>
      </div>
      
      <div className="search-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder={`Search ${searchType}...`}
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="search-type-wrapper" ref={dropdownRef}>
            <button 
              className="custom-select"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {options.find(opt => opt.value === searchType)?.label}
              <svg 
                className={`dropdown-icon ${isDropdownOpen ? 'open' : ''}`}
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="custom-select-options">
                {options.map((option) => (
                  <button
                    key={option.value}
                    className={`option ${searchType === option.value ? 'selected' : ''}`}
                    onClick={() => {
                      setSearchType(option.value);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="search-button" onClick={handleSearch}>Search</button>
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
