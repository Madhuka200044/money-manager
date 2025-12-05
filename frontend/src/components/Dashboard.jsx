
import React, { useState } from 'react';
import FinancialCards from './FinancialCards';
import SpendingChart from './SpendingChart';
import TransactionsTable from './TransactionsTable';
import BudgetOverview from './BudgetOverview';
import QuickActions from './QuickActions';
import AddTransactionModal from './AddTransactionModal';

const Dashboard = () => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleTransactionAdded = () => {
        // Increment refresh key to trigger re-fetch in child components
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="dashboard">
            <AddTransactionModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onTransactionAdded={handleTransactionAdded}
            />
            
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Financial Dashboard</h1>
                    <p>Welcome back! Here's your financial overview.</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn-primary"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <span>+</span> Add Transaction
                    </button>
                    <button className="btn-secondary">⚙️ Settings</button>
                </div>
            </div>
            
            {/* Add a title for the financial summary section */}
            <div style={{ marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.3rem', fontWeight: '600', color: '#1F2937' }}>
                    Financial Summary
                </h2>
            </div>
            
            <FinancialCards key={refreshKey} />
            
            <div className="dashboard-content">
                <div className="left-column">
                    <SpendingChart key={refreshKey} />
                    <TransactionsTable key={refreshKey} />
                </div>
                
                <div className="right-column">
                    <BudgetOverview key={refreshKey} />
                    <QuickActions onTransactionAdded={handleTransactionAdded} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
