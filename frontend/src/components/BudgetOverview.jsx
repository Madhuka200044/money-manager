import React, { useState, useEffect } from 'react';
import { getBudgets } from '../services/api';

const BudgetOverview = () => {
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            const response = await getBudgets();
            setBudgets(response.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 90) return '#f44336'; // Red
        if (percentage >= 75) return '#ff9800'; // Orange
        return '#4caf50'; // Green
    };

    const getProgressWidth = (percentage) => {
        return Math.min(percentage, 100);
    };

    return (
        <div className="budget-overview">
            <div className="budget-header">
                <h3>Budget Overview</h3>
                <span className="budget-period">October 2023</span>
            </div>
            <div className="budget-grid">
                {budgets.map((budget, index) => (
                    <div key={index} className="budget-card">
                        <div className="budget-card-header">
                            <div className="budget-category">
                                <div className="category-icon">
                                    {budget.category === 'Food & Dining' ? '🍔' : 
                                     budget.category === 'Transportation' ? '🚗' :
                                     budget.category === 'Shopping' ? '🛍️' : '💡'}
                                </div>
                                <h4>{budget.category}</h4>
                            </div>
                            <span className="budget-percentage" style={{ color: getProgressColor(budget.percentage) }}>
                                {budget.percentage}%
                            </span>
                        </div>
                        
                        <div className="budget-progress">
                            <div className="progress-bar">
                                <div 
                                    className="progress-fill"
                                    style={{
                                        width: `${getProgressWidth(budget.percentage)}%`,
                                        backgroundColor: getProgressColor(budget.percentage)
                                    }}
                                ></div>
                            </div>
                            <div className="budget-stats">
                                <div className="budget-details">
                                    <span className="spent">${budget.spent} spent</span>
                                    <span className="limit">of ${budget.limit}</span>
                                </div>
                                <div className="budget-remaining">
                                    <span className="remaining-label">Remaining:</span>
                                    <span className="remaining-amount">${budget.remaining}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BudgetOverview;