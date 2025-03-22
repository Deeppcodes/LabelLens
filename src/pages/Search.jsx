import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import "../styles/Search.css";
// Import CSV as URL instead of direct import
import cosmeticsDataUrl from "../assets/cosmetics.csv?url";
import medicinesDataUrl from "../assets/Medicine_Details.csv?url";

const Search = ({ onProductSelect }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q");
  const type = searchParams.get("type") || "products";

  const [searchType, setSearchType] = useState(type);
  const [searchQuery, setSearchQuery] = useState(query || "");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [cosmeticsData, setCosmeticsData] = useState([]);
  const [medicinesData, setMedicinesData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load CSV data when component mounts
    Promise.all([
      fetch(cosmeticsDataUrl).then((response) => response.text()),
      fetch(medicinesDataUrl).then((response) => response.text()),
    ])
      .then(([cosmeticsText, medicinesText]) => {
        const cosmeticsResult = Papa.parse(cosmeticsText, {
          header: false,
          skipEmptyLines: true,
        });
        const medicinesResult = Papa.parse(medicinesText, {
          header: false,  // Changed from true to false
          skipEmptyLines: true,
        });

        setCosmeticsData(cosmeticsResult.data);
        setMedicinesData(medicinesResult.data);
      })
      .catch((error) => console.error("Error loading CSV:", error));
  }, []);

  const handleSearch = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
  };

  const handleProductClick = (result) => {
    onProductSelect(result);
    navigate('/product');
  };

  useEffect(() => {
    if (query && (cosmeticsData.length > 0 || medicinesData.length > 0)) {
      performSearch(query, type);
    }
  }, [query, type, cosmeticsData, medicinesData]);

  const performSearch = (searchQuery, searchType) => {
    const query = searchQuery.toLowerCase();

    if (searchType === "products") {
      // Search in both cosmetics.csv and Medicine_Details.csv
      const cosmeticsResults = cosmeticsData
        .filter(
          (item) =>
            item[1]?.toLowerCase().includes(query) || // Brand name
            item[2]?.toLowerCase().includes(query) // Product name
        )
        .map((item) => ({
          type: "cosmetic",
          category: item[0],
          brand: item[1],
          name: item[2],
          ingredients: item[5],
        }));

      const medicinesResults = medicinesData
        .filter(
          (item) =>
            item[0]?.toLowerCase().includes(query) || // medicine name
            item[1]?.toLowerCase().includes(query) || // manufacturer
            item[5]?.toLowerCase().includes(query)    // composition
        )
        .map((item) => ({
          type: "medicine",
          name: item[0],
          manufacturer: item[5],
          composition: item[1],
        }));

      setSearchResults([...cosmeticsResults, ...medicinesResults]);
    } else if (searchType === "ingredients") {
      // TODO
    }
  };

  const paginate = (results) => {
    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;
    return results.slice(startIndex, endIndex);
  };

  const renderSearchResults = () => {
    if (!searchResults.length) {
      return (
        <div className="no-results">
          <p>{query ? `No results found for "${query}"` : ""}</p>
        </div>
      );
    }

    const totalPages = Math.ceil(searchResults.length / resultsPerPage);
    const paginatedResults = paginate(searchResults);

    return (
      <>
        <div className="search-results-grid">
          {paginatedResults.map((result, index) => (
            <div 
              key={index} 
              className="search-result-card"
              onClick={() => handleProductClick(result)}
              role="button"
              tabIndex={0}
            >
              <div className="result-header">
                <h3>{result.name}</h3>
                {result.type === "cosmetic" ? (
                  <span className="subtitle">{result.brand}</span>
                ) : (
                  <span className="subtitle">{result.manufacturer}</span>
                )}
              </div>
              <div className="result-details">
                {result.type === "cosmetic" ? (
                  <span className="tag">{result.category}</span>
                ) : (
                  <span className="tag">{result.composition}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-arrow"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              aria-label="Previous page"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="pagination-numbers">
              {renderPaginationNumbers(totalPages)}
            </div>

            <button
              className="pagination-arrow"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              aria-label="Next page"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 6L15 12L9 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </>
    );
  };

  const renderPaginationNumbers = (totalPages) => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      // Show first page, last page, current page, and one page before and after current
      if (
        i === 1 ||
        i === totalPages ||
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1
      ) {
        pages.push(
          <button
            key={i}
            className={`pagination-number ${currentPage === i ? "active" : ""}`}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push(
          <span key={i} className="pagination-ellipsis">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const options = [
    { value: "products", label: "Products" },
    { value: "ingredients", label: "Ingredients" },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [query, searchType]);

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
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <div className="search-type-wrapper" ref={dropdownRef}>
                <button
                  className="custom-select"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {options.find((opt) => opt.value === searchType)?.label}
                  <svg
                    className={`dropdown-icon ${isDropdownOpen ? "open" : ""}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.5 4.5L6 8L9.5 4.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="custom-select-options">
                    {options.map((option) => (
                      <button
                        key={option.value}
                        className={`option ${
                          searchType === option.value ? "selected" : ""
                        }`}
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
            <button className="search-button" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        <div className="search-results-content">
          {query && (
            <h1 className="search-results-title">Results for "{query}"</h1>
          )}
          {renderSearchResults()}
        </div>
      </div>
    </div>
  );
};

export default Search;
