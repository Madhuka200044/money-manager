import React, { useState } from 'react';
import { FiFileText, FiPlus } from 'react-icons/fi';
import FinancialCards from './FinancialCards';
import SpendingChart from './SpendingChart';
import TransactionsTable from './TransactionsTable';
import BudgetOverview from './BudgetOverview';
import QuickActions from './QuickActions';
import ExportPDFModal from './ExportPDFModal';
import AddTransactionModal from './AddTransactionModal';

const Dashboard = ({ refreshKey, setRefreshKey }) => {
    const [showExportModal, setShowExportModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [modalType, setModalType] = useState(null);

    const handleTransactionAdded = () => {
        setRefreshKey(prev => prev + 1);
        setShowAddModal(false);
    };

    const handleAddTransaction = () => {
        // Don't set a default type, let user choose in modal
        setModalType(null);
        setShowAddModal(true);
    };

    return (
        <div className="dashboard">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Financial Dashboard</h1>
                    <p>Welcome back! Here's your financial overview.</p>
                </div>
                <div className="header-actions">
                    {/* Single Add Transaction Button */}
                    <button 
                        className="btn-primary"
                        onClick={handleAddTransaction}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            minWidth: '160px'
                        }}
                    >
                        <FiPlus /> Add Transaction
                    </button>

                    {/* Export PDF Button */}
                    <button 
                        className="btn-secondary"
                        onClick={() => setShowExportModal(true)}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            minWidth: '140px'
                        }}
                    >
                        <FiFileText /> Export PDF
                    </button>
                </div>
            </div>
            
            {/* Financial Cards Section */}
            <FinancialCards key={refreshKey} />
            
            {/* Main Content Layout */}
            <div className="dashboard-content">
                {/* Left Column - Main Content */}
                <div className="left-column">
                    {/* Spending Chart */}
                    <div className="chart-container">
                        <h3>Spending Overview</h3>
                        <SpendingChart key={refreshKey} />
                    </div>
                    
                    {/* Recent Transactions */}
                    <div className="transactions-container">
                        <div className="transactions-title-section">
                            <h3>Recent Transactions</h3>
                            <button className="view-all-btn">
                                View All →
                            </button>
                        </div>
                        <TransactionsTable key={refreshKey} />
                    </div>
                </div>
                
                {/* Right Column - Sidebar Content */}
                <div className="right-column">
                    {/* Budget Overview */}
                    <div className="budget-overview">
                        <BudgetOverview key={refreshKey} />
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="quick-actions">
                        <QuickActions onTransactionAdded={handleTransactionAdded} />
                    </div>
                </div>
            </div>

            {/* Export PDF Modal */}
            {showExportModal && (
                <ExportPDFModal 
                    isOpen={showExportModal}
                    onClose={() => setShowExportModal(false)}
                />
            )}

            {/* Add Transaction Modal */}
            <AddTransactionModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                defaultType={modalType}
                onTransactionAdded={handleTransactionAdded}
            />
        </div>
    );
};

export default Dashboard;