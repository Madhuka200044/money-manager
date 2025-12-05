
import React from 'react';

const Settings = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Settings</h1>
                    <p>Customize your Money Manager experience</p>
                </div>
            </div>
            
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                border: '1px solid #E5E7EB'
            }}>
                <h2>Settings</h2>
                <p style={{ color: '#6B7280', marginTop: '0.5rem' }}>
                    Application settings and preferences will be available here.
                </p>
                <div style={{ marginTop: '2rem' }}>
                    <div style={{
                        padding: '1rem',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ fontWeight: '600', color: '#1F2937' }}>Profile Settings</div>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                            Update your personal information and preferences
                        </div>
                    </div>
                    
                    <div style={{
                        padding: '1rem',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ fontWeight: '600', color: '#1F2937' }}>Notification Settings</div>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                            Configure how you receive notifications
                        </div>
                    </div>
                    
                    <div style={{
                        padding: '1rem',
                        background: '#F9FAFB',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                    }}>
                        <div style={{ fontWeight: '600', color: '#1F2937' }}>Privacy & Security</div>
                        <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.25rem' }}>
                            Manage your privacy and security settings
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
