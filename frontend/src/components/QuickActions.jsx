import React, { useState } from 'react';
import { FiPlus, FiFileText, FiTarget, FiDownload, FiBarChart } from 'react-icons/fi';
import AddTransactionModal from './AddTransactionModal';

const QuickActions = ({ onTransactionAdded }) => {
    const [modalType, setModalType] = useState(null);

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
            onClick: () => alert('Reports feature coming soon!')
        },
        { 
            icon: <FiTarget />, 
            label: 'Set Goal', 
            color: '#9C27B0',
            description: 'Set savings goal',
            onClick: () => alert('Set goal feature coming soon!')
        },
        { 
            icon: <FiFileText />, 
            label: 'Export Data', 
            color: '#FF9800',
            description: 'Export to CSV',
            onClick: () => alert('Export feature coming soon!')
        },
        { 
            icon: <FiDownload />, 
            label: 'Backup', 
            color: '#607D8B',
            description: 'Create backup',
            onClick: () => alert('Backup feature coming soon!')
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
                            style={{ 
                                borderColor: action.color,
                                backgroundColor: `${action.color}10`
                            }}
                        >
                            <span className="action-icon" style={{ color: action.color }}>
                                {action.icon}
                            </span>
                            <div className="action-content">
                                <span className="action-label">{action.label}</span>
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