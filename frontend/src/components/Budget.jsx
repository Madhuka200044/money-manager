
import React from 'react';
import BudgetOverview from './BudgetOverview';

const Budget = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Budget</h1>
                    <p>Manage your budget categories and limits</p>
                </div>
            </div>
            <BudgetOverview />
        </div>
    );
};

export default Budget;
