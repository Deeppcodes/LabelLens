import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamCapture from '../components/WebcamCapture';
import '../styles/ScanProduct.css';

const ScanProduct = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [showWebcam, setShowWebcam] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      await analyzeImage(file);
    }
  };

  const handleWebcamCapture = async (imageSrc) => {
    setShowWebcam(false);
    setSelectedImage(imageSrc);
    // Convert base64 to blob for analysis
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    await analyzeImage(blob);
  };

  const analyzeImage = async (imageData) => {
    setAnalyzing(true);
    try {
      // Simulate API call to analyze image
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      setAnalysis({
        ingredients: [
          { name: 'Water', safety: 'Safe', description: 'Common base ingredient' },
          { name: 'Glycerin', safety: 'Safe', description: 'Moisturizing agent' },
          { name: 'Fragrance', safety: 'Caution', description: 'Potential allergen' }
        ],
        overallSafety: 'Moderate',
        recommendations: 'This product contains mostly safe ingredients with one potential allergen.'
      });
    } catch (error) {
      console.error('Analysis failed:', error);
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

  if (analysis) {
    return (
      <div className="analysis-results">
        <button className="back-button" onClick={() => setAnalysis(null)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>

        <div className="results-container">
          <h1>Analysis Results</h1>
          
          <div className="image-preview">
            <img src={selectedImage} alt="Analyzed product" />
          </div>

          <div className="safety-score">
            <h2>Overall Safety: {analysis.overallSafety}</h2>
            <p>{analysis.recommendations}</p>
          </div>

          <div className="ingredients-list">
            <h2>Ingredients Analysis</h2>
            {analysis.ingredients.map((ingredient, index) => (
              <div key={index} className={`ingredient-item ${ingredient.safety.toLowerCase()}`}>
                <h3>{ingredient.name}</h3>
                <span className="safety-badge">{ingredient.safety}</span>
                <p>{ingredient.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="scan-product-page">
      <button className="back-button" onClick={handleBackClick}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Home
      </button>

      {showWebcam ? (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcam(false)}
        />
      ) : (
        <div className="scan-product-container">
          <h1 className="scan-title">Scan Label</h1>
          
          <p className="scan-description">
            Upload a photo or scan your skincare product's ingredient list to analyze what's in it.
          </p>
          
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
        </div>
      )}
    </div>
  );
};

export default ScanProduct;
