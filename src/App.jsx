import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import MainSearch from './pages/MainSearch';
import Profile from './pages/Profile';
import Search from './pages/Search';
import ScanResults from './pages/ScanResults';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<MainSearch />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/scan-results" element={<ScanResults />} />
          </Routes>
        </div>
        
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">Label<span>Lens</span></div>
            <div className="footer-copyright">© 2025 All rights reserved</div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;

