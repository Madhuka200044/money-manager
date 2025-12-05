
import React, { useState } from 'react';
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
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar 
        onNavigate={setCurrentPage}  // Make sure this is passed
        currentPage={currentPage}    // And this too
      />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
