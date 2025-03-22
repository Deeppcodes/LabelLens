import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <a href="/" className="logo-text">LabelLens</a>
        </div>
        <div className="nav-items">
          <div className="nav-item">
            <button className="nav-button">
              <span>Search</span>
            </button>
          </div>
          <div className="nav-item">
            <button className="nav-button">
              <span>Scan</span>
            </button>
          </div>
          <div className="nav-item">
            <button className="nav-button">
              <span>Ingredients</span>
            </button>
          </div>
          <div className="nav-item">
            <button className="nav-button">
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
