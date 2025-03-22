import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import '../styles/Search.css';

const genAI = new GoogleGenerativeAI('AIzaSyA_aflW4puinlv-NCOnkYeR5QyTsBdfBTA');

const ANALYSISPROMPT = `Analyze these skincare/medication ingredients and return JSON with:
{
  "ingredients": [
    {
      "ingredient_name": "example",
      "background": "[Provide exactly 4 complete sentences: 1) What it is 2) Its main purpose/function 3) Key benefit or concern]",
      "usage": "[function]",
      "other_names": "synonyms",
      "side_effects": ["list"],
      "concerns": ["allergens/bans/warnings"],
      "safe": "safe/caution/beware"
    }
  ],
  "overallSafety": "Safe/Low Risk/Moderate/High Risk",
  "recommendations": "Tailored advice based on risks"
}

**Rules for safe**:
1. **beware** if:
   - Any ingredient is banned in EU/US/Japan
   - Contains carcinogens, endocrine disruptors, severe allergens
2. **caution** if:
   - Irritants, or minor cautions

**Rules for overallSafety**:
1. **High Risk** if:
   - At least 1 item as beware
2. **Moderate Risk** if:
   - Contains regionally restricted ingredients
   - 1+ severe allergen
3. **Low Risk** if:
   - 2+ minor cautions
4. **Safe** if:
   - No banned/restricted ingredients
   - ≤1 minor caution

Ingredients: `;

