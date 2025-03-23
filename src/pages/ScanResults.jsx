import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ScanResults.css';

const LinkIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ marginLeft: '4px' }}
  >
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const ScanResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, selectedImage } = location.state || {};

  const handleBackClick = () => {
    navigate('/');  // Changed from '/scan-product' to '/'
  };

  const handleIngredientClick = (ingredientName) => {
    navigate(`/search?q=${encodeURIComponent(ingredientName)}&type=ingredient`);
  };

  if (!analysis) {
    return (
      <div className="no-results">
        <h2>No analysis data available</h2>
        <button onClick={handleBackClick}>Back to Scan</button>
      </div>
    );
  }

  return (
    <div className="analysis-results">
      <button className="back-button" onClick={handleBackClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </button>

      <h1>Analysis Results</h1>
      <div className="results-container">
        
        
        {selectedImage && (
          <div className="image-preview">
            <img src={selectedImage} alt="Analyzed product" />
          </div>
        )}

        <div className="safety-score">
          <h2>Overall Safety: {analysis.overallSafety}</h2>
          <p>{analysis.recommendations}</p>
        </div>

        <div className="ingredients-list">
          <h2>Ingredients Analysis</h2>
          {analysis.ingredients.map((ingredient, index) => (
            <div key={index} className={`ingredient-item ${ingredient.safety.toLowerCase()}`}>
              <div className="ingredient-header">
                <div className="name-safety">
                  <div className="ingredient-name-container">
                    <h3 
                      onClick={() => handleIngredientClick(ingredient.name)}
                      className="clickable-ingredient"
                    >
                      {ingredient.name}
                      <LinkIcon />
                    </h3>
                  </div>
                  <span className="safety-badge">{ingredient.safety}</span>
                </div>
              </div>
              <div className="ingredient-details">
                <p>{ingredient.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScanResults;




