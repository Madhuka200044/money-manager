
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Budget from './components/Budget';
import Savings from './components/Savings';
import Bills from './components/Bills';
import Settings from './components/Settings';
import Analytics from './components/Analytics'; // Import the enhanced Analytics component
import './App.css';

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
                return <Transactions refreshKey={refreshKey} />;
            case 'analytics':
                return <Analytics />;
            case 'budget':
                return <Budget refreshKey={refreshKey} />;
            case 'savings':
                return <Savings refreshKey={refreshKey} />;
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
