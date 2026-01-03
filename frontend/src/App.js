import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budget from './components/Budget';
import Savings from './components/Savings';
import Bills from './components/Bills';
import Settings from './components/Settings';
import './App.css';

// Create a placeholder Analytics component since it's missing
const Analytics = () => (
  <div className="dashboard">
    <div className="dashboard-header">
      <div className="header-content">
        <h1>Analytics</h1>
        <p>Detailed financial analytics and insights</p>
      </div>
    </div>
    <div style={{
      background: 'white',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      border: '1px solid #E5E7EB',
      marginBottom: '2rem'
    }}>
      <h2 style={{ color: '#1F2937', marginBottom: '0.5rem' }}>Coming Soon!</h2>
      <p style={{ color: '#6B7280' }}>
        Analytics features are under development.
      </p>
    </div>
  </div>
);

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleTransactionAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'budget':
        return <Budget />;
      case 'savings':
        return <Savings />;
      case 'bills':
        return <Bills />;
      case 'settings':
        return <Settings />;
      case 'dashboard':
      default:
        return (
          <Dashboard 
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            refreshKey={refreshKey}
            setRefreshKey={setRefreshKey}
            onTransactionAdded={handleTransactionAdded}
          />
        );
    }
  };

  return (
    <div className="app">
      <Sidebar 
        onNavigate={setCurrentPage}
        currentPage={currentPage}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;