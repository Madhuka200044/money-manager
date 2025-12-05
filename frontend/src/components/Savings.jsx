
import React, { useState, useEffect } from 'react';

const Savings = () => {
    const [savingsGoal, setSavingsGoal] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('savingsGoal');
        if (saved) {
            setSavingsGoal(JSON.parse(saved));
        }
    }, []);

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
                {savingsGoal ? (
                    <div style={{
                        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                        padding: '1.5rem',
                        borderRadius: '10px',
                        marginTop: '1rem'
                    }}>
                        <div style={{ fontSize: '1.1rem', color: '#0369a1', fontWeight: '600' }}>
                            {savingsGoal.name || 'Savings Goal'}
                        </div>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#0c4a6e', margin: '0.5rem 0' }}>
                            ${savingsGoal.amount.toFixed(2)}
                        </div>
                        <div style={{ color: '#64748b' }}>
                            Set on: {new Date(savingsGoal.createdAt).toLocaleDateString()}
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
