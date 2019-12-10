import React from 'react';
import logo from './logo.svg';
import './App.css';
import Data from './Data.js';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          AYOOOO welcome to our data visualization site! 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          See more 
        </a>
        <Data />
        <p>
          blah blah
        </p>
      </header>
    </div>
  );
}

export default App;
