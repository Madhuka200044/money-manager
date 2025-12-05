
import React, { useState, useEffect } from 'react';

const Savings = () => {
    const [savingsGoal, setSavingsGoal] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('savingsGoal');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSavingsGoal(parsed);
            } catch (error) {
                console.error('Error parsing savings goal:', error);
            }
        }
    }, []);

    // Get safe amount value
    const getGoalAmount = () => {
        if (!savingsGoal || !savingsGoal.amount) return 0;
        return typeof savingsGoal.amount === 'number' ? savingsGoal.amount : 0;
    };

    // Get safe name value
    const getGoalName = () => {
        if (!savingsGoal || !savingsGoal.name) return 'Savings Goal';
        return savingsGoal.name;
    };

    // Get safe created date
    const getCreatedDate = () => {
        if (!savingsGoal || !savingsGoal.createdAt) return new Date();
        try {
            return new Date(savingsGoal.createdAt);
        } catch (error) {
            return new Date();
        }
    };

    const goalAmount = getGoalAmount();
    const goalName = getGoalName();
    const createdDate = getCreatedDate();

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Savings</h1>
                    <p>Track your savings goals and progress</p>
                </div>
            </div>
            
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E5E7EB',
                marginBottom: '2rem'
            }}>
                <h2>Your Savings Goal</h2>
                {goalAmount > 0 ? (
                    <div style={{
                        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                        padding: '1.5rem',
                        borderRadius: '10px',
                        marginTop: '1rem'
                    }}>
                        <div style={{ fontSize: '1.1rem', color: '#0369a1', fontWeight: '600' }}>
                            {goalName}
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0c4a6e', margin: '0.5rem 0' }}>
                            ${goalAmount.toFixed(2)}
                        </div>
                        <div style={{ color: '#64748b' }}>
                            Set on: {createdDate.toLocaleDateString()}
                        </div>
                    </div>
                ) : (
                    <div style={{
                        background: '#F9FAFB',
                        padding: '2rem',
                        borderRadius: '10px',
                        textAlign: 'center',
                        marginTop: '1rem'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎯</div>
                        <h3 style={{ color: '#4B5563' }}>No Savings Goal Set</h3>
                        <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
                            Set a savings goal from the Quick Actions on the Dashboard!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Savings;
