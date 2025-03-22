import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MainSearch.css';
import WebcamCapture from '../components/WebcamCapture';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
const OCRPROMPT = "return the ingredients displayed in the image as a list in this exact format, do not add any other text, and show ALL ingredients, not only other ingredients, list each ingredient as a seperate item: [item1name, item2name, item3name]";

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
3. **safe** if:
   - Well-tested, minimal risk ingredients`;

const MainSearch = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('scan');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWebcam, setShowWebcam] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=product`);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageSrc = URL.createObjectURL(file);
      await analyzeImage(file, imageSrc);
    }
  };

  const handleWebcamCapture = async (imageSrc) => {
    setShowWebcam(false);
    setAnalyzing(true);
    
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      await analyzeImage(blob, imageSrc);
    } catch (error) {
      console.error('Error processing webcam image:', error);
      // Handle error appropriately
    }
  };

  const analyzeImage = async (imageData, imageSrc) => {
    setAnalyzing(true);
    
    try {
      const base64data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(imageData);
      });

      const imagePart = {
        inlineData: {
          data: base64data,
          mimeType: imageData.type,
        },
      };

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // First OCR step to get ingredients
      const ocr = await model.generateContent([OCRPROMPT, imagePart]);
      const ingredients = await ocr.response.text();
      console.log('OCR Results:', ingredients);

      // Second step to analyze ingredients
      let prompt2 = '';
      if (localStorage.getItem("allergies"))
        prompt2 += `Given that the user has these allergies ${localStorage.getItem("allergies")} `;
      if (localStorage.getItem("conditions"))
        prompt2 += `and these conditions ${localStorage.getItem("conditions")} `;
      prompt2 += ANALYSISPROMPT + ingredients;
      
      const analyze = await model.generateContent([prompt2]);
      const analyzeResponse = await analyze.response.text();
      console.log('Analysis Response:', analyzeResponse);

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

      // Navigate to results page with the analysis data
      navigate('/scan-results', {
        state: {
          analysis: formattedAnalysis,
          selectedImage: imageSrc
        }
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      // You might want to show an error message to the user here
    } finally {
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <div className="analysis-loading">
        <div className="spinner"></div>
        <h2>Analyzing your product...</h2>
        <p>This may take a few moments</p>
      </div>
    );
  }

  return (
    <div className="main-search-container">
      <h1 className="main-title">
        Understand What's In Your<br />
        <span className="highlight">Products</span>
      </h1>
      
      <p className="description">
        Upload images of ingredient lists or search for specific ingredients to get detailed information and personalized safety analysis.
      </p>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => setActiveTab('scan')}
        >
          Scan Label
        </button>
        <button 
          className={`tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Search Product
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'scan' && (
          <div className="scan-section">
            {showWebcam ? (
              <WebcamCapture
                onCapture={handleWebcamCapture}
                onClose={() => setShowWebcam(false)}
              />
            ) : (
              <div className="upload-container">
                <div className="upload-area">
                  <div className="upload-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 5L8 9M12 5L16 9" stroke="#0077FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  
                  <h2 className="upload-title">Upload a photo of ingredients</h2>
                  
                  <p className="upload-instruction">
                    Take a clear photo of the ingredients list on your skincare product packaging
                  </p>
                  
                  <div className="upload-buttons">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                    <button className="upload-button" onClick={handleUploadClick}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 16.5V18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75V16.5M16.5 12L12 7.5M12 7.5L7.5 12M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Upload Image
                    </button>
                    
                    <button className="photo-button" onClick={() => setShowWebcam(true)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 9C11.2044 9 10.4413 9.31607 9.87868 9.87868C9.31607 10.4413 9 11.2044 9 12C9 12.7956 9.31607 13.5587 9.87868 14.1213C10.4413 14.6839 11.2044 15 12 15C12.7956 15 13.5587 14.6839 14.1213 14.1213C14.6839 13.5587 15 12.7956 15 12C15 11.2044 14.6839 10.4413 14.1213 9.87868C13.5587 9.31607 12.7956 9 12 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 9C3 7.93913 3.42143 6.92172 4.17157 6.17157C4.92172 5.42143 5.93913 5 7 5H8.59C8.97931 5.00004 9.36186 4.89289 9.69 4.69L11.39 3.69C11.7448 3.46527 12.1484 3.34197 12.56 3.33H15C16.0609 3.33 17.0783 3.75143 17.8284 4.50158C18.5786 5.25172 19 6.26913 19 7.33V16.67C19 17.7309 18.5786 18.7483 17.8284 19.4984C17.0783 20.2486 16.0609 20.67 15 20.67H7C5.93913 20.67 4.92172 20.2486 4.17157 19.4984C3.42143 18.7483 3 17.7309 3 16.67V9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Take Photo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="search-section">
            <form onSubmit={handleSearch}>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search for a product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-button">Search</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainSearch;





