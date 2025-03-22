import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="main-content">
        <Hero />
      </div>
    </div>
  );
}

export default App;