const PRODUCTPROMPT = `Given this product name, return ONLY a comma-separated list of its ingredients. If you can't find the exact product, return the most likely ingredients for this type of product. Format: "ingredient1, ingredient2, ingredient3". Product name: `;

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

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const type = searchParams.get('type') || 'product';
  const [searchResults, setSearchResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Search bar state (copied from Hero.jsx)
  const [searchType, setSearchType] = useState(type);
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearch = () => {
    // Update the URL with the correct search type
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
    { value: 'ingredient', label: 'Ingredient' },
    { value: 'product', label: 'Product' },
  ];

  useEffect(() => {
    console.log('Search params changed:', { query, type });
    if (query) {
      if (type === 'ingredient') {
        console.log('Analyzing ingredient:', query);
        analyzeIngredients(query);
      } else if (type === 'product') {
        console.log('Analyzing product:', query);
        analyzeProduct(query);
      }
    }
  }, [query, type]);

  const analyzeIngredients = async (ingredients) => {
    setAnalyzing(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // Format single ingredient as a list for consistency
      const formattedIngredients = ingredients.includes(',') ? 
        ingredients : 
        `[${ingredients}]`;
      
      let prompt = '';
      if (localStorage.getItem("allergies"))
        prompt += `Given that the user has these allergies ${localStorage.getItem("allergies")} `;
      if (localStorage.getItem("conditions"))
        prompt += `and these conditions ${localStorage.getItem("conditions")} `;
      prompt += ANALYSISPROMPT + formattedIngredients;

      const analyze = await model.generateContent([prompt]);
      const analyzeResponse = await analyze.response.text();
      
      var cleanJson = analyzeResponse
        .replace(/^```json/, '')
        .replace(/```[\s\S]*$/, '')
        .trim();

      let parsedResponse = JSON.parse(cleanJson.trim());

      const formattedAnalysis = {
        ingredients: parsedResponse.ingredients.map(ingredient => ({
          name: ingredient.ingredient_name,
          safety: ingredient.safe.charAt(0).toUpperCase() + ingredient.safe.slice(1),
          description: ingredient.background,
          otherNames: ingredient.other_names,
          sideEffects: ingredient.side_effects,
          concerns: ingredient.concerns,
          usage: ingredient.usage
        })),
        overallSafety: parsedResponse.overallSafety,
        recommendations: parsedResponse.recommendations,
      };

      setSearchResults(formattedAnalysis);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const analyzeProduct = async (productName) => {
    setAnalyzing(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      
      // First, get ingredients list
      const extractIngredients = await model.generateContent(PRODUCTPROMPT + productName);
      const ingredientsResponse = await extractIngredients.response.text();
      
      // Clean up ingredients list
      const ingredients = ingredientsResponse
        .replace(/[\[\]"']/g, '') // Remove brackets and quotes
        .split(',')
        .map(i => i.trim())
        .filter(i => i && i.length > 1)
        .join(', ');
      
      if (!ingredients) {
        throw new Error('No ingredients found for this product');
      }

      // Analyze ingredients
      let prompt = ANALYSISPROMPT + ingredients;
      if (localStorage.getItem("allergies")) {
        prompt = `Given that the user has these allergies ${localStorage.getItem("allergies")} ` + prompt;
      }
      if (localStorage.getItem("conditions")) {
        prompt = `and these conditions ${localStorage.getItem("conditions")} ` + prompt;
      }

      const analyze = await model.generateContent(prompt);
      const analyzeResponse = await analyze.response.text();
      
      // Parse and clean the JSON response
      const cleanJson = analyzeResponse
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '')
        .trim();

      const parsedResponse = JSON.parse(cleanJson);

      setSearchResults({
        ingredients: parsedResponse.ingredients.map(ingredient => ({
          name: ingredient.ingredient_name,
          safety: ingredient.safe.charAt(0).toUpperCase() + ingredient.safe.slice(1),
          description: ingredient.background,
          otherNames: ingredient.other_names,
          sideEffects: ingredient.side_effects,
          concerns: ingredient.concerns,
          usage: ingredient.usage
        })),
        overallSafety: parsedResponse.overallSafety,
        recommendations: parsedResponse.recommendations,
      });
    } catch (error) {
      console.error('Product analysis failed:', error);
      setSearchResults(null);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleIngredientClick = (ingredientName) => {
    navigate(`/search?q=${encodeURIComponent(ingredientName)}&type=ingredient`);
  };

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
          
          {analyzing && (
            <div className="analysis-loading">
              <div className="spinner"></div>
              <h2>Analyzing ingredient(s)...</h2>
              <p>This may take a few moments</p>
            </div>
          )}

          {searchResults && !analyzing && (
            <div className="analysis-results">
              <div className="results-container">
                <div className="safety-score">
                  <h2>Overall Safety: {searchResults.overallSafety}</h2>
                  <p>{searchResults.recommendations}</p>
                </div>

                <div className="ingredients-list">
                  <h2>{type === 'product' ? 'Product Ingredients Analysis' : 'Ingredient Analysis'}</h2>
                  {searchResults.ingredients.map((ingredient, index) => (
                    <div key={index} className={`ingredient-item ${ingredient.safety.toLowerCase()}`}>
                      <div className="ingredient-header">
                        <div className="name-safety">
                          {type === 'product' ? (
                            <div className="ingredient-name-container">
                              <h3 
                                onClick={() => handleIngredientClick(ingredient.name)}
                                className="clickable-ingredient"
                              >
                                {ingredient.name}
                                <LinkIcon />
                              </h3>
                            </div>
                          ) : (
                            <h3>{ingredient.name}</h3>
                          )}
                          <span className="safety-badge">{ingredient.safety}</span>
                        </div>
                      </div>
                      <div className="ingredient-details">
                        <div className="detail-section">
                          <p>{ingredient.description}</p>
                        </div>
                        {type === 'ingredient' && (
                          <>
                            <details className="detail-dropdown">
                              <summary>Usage</summary>
                              <div className="dropdown-content">
                                <p>{ingredient.usage}</p>
                              </div>
                            </details>

                            {ingredient.otherNames && (
                              <details className="detail-dropdown">
                                <summary>Also Known As</summary>
                                <div className="dropdown-content">
                                  <p>{ingredient.otherNames}</p>
                                </div>
                              </details>
                            )}

                            {ingredient.sideEffects && ingredient.sideEffects.length > 0 && (
                              <details className="detail-dropdown">
                                <summary>Side Effects</summary>
                                <div className="dropdown-content">
                                  <div className="effects-list">
                                    {ingredient.sideEffects.map((effect, idx) => (
                                      <div key={idx} className="effect-item">{effect}</div>
                                    ))}
                                  </div>
                                </div>
                              </details>
                            )}

                            {ingredient.concerns && ingredient.concerns.length > 0 && (
                              <details className="detail-dropdown">
                                <summary>Concerns</summary>
                                <div className="dropdown-content">
                                  <ul>
                                    {ingredient.concerns.map((concern, idx) => (
                                      <li key={idx}>{concern}</li>
                                    ))}
                                  </ul>
                                </div>
                              </details>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
