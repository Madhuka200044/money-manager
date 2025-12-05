import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

// Get the root element
const rootElement = document.getElementById('root');

// Check if the element exists
if (!rootElement) {
  console.error('Root element not found! Check if index.html has <div id="root"></div>');
  throw new Error('Root element not found!');
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);