import React from "react";
import { useNavigate } from "react-router-dom";
import LabelLensLogo from "../assets/LabelLens_Logo.png";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate("/search");
  };

  const handleScanClick = () => {
    navigate("/scan");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <a href="/" className="logo-link">
            <img 
              src={LabelLensLogo}
              alt="LabelLens Logo" 
              className="logo-image"
            />
            <span className="logo-text">LabelLens</span>
          </a>
        </div>
        <div className="nav-items">
          <div className="nav-item">
            <button className="nav-button" onClick={handleSearchClick}>
              <span>Search</span>
            </button>
          </div>
          <div className="nav-item">
            <button className="nav-button" onClick={handleScanClick}>
              <span>Scan</span>
            </button>
          </div>
          <div className="nav-item">
            <button className="nav-button" onClick={handleProfileClick}>
              <span>Profile</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
