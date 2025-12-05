
import React from 'react';

const Bills = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Bills</h1>
                    <p>Manage and track your recurring bills</p>
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
                <h2>Coming Soon!</h2>
                <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
                    Bill tracking features are under development.
                </p>
            </div>
        </div>
    );
};

export default Bills;
