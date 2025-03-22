import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form default submission
    if (searchQuery.trim()) {
      // Navigate to search page with query parameters
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}&type=${searchType}`);
    }
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

  return (
    <div className="hero">
      <h1>Understand Your Products Better</h1>
      <p>Scan product labels to learn about ingredients and their safety</p>
      
      <form onSubmit={handleSearch} className="search-container">
        <div className="search-box">
          <input 
            type="text" 
            placeholder={`Search ${searchType}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <div className="custom-select-wrapper" ref={dropdownRef}>
            <button 
              type="button" // Important: type="button" prevents form submission
              className="custom-select"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              {searchType === 'product' ? 'Product' : 'Ingredient'}
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
                <button
                  type="button"
                  className={`option ${searchType === 'product' ? 'selected' : ''}`}
                  onClick={() => {
                    setSearchType('product');
                    setIsDropdownOpen(false);
                  }}
                >
                  Product
                </button>
                <button
                  type="button"
                  className={`option ${searchType === 'ingredient' ? 'selected' : ''}`}
                  onClick={() => {
                    setSearchType('ingredient');
                    setIsDropdownOpen(false);
                  }}
                >
                  Ingredient
                </button>
              </div>
            )}
          </div>
        </div>
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="cta-buttons">
        <button 
          className="cta-button primary"
          onClick={() => navigate('/scan')}
        >
          Scan Label
          <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default Hero;
