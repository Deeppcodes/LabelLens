import React from "react";
import { Link } from "react-router-dom";
import LabelLensLogo from "../assets/LabelLens_Logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <img 
              src={LabelLensLogo}
              alt="LabelLens Logo" 
              className="logo-image"
            />
            <span className="logo-text">Label<span>Lens</span></span>
          </Link>
        </div>
        <div className="nav-items">
          <div className="nav-item">
            <Link to="/" className="nav-button">
              <span>Home</span>
            </Link>
          </div>
          <div className="nav-item">
            <Link to="/profile" className="nav-button">
              <span>Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
