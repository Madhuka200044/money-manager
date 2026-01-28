import React, { useState, useEffect } from 'react';
import { FiUser, FiLock, FiBell, FiCreditCard, FiDollarSign, FiGlobe, FiMoon, FiSun, FiSave, FiUpload, FiDownload, FiTrash2, FiAlertCircle, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { saveSettings, getSettings } from '../services/api';

const Settings = ({ isDarkMode, toggleTheme, onProfileUpdate }) => {
    const [settings, setSettings] = useState({
        profile: {
            name: 'Alex Johnson',
            email: 'alex.johnson@example.com',
            currency: 'USD',
            language: 'en'
        },
        preferences: {
            notifications: true,
            twoFactorAuth: false,
            autoBackup: true,
            budgetAlerts: true,
            spendingLimits: true,
            emailReports: true
        },
        display: {
            theme: isDarkMode ? 'dark' : 'light',
            compactMode: false,
            showCharts: true,
            showTips: true
        }
    });

    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                // Load from backend
                const response = await getSettings();
                if (response.data) {
                    // Merge backend settings with local structure if needed
                    // For now, we assume the backend returns the flat structure or we map it
                    // But since we created a flat backend model and the frontend is nested, we might need mapping.
                    // Let's implement a quick mapper if the backend returns a flat object.

                    const backendData = response.data;
                    // Check if it's the new flat structure
                    if (backendData.username) {
                        setSettings(prev => ({
                            profile: {
                                name: backendData.username || prev.profile.name,
                                email: backendData.email || prev.profile.email,
                                currency: backendData.currency || prev.profile.currency,
                                language: backendData.language || prev.profile.language
                            },
                            preferences: {
                                notifications: backendData.notifications ?? prev.preferences.notifications,
                                twoFactorAuth: backendData.twoFactorAuth ?? prev.preferences.twoFactorAuth,
                                autoBackup: backendData.autoBackup ?? prev.preferences.autoBackup,
                                budgetAlerts: backendData.budgetAlerts ?? prev.preferences.budgetAlerts,
                                spendingLimits: backendData.spendingLimits ?? prev.preferences.spendingLimits,
                                emailReports: backendData.emailReports ?? prev.preferences.emailReports
                            },
                            display: {
                                theme: backendData.theme || prev.display.theme,
                                compactMode: backendData.compactMode ?? prev.display.compactMode,
                                showCharts: backendData.showCharts ?? prev.display.showCharts,
                                showTips: backendData.showTips ?? prev.display.showTips
                            }
                        }));
                    }
                }
            } catch (error) {
                console.error("Failed to load settings from backend", error);
                // Fallback to local storage
                const savedSettings = localStorage.getItem('moneyManagerSettings');
                if (savedSettings) {
                    try {
                        setSettings(JSON.parse(savedSettings));
                    } catch (e) { console.error(e); }
                }
            }
        };
        loadSettings();
    }, []);

    // Sync theme from props
    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            display: {
                ...prev.display,
                theme: isDarkMode ? 'dark' : 'light'
            }
        }));
    }, [isDarkMode]);

    const handleSettingChange = (category, key, value) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }));
    };

    const handleSaveSettings = async () => {
        setLoading(true);
        // First save to LocalStorage for immediate persistence in browser
        localStorage.setItem('moneyManagerSettings', JSON.stringify(settings));

        try {
            // Map to flat backend structure
            const backendSettings = {
                username: settings.profile.name,
                email: settings.profile.email,
                currency: settings.profile.currency,
                language: settings.profile.language,
                notifications: settings.preferences.notifications,
                twoFactorAuth: settings.preferences.twoFactorAuth,
                autoBackup: settings.preferences.autoBackup,
                budgetAlerts: settings.preferences.budgetAlerts,
                spendingLimits: settings.preferences.spendingLimits,
                emailReports: settings.preferences.emailReports,
                theme: settings.display.theme,
                compactMode: settings.display.compactMode,
                showCharts: settings.display.showCharts,
                showTips: settings.display.showTips
            };

            await saveSettings(backendSettings);

            // Update parent state (this updates the sidebar name/email)
            if (onProfileUpdate) {
                onProfileUpdate({
                    name: settings.profile.name,
                    email: settings.profile.email
                });
            }

            // If theme changed, apply it immediately via the prop function if available, 
            // but the user might have just toggled the switch in the UI without saving yet.
            // The switch calls toggleTheme directly in the render method usually.
            // Let's check how the theme switch is implemented.

            toast.success('Settings saved successfully!', {
                position: "top-right",
                autoClose: 3000,
            });
        } catch (error) {
            console.error("Save error details:", error.response || error);
            const errorMessage = error.response?.data?.message || error.message || "Unknown error";
            toast.error(`Error saving settings: ${errorMessage}. Please restart your backend server to apply new features.`, {
                position: "top-right",
                autoClose: 7000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetSettings = () => {
        if (window.confirm('Are you sure you want to reset all settings to default?')) {
            setSettings({
                profile: {
                    name: 'Alex Johnson',
                    email: 'alex.johnson@example.com',
                    currency: 'USD',
                    language: 'en'
                },
                preferences: {
                    notifications: true,
                    twoFactorAuth: false,
                    autoBackup: true,
                    budgetAlerts: true,
                    spendingLimits: true,
                    emailReports: true
                },
                display: {
                    theme: isDarkMode ? 'dark' : 'light',
                    compactMode: false,
                    showCharts: true,
                    showTips: true
                }
            });
            toast.info('Settings reset to default', {
                position: "top-right",
                autoClose: 3000,
            });
        }
    };

    const exportSettings = () => {
        const dataStr = JSON.stringify(settings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `money-manager-settings-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        toast.info('Settings exported successfully!', {
            position: "top-right",
            autoClose: 3000,
        });
    };

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <FiUser /> },
        { id: 'preferences', label: 'Preferences', icon: <FiBell /> },
        { id: 'display', label: 'Display', icon: <FiSun /> },
        { id: 'security', label: 'Security', icon: <FiLock /> },
        { id: 'data', label: 'Data', icon: <FiDownload /> }
    ];

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Settings</h1>
                    <p>Manage your account preferences and settings</p>
                </div>
                <div className="header-actions">
                    <button
                        className="btn-secondary"
                        onClick={handleResetSettings}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FiTrash2 /> Reset All
                    </button>
                    <button
                        className="btn-primary"
                        onClick={handleSaveSettings}
                        disabled={loading}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Settings Container */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden'
            }}>
                {/* Tabs */}
                <div style={{
                    display: 'flex',
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--light-color)'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                padding: '1rem 1.5rem',
                                background: activeTab === tab.id ? 'var(--card-bg)' : 'transparent',
                                border: 'none',
                                borderRight: '1px solid var(--border-color)',
                                borderBottom: activeTab === tab.id ? '2px solid var(--primary-color)' : 'none',
                                color: activeTab === tab.id ? 'var(--primary-color)' : 'var(--text-color)',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div style={{ padding: '2rem' }}>
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--dark-color)' }}>Profile Settings</h2>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--dark-color)' }}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.profile.name}
                                        onChange={(e) => handleSettingChange('profile', 'name', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--card-bg)',
                                            color: 'var(--text-color)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--dark-color)' }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.profile.email}
                                        onChange={(e) => handleSettingChange('profile', 'email', e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--card-bg)',
                                            color: 'var(--text-color)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--dark-color)' }}>
                                            Currency
                                        </label>
                                        <select
                                            value={settings.profile.currency}
                                            onChange={(e) => handleSettingChange('profile', 'currency', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--card-bg)',
                                                color: 'var(--text-color)',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            <option value="USD">US Dollar (USD)</option>
                                            <option value="EUR">Euro (EUR)</option>
                                            <option value="GBP">British Pound (GBP)</option>
                                            <option value="JPY">Japanese Yen (JPY)</option>
                                            <option value="CAD">Canadian Dollar (CAD)</option>
                                            <option value="AUD">Australian Dollar (AUD)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--dark-color)' }}>
                                            Language
                                        </label>
                                        <select
                                            value={settings.profile.language}
                                            onChange={(e) => handleSettingChange('profile', 'language', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: '1px solid var(--border-color)',
                                                background: 'var(--card-bg)',
                                                color: 'var(--text-color)',
                                                fontSize: '1rem'
                                            }}
                                        >
                                            <option value="en">English</option>
                                            <option value="es">Spanish</option>
                                            <option value="fr">French</option>
                                            <option value="de">German</option>
                                            <option value="zh">Chinese</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Preferences Tab */}
                    {activeTab === 'preferences' && (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--dark-color)' }}>Preferences</h2>
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {Object.entries(settings.preferences).map(([key, value]) => (
                                    <div key={key} style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '1rem',
                                        background: 'var(--light-color)',
                                        borderRadius: '8px',
                                        border: '1px solid var(--border-color)'
                                    }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--dark-color)', textTransform: 'capitalize' }}>
                                                {key.replace(/([A-Z])/g, ' $1')}
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                                                {key === 'notifications' && 'Receive notifications for important updates'}
                                                {key === 'twoFactorAuth' && 'Enable two-factor authentication for extra security'}
                                                {key === 'autoBackup' && 'Automatically backup your data'}
                                                {key === 'budgetAlerts' && 'Get alerts when approaching budget limits'}
                                                {key === 'spendingLimits' && 'Notify when spending exceeds limits'}
                                                {key === 'emailReports' && 'Send weekly reports to your email'}
                                            </div>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={value}
                                                onChange={(e) => handleSettingChange('preferences', key, e.target.checked)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Display Tab */}
                    {activeTab === 'display' && (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--dark-color)' }}>Display Settings</h2>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'var(--light-color)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '8px',
                                            background: 'var(--card-bg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isDarkMode ? '#F59E0B' : '#374151'
                                        }}>
                                            {isDarkMode ? <FiMoon /> : <FiSun />}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--dark-color)' }}>
                                                Theme
                                            </div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                                {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                                            </div>
                                        </div>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={isDarkMode}
                                            onChange={toggleTheme}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>

                                {Object.entries(settings.display).map(([key, value]) => {
                                    if (key === 'theme') return null;
                                    return (
                                        <div key={key} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            background: 'var(--light-color)',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <div>
                                                <div style={{ fontWeight: '600', color: 'var(--dark-color)', textTransform: 'capitalize' }}>
                                                    {key.replace(/([A-Z])/g, ' $1')}
                                                </div>
                                                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>
                                                    {key === 'compactMode' && 'Use compact layout for better space utilization'}
                                                    {key === 'showCharts' && 'Show charts and graphs in dashboard'}
                                                    {key === 'showTips' && 'Show helpful tips and suggestions'}
                                                </div>
                                            </div>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => handleSettingChange('display', key, e.target.checked)}
                                                />
                                                <span className="slider"></span>
                                            </label>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Security Tab */}
                    {activeTab === 'security' && (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--dark-color)' }}>Security Settings</h2>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'var(--light-color)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '8px',
                                            background: 'var(--card-bg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--primary-color)',
                                            fontSize: '1.25rem'
                                        }}>
                                            <FiLock />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: 0, color: 'var(--dark-color)' }}>Change Password</h3>
                                            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                                Update your account password
                                            </p>
                                        </div>
                                        <button
                                            className="btn-primary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            onClick={() => toast.info('Password change feature coming soon')}
                                        >
                                            Change
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1.5rem',
                                    background: 'var(--light-color)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '8px',
                                            background: 'var(--card-bg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--primary-color)',
                                            fontSize: '1.25rem'
                                        }}>
                                            <FiCreditCard />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: 0, color: 'var(--dark-color)' }}>Two-Factor Authentication</h3>
                                            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                                Add an extra layer of security to your account
                                            </p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={settings.preferences.twoFactorAuth}
                                                onChange={(e) => handleSettingChange('preferences', 'twoFactorAuth', e.target.checked)}
                                            />
                                            <span className="slider"></span>
                                        </label>
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1.5rem',
                                    background: 'var(--light-color)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <h3 style={{ margin: '0 0 1rem 0', color: 'var(--dark-color)' }}>Active Sessions</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--dark-color)' }}>Current Session</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                                Chrome • Windows • Now
                                            </div>
                                        </div>
                                        <button
                                            className="btn-secondary"
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                            onClick={() => toast.info('Session management coming soon')}
                                        >
                                            Manage
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Data Tab */}
                    {activeTab === 'data' && (
                        <div>
                            <h2 style={{ marginBottom: '1.5rem', color: 'var(--dark-color)' }}>Data Management</h2>
                            <div style={{ display: 'grid', gap: '1.5rem' }}>
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'var(--light-color)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '8px',
                                            background: 'var(--card-bg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--primary-color)',
                                            fontSize: '1.25rem'
                                        }}>
                                            <FiDownload />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: 0, color: 'var(--dark-color)' }}>Export Data</h3>
                                            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                                Download all your data as JSON file
                                            </p>
                                        </div>
                                        <button
                                            className="btn-primary"
                                            onClick={exportSettings}
                                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                                        >
                                            Export
                                        </button>
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1.5rem',
                                    background: 'var(--light-color)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '8px',
                                            background: 'var(--card-bg)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--primary-color)',
                                            fontSize: '1.25rem'
                                        }}>
                                            <FiUpload />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: 0, color: 'var(--dark-color)' }}>Import Data</h3>
                                            <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                                                Import data from JSON file
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            id="importFile"
                                            accept=".json"
                                            style={{ display: 'none' }}
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onload = (event) => {
                                                        try {
                                                            const imported = JSON.parse(event.target.result);
                                                            setSettings(imported);
                                                            toast.success('Settings imported successfully!');
                                                        } catch (error) {
                                                            toast.error('Invalid settings file');
                                                        }
                                                    };
                                                    reader.readAsText(file);
                                                }
                                            }}
                                        />
                                        <label htmlFor="importFile" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                            Import
                                        </label>
                                    </div>
                                </div>

                                <div style={{
                                    padding: '1.5rem',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: '12px',
                                    border: '1px solid rgba(239, 68, 68, 0.3)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '8px',
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#EF4444',
                                            fontSize: '1.25rem'
                                        }}>
                                            <FiAlertCircle />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: 0, color: '#EF4444' }}>Delete All Data</h3>
                                            <p style={{ margin: '0.25rem 0 0 0', color: '#EF4444', fontSize: '0.875rem', opacity: 0.8 }}>
                                                This will permanently delete all your data. This action cannot be undone.
                                            </p>
                                        </div>
                                        <button
                                            className="btn-secondary"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.875rem',
                                                background: '#EF4444',
                                                color: 'white',
                                                border: 'none'
                                            }}
                                            onClick={() => {
                                                if (window.confirm('Are you absolutely sure? This will delete ALL your data permanently!')) {
                                                    localStorage.clear();
                                                    toast.error('All data deleted successfully');
                                                    window.location.reload();
                                                }
                                            }}
                                        >
                                            Delete All
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* App Info */}
            <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'var(--card-bg)',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    Money Manager v1.0.0 • © 2024 Money Manager Team
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <button
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => toast.info('Privacy policy coming soon')}
                    >
                        Privacy Policy
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => toast.info('Terms of service coming soon')}
                    >
                        Terms of Service
                    </button>
                    <button
                        className="btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => window.location.href = 'mailto:support@money-manager.com'}
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;