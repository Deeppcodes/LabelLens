import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ScanProduct from './pages/ScanProduct';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/scan" element={<ScanProduct />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
