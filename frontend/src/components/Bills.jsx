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
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #E5E7EB',
                marginBottom: '2rem'
            }}>
                <h2 style={{ color: '#1F2937', marginBottom: '0.5rem' }}>Coming Soon!</h2>
                <p style={{ color: '#6B7280' }}>
                    Bill management features are under development.
                </p>
            </div>
        </div>
    );
};

export default Bills;