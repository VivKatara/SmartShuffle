import React from 'react';
import logo from './logo.svg';
import './App.css';
import Data from './Data.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Welcome to SmartShuffle Data! 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
        </a>
        <Data />
      </header>
    </div>
  );
}

export default App;
