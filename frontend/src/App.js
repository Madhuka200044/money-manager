import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Analytics from './components/Analytics';
import Budget from './components/Budget';
import Savings from './components/Savings';
import Bills from './components/Bills';
import Settings from './components/Settings';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    
    // Check for saved page preference
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage && ['dashboard', 'transactions', 'analytics', 'budget', 'savings', 'bills', 'settings'].includes(savedPage)) {
      setCurrentPage(savedPage);
    }
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard refreshKey={refreshKey} setRefreshKey={setRefreshKey} />;
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'budget':
        return <Budget />;
      case 'savings':
        return <Savings refreshKey={refreshKey} />;
      case 'bills':
        return <Bills />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard refreshKey={refreshKey} setRefreshKey={setRefreshKey} />;
    }
  };

  return (
    <div className="app">
      <Sidebar 
        onNavigate={handleNavigation} 
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