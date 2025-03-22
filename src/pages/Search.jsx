import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/Search.css';

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'products';

  // Search bar state (copied from Hero.jsx)
  const [searchType, setSearchType] = useState(type);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="search-page-wrapper">
      <div className="search-results-page">
        <div className="search-results-header">
          <div className="search-container">
            <div className="search-box">
              <input 
                type="text" 
                placeholder={`Search ${searchType}...`}
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
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
        </div>

        <div className="search-results-content">
          <h1 className="search-results-title">
            {query ? `Results for "${query}"` : ""}
          </h1>
          {/* Add your search results content here */}
        </div>
      </div>
    </div>
  );
};

export default Search;
