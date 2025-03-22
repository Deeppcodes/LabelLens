import React from 'react';
import '../styles/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Understand Your Products Better</h1>
        <p>Scan product labels to learn about ingredients and their safety</p>
        
        <div className="scan-options">
          <div className="scan-section">
            <h2>Scan Label</h2>
            <div className="scan-buttons">
              <button className="scan-button">
                <svg>...</svg>
                Upload Image
              </button>
              <button className="scan-button">
                <svg>...</svg>
                Take Photo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


