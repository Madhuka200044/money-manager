
import React from 'react';

const Analytics = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Analytics</h1>
                    <p>Detailed financial analysis and insights</p>
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
                    Advanced analytics features are under development.
                </p>
            </div>
        </div>
    );
};

export default Analytics;
