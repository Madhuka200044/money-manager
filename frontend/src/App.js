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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getSettings } from './services/api';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [userProfile, setUserProfile] = useState({
    name: 'User',
    email: 'user@example.com'
  });

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }

    // Check for saved page preference
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage && ['dashboard', 'transactions', 'analytics', 'budget', 'savings', 'bills', 'settings'].includes(savedPage)) {
      setCurrentPage(savedPage);
    }

    // Fetch initial settings to get user profile
    const fetchSettings = async () => {
      try {
        const response = await getSettings();
        if (response.data) {
          setUserProfile({
            name: response.data.username || 'User',
            email: response.data.email || 'user@example.com'
          });

          // Also sync theme if backend has it different? 
          // Usually local preference wins or backend wins. Let's let backend win if we want sync across devices.
          if (response.data.theme) {
            const backendTheme = response.data.theme;
            setIsDarkMode(backendTheme === 'dark');
            document.documentElement.setAttribute('data-theme', backendTheme);
            localStorage.setItem('theme', backendTheme);
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings in App", error);
      }
    };
    fetchSettings();
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    const theme = newDarkMode ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };


  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const updateUserProfile = (newProfile) => {
    setUserProfile(prev => ({ ...prev, ...newProfile }));
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
        // Pass necessary props to Settings to update global state
        return <Settings
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          onProfileUpdate={updateUserProfile}
        />;
      default:
        return <Dashboard refreshKey={refreshKey} setRefreshKey={setRefreshKey} />;
    }
  };

  return (
    <div className="app">
      <ToastContainer />
      <Sidebar
        onNavigate={handleNavigation}
        currentPage={currentPage}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        userProfile={userProfile}
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;