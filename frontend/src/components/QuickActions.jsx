
import React, { useState, useEffect } from 'react';
import { FiPlus, FiFileText, FiTarget, FiDownload, FiBarChart, FiSave, FiX, FiTrendingUp } from 'react-icons/fi';
import AddTransactionModal from './AddTransactionModal';
import { getTransactions, getBudgets, getDashboardStats } from '../services/api';

// Simple SetGoalModal component defined in the same file
const SetGoalModal = ({ isOpen, onClose, onGoalSet, currentSavings = 0 }) => {
    const [goalAmount, setGoalAmount] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!goalAmount || isNaN(parseFloat(goalAmount))) {
            setError('Please enter a valid amount');
            return;
        }
        
        onGoalSet(parseFloat(goalAmount));
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Set Savings Goal</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Current Savings: ${currentSavings.toFixed(2)}</label>
                    </div>
                    
                    <div className="form-group">
                        <label>Goal Amount</label>
                        <div className="amount-input-container">
                            <span className="currency-symbol">$</span>
                            <input
                                type="number"
                                value={goalAmount}
                                onChange={(e) => setGoalAmount(e.target.value)}
                                placeholder="Enter target amount"
                                className="amount-input"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary">
                            Set Goal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const QuickActions = ({ onTransactionAdded }) => {
    const [modalType, setModalType] = useState(null);
    const [goalModalOpen, setGoalModalOpen] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);
    const [currentSavings, setCurrentSavings] = useState(0);

    useEffect(() => {
        fetchCurrentSavings();
    }, []);

    const fetchCurrentSavings = async () => {
        try {
            const response = await getDashboardStats();
            setCurrentSavings(response.data?.monthlySavings || 0);
        } catch (error) {
            console.error('Error fetching savings:', error);
        }
    };

    const handleGenerateReport = async () => {
        setLoadingAction('reports');
        try {
            const transactionsResponse = await getTransactions();
            const budgetsResponse = await getBudgets();
            
            const transactions = transactionsResponse.data || [];
            const budgets = budgetsResponse.data || [];
            
            const report = generateReport(transactions, budgets);
            
            const blob = new Blob([report], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `financial-report-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            alert('Report generated and downloaded successfully!');
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Failed to generate report. Please try again.');
        } finally {
            setLoadingAction(null);
        }
    };

    const generateReport = (transactions, budgets) => {
        const now = new Date();
        let report = `FINANCIAL REPORT\n`;
        report += `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n`;
        report += `========================================\n\n`;
        
        report += `SUMMARY\n`;
        report += `-------\n`;
        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);
        const totalExpenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const balance = totalIncome - totalExpenses;
        
        report += `Total Income: $${totalIncome.toFixed(2)}\n`;
        report += `Total Expenses: $${totalExpenses.toFixed(2)}\n`;
        report += `Balance: $${balance.toFixed(2)}\n\n`;
        
        report += `RECENT TRANSACTIONS (Last 10)\n`;
        report += `------------------------------\n`;
        const recentTransactions = [...transactions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 10);
        
        recentTransactions.forEach((t, index) => {
            report += `${index + 1}. ${t.description} (${t.type})\n`;
            report += `   Category: ${t.category}\n`;
            report += `   Date: ${new Date(t.date).toLocaleDateString()}\n`;
            report += `   Amount: ${t.type === 'INCOME' ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)}\n\n`;
        });
        
        if (budgets.length > 0) {
            report += `BUDGET OVERVIEW\n`;
            report += `---------------\n`;
            budgets.forEach(budget => {
                const percentage = budget.percentage || 0;
                const status = percentage >= 100 ? 'OVER BUDGET' : 
                              percentage >= 80 ? 'WARNING' : 'ON TRACK';
                report += `• ${budget.category}: $${budget.spent || 0} / $${budget.limit || 0} (${percentage}%) - ${status}\n`;
            });
        }
        
        return report;
    };

    const handleSetGoal = () => {
        setGoalModalOpen(true);
    };

   const handleGoalSet = (amount) => {
    // Make sure we're saving valid data
    const goalData = {
        amount: parseFloat(amount) || 0,
        name: 'Monthly Savings Goal', // Add a default name
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('savingsGoal', JSON.stringify(goalData));
    
    // Calculate percentage safely
    const percentage = goalData.amount > 0 ? 
        Math.round((currentSavings / goalData.amount) * 100) : 0;
    
    alert(`Savings goal set to $${goalData.amount.toFixed(2)}\n\nCurrent progress: $${currentSavings.toFixed(2)} (${percentage}%)`);
    
    if (onTransactionAdded) {
        onTransactionAdded();
    }
};

    const handleExportData = async () => {
        setLoadingAction('export');
        try {
            const response = await getTransactions();
            const transactions = response.data || [];
            
            if (transactions.length === 0) {
                alert('No transactions to export.');
                setLoadingAction(null);
                return;
            }
            
            const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
            const csvRows = [
                headers.join(','),
                ...transactions.map(t => [
                    t.date,
                    `"${t.description.replace(/"/g, '""')}"`,
                    t.category,
                    t.type,
                    t.type === 'INCOME' ? t.amount : -t.amount
                ].join(','))
            ];
            
            const csvContent = csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            alert(`Exported ${transactions.length} transactions to CSV successfully!`);
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Failed to export data. Please try again.');
        } finally {
            setLoadingAction(null);
        }
    };

    const handleBackup = async () => {
        setLoadingAction('backup');
        try {
            const transactionsResponse = await getTransactions();
            const budgetsResponse = await getBudgets();
            
            const backupData = {
                timestamp: new Date().toISOString(),
                transactions: transactionsResponse.data || [],
                budgets: budgetsResponse.data || [],
                metadata: {
                    app: 'Money Manager',
                    version: '1.0.0',
                    totalTransactions: (transactionsResponse.data || []).length,
                    totalBudgets: (budgetsResponse.data || []).length
                }
            };
            
            const jsonString = JSON.stringify(backupData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `money-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            alert('Backup created successfully! Your data has been saved to a JSON file.');
        } catch (error) {
            console.error('Error creating backup:', error);
            alert('Failed to create backup. Please try again.');
        } finally {
            setLoadingAction(null);
        }
    };

    const actions = [
        { 
            icon: <FiPlus />, 
            label: 'Add Income', 
            color: '#4CAF50',
            description: 'Record new income',
            onClick: () => setModalType('INCOME')
        },
        { 
            icon: <FiPlus />, 
            label: 'Add Expense', 
            color: '#F44336',
            description: 'Record new expense',
            onClick: () => setModalType('EXPENSE')
        },
        { 
            icon: <FiBarChart />, 
            label: 'View Reports', 
            color: '#2196F3',
            description: 'Generate reports',
            onClick: handleGenerateReport,
            loading: loadingAction === 'reports'
        },
        { 
            icon: <FiTarget />, 
            label: 'Set Goal', 
            color: '#9C27B0',
            description: 'Set savings goal',
            onClick: handleSetGoal
        },
        { 
            icon: <FiFileText />, 
            label: 'Export Data', 
            color: '#FF9800',
            description: 'Export to CSV',
            onClick: handleExportData,
            loading: loadingAction === 'export'
        },
        { 
            icon: <FiSave />, 
            label: 'Backup', 
            color: '#607D8B',
            description: 'Create backup',
            onClick: handleBackup,
            loading: loadingAction === 'backup'
        },
    ];

    const handleModalClose = () => {
        setModalType(null);
        if (onTransactionAdded) {
            onTransactionAdded();
        }
    };
    

    return (
        <>
            <AddTransactionModal
                isOpen={modalType !== null}
                onClose={handleModalClose}
                defaultType={modalType}
                onTransactionAdded={onTransactionAdded}
            />
            
            <SetGoalModal
                isOpen={goalModalOpen}
                onClose={() => setGoalModalOpen(false)}
                onGoalSet={handleGoalSet}
                currentSavings={currentSavings}
            />
            
            <div className="quick-actions">
                <div className="actions-header">
                    <h3>Quick Actions</h3>
                    <p>Common tasks at your fingertips</p>
                </div>
                <div className="actions-grid">
                    {actions.map((action, index) => (
                        <button 
                            key={index} 
                            className="action-btn"
                            onClick={action.onClick}
                            disabled={action.loading}
                            style={{ 
                                borderColor: action.color,
                                backgroundColor: `${action.color}10`
                            }}
                        >
                            <span className="action-icon" style={{ color: action.color }}>
                                {action.loading ? (
                                    <div className="spinner" style={{ 
                                        width: '16px', 
                                        height: '16px', 
                                        border: `2px solid ${action.color}20`,
                                        borderTopColor: action.color 
                                    }}></div>
                                ) : action.icon}
                            </span>
                            <div className="action-content">
                                <span className="action-label">
                                    {action.loading ? 'Processing...' : action.label}
                                </span>
                                <span className="action-description">{action.description}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
};

export default QuickActions;
