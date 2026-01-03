import React, { useState } from 'react';
import { FiFileText } from 'react-icons/fi';
import FinancialCards from './FinancialCards';
import SpendingChart from './SpendingChart';
import TransactionsTable from './TransactionsTable';
import BudgetOverview from './BudgetOverview';
import QuickActions from './QuickActions';
import ExportPDFModal from './ExportPDFModal';

const Dashboard = ({ refreshKey, setRefreshKey }) => {
    const [exporting, setExporting] = useState(false);
    const [showExportModal, setShowExportModal] = useState(false);

    const handleTransactionAdded = () => {
        setRefreshKey(prev => prev + 1);
    };

    const handleExportPDF = async () => {
        setExporting(true);
        try {
            // Simulate PDF generation
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Create a mock PDF (in a real app, you'd use a PDF library)
            const report = generateExpenseReport();
            
            // Create and download the report as a PDF
            const blob = new Blob([report], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `expense-report-${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Show success message
            alert('Expense report generated successfully!');
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setExporting(false);
        }
    };

    const generateExpenseReport = () => {
        const today = new Date();
        let report = `=== EXPENSE REPORT ===\n\n`;
        report += `Generated: ${today.toLocaleDateString()} ${today.toLocaleTimeString()}\n`;
        report += `Report Period: Last 30 Days\n`;
        report += `================================\n\n`;
        report += `SUMMARY\n`;
        report += `-------\n`;
        report += `Total Income: $5,842.00\n`;
        report += `Total Expenses: $3,216.00\n`;
        report += `Net Balance: $2,626.00\n`;
        report += `Savings Rate: 45%\n\n`;
        report += `CATEGORY BREAKDOWN\n`;
        report += `------------------\n`;
        report += `Food & Dining: $450.00\n`;
        report += `Shopping: $320.00\n`;
        report += `Transportation: $180.00\n`;
        report += `Entertainment: $120.00\n`;
        report += `Bills & Utilities: $145.00\n`;
        report += `Other: $1,001.00\n\n`;
        report += `TOP TRANSACTIONS\n`;
        report += `----------------\n`;
        report += `1. Salary - $5,000.00\n`;
        report += `2. Grocery Shopping - $156.50\n`;
        report += `3. Freelance Project - $842.00\n`;
        report += `4. Restaurant Dinner - $65.50\n`;
        report += `5. Electric Bill - $89.99\n\n`;
        report += `RECOMMENDATIONS\n`;
        report += `---------------\n`;
        report += `• Consider reducing dining expenses by 15%\n`;
        report += `• Great job on savings - keep it up!\n`;
        report += `• Transportation costs are well within budget\n`;
        
        return report;
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
        </div>
    );
};

export default Dashboard;