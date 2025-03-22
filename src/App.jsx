import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScanProduct from './pages/ScanProduct';

const AppContent = () => {
  const location = useLocation();
  const showNavbar = location.pathname !== '/scan';

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/scan" element={<ScanProduct />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;

