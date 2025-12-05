
import React, { useState } from 'react';
import { FiUser, FiBell, FiLock, FiGlobe, FiMoon, FiSave, FiEye, FiEyeOff, FiX } from 'react-icons/fi';

const Settings = () => {
    // User Profile State
    const [userProfile, setUserProfile] = useState({
        name: 'Dulan Madhuka',
        email: 'Dulanmadhuka@gmail.com',
        phone: '07122226666',
        currency: 'LKR',
        language: 'English'
    });

    // Notification Preferences
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        pushNotifications: true,
        transactionAlerts: true,
        budgetWarnings: true,
        weeklyReports: true,
        marketingEmails: false
    });

    // Privacy & Security
    const [privacy, setPrivacy] = useState({
        showAmounts: true,
        biometricLogin: false,
        autoLogout: 15, // minutes
        dataSharing: false
    });

    // Display Preferences
    const [display, setDisplay] = useState({
        theme: 'light', // light, dark, system
        compactMode: false,
        showAnimations: true,
        fontSize: 'medium' // small, medium, large
    });

    // Current Password State
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Loading state for save operations
    const [loading, setLoading] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    // Handle profile updates
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setUserProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle notification toggles
    const handleNotificationToggle = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Handle privacy toggles
    const handlePrivacyToggle = (key) => {
        setPrivacy(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    // Handle display changes
    const handleDisplayChange = (key, value) => {
        setDisplay(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Handle password change
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Save settings
    const saveSettings = async (section) => {
        setLoading(true);
        setSaveMessage('');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Save to localStorage based on section
            switch(section) {
                case 'profile':
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    break;
                case 'notifications':
                    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
                    break;
                case 'privacy':
                    localStorage.setItem('privacySettings', JSON.stringify(privacy));
                    break;
                case 'display':
                    localStorage.setItem('displaySettings', JSON.stringify(display));
                    break;
                case 'password':
                    if (passwords.newPassword !== passwords.confirmPassword) {
                        throw new Error('New passwords do not match');
                    }
                    if (passwords.newPassword.length < 8) {
                        throw new Error('Password must be at least 8 characters');
                    }
                    localStorage.setItem('passwordChanged', 'true');
                    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    break;
                default:
                    // Save all
                    localStorage.setItem('userProfile', JSON.stringify(userProfile));
                    localStorage.setItem('notificationSettings', JSON.stringify(notifications));
                    localStorage.setItem('privacySettings', JSON.stringify(privacy));
                    localStorage.setItem('displaySettings', JSON.stringify(display));
            }
            
            setSaveMessage(`${section === 'all' ? 'All' : section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setSaveMessage('');
            }, 3000);
            
        } catch (error) {
            setSaveMessage(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // Export data
    const exportData = () => {
        const allData = {
            userProfile,
            notifications,
            privacy,
            display,
            exportedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `money-manager-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Settings exported successfully!');
    };

    // Reset to defaults
    const resetToDefaults = (section) => {
        if (window.confirm(`Are you sure you want to reset ${section} settings to defaults?`)) {
            switch(section) {
                case 'notifications':
                    setNotifications({
                        emailNotifications: true,
                        pushNotifications: true,
                        transactionAlerts: true,
                        budgetWarnings: true,
                        weeklyReports: true,
                        marketingEmails: false
                    });
                    break;
                case 'privacy':
                    setPrivacy({
                        showAmounts: true,
                        biometricLogin: false,
                        autoLogout: 15,
                        dataSharing: false
                    });
                    break;
                case 'display':
                    setDisplay({
                        theme: 'light',
                        compactMode: false,
                        showAnimations: true,
                        fontSize: 'medium'
                    });
                    break;
                default:
                    break;
            }
            setSaveMessage(`${section} settings reset to defaults`);
        }
    };

    const getPrivacyDescription = (key) => {
        switch(key) {
            case 'showAmounts':
                return 'Display transaction amounts in dashboard';
            case 'biometricLogin':
                return 'Use fingerprint or face ID for login';
            case 'dataSharing':
                return 'Share anonymous usage data to improve app';
            default:
                return '';
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Settings</h1>
                    <p>Customize your Money Manager experience</p>
                </div>
                <div className="header-actions">
                    <button 
                        className="btn-secondary"
                        onClick={exportData}
                        style={{ gap: '0.5rem' }}
                    >
                        <FiGlobe /> Export Settings
                    </button>
                    <button 
                        className="btn-primary"
                        onClick={() => saveSettings('all')}
                        disabled={loading}
                        style={{ gap: '0.5rem' }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave /> Save All Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
            
            {saveMessage && (
                <div style={{
                    background: saveMessage.includes('Error') ? '#FEF2F2' : '#DCFCE7',
                    color: saveMessage.includes('Error') ? '#DC2626' : '#059669',
                    padding: '1rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    borderLeft: `4px solid ${saveMessage.includes('Error') ? '#DC2626' : '#059669'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{saveMessage}</span>
                    <button 
                        onClick={() => setSaveMessage('')}
                        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                    >
                        <FiX />
                    </button>
                </div>
            )}
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '2rem',
                marginBottom: '2rem'
            }}>
                {/* Profile Settings Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E5E7EB',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        paddingBottom: '1rem',
                        borderBottom: '2px solid #F3F4F6'
                    }}>
                        <FiUser size={24} style={{ color: '#4F46E5' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1F2937', margin: 0 }}>Profile Settings</h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={userProfile.name}
                                onChange={handleProfileChange}
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={userProfile.email}
                                onChange={handleProfileChange}
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={userProfile.phone}
                                onChange={handleProfileChange}
                                placeholder="Enter phone number"
                            />
                        </div>
                        <div className="form-group">
                            <label>Preferred Currency</label>
                            <select
                                name="currency"
                                value={userProfile.currency}
                                onChange={handleProfileChange}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="LKR">LKR (Rs)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                                <option value="CAD">CAD ($)</option>
                                <option value="AUD">AUD ($)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Language</label>
                            <select
                                name="language"
                                value={userProfile.language}
                                onChange={handleProfileChange}
                            >
                                <option value="English">English</option>
                                <option value="Spanish">Spanish</option>
                                <option value="French">French</option>
                                <option value="German">German</option>
                                <option value="Chinese">Chinese</option>
                            </select>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #E5E7EB'
                    }}>
                        <button 
                            className="btn-secondary"
                            onClick={() => resetToDefaults('profile')}
                        >
                            Reset Profile
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={() => saveSettings('profile')}
                            disabled={loading}
                        >
                            Save Profile
                        </button>
                    </div>
                </div>

                {/* Notification Settings Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E5E7EB',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        paddingBottom: '1rem',
                        borderBottom: '2px solid #F3F4F6'
                    }}>
                        <FiBell size={24} style={{ color: '#F59E0B' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1F2937', margin: 0 }}>Notification Settings</h2>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        {Object.entries(notifications).map(([key, value]) => (
                            <div key={key} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: '#F9FAFB',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB'
                            }}>
                                <div>
                                    <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                        {key.includes('email') ? 'Receive notifications via email' :
                                         key.includes('push') ? 'Receive push notifications' :
                                         key.includes('transaction') ? 'Get alerts for new transactions' :
                                         key.includes('budget') ? 'Warnings when approaching budget limits' :
                                         key.includes('weekly') ? 'Weekly financial summary reports' :
                                         'Marketing and promotional emails'}
                                    </div>
                                </div>
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={value}
                                        onChange={() => handleNotificationToggle(key)}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #E5E7EB'
                    }}>
                        <button 
                            className="btn-secondary"
                            onClick={() => resetToDefaults('notifications')}
                        >
                            Reset Notifications
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={() => saveSettings('notifications')}
                            disabled={loading}
                        >
                            Save Notifications
                        </button>
                    </div>
                </div>

                {/* Privacy & Security Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E5E7EB',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        paddingBottom: '1rem',
                        borderBottom: '2px solid #F3F4F6'
                    }}>
                        <FiLock size={24} style={{ color: '#EF4444' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1F2937', margin: 0 }}>Privacy & Security</h2>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        {Object.entries(privacy).map(([key, value]) => (
                            key === 'autoLogout' ? (
                                <div key={key} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: '#F9FAFB',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>Auto Logout Timer</div>
                                        <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                            Automatically log out after {value} minutes of inactivity
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <input
                                            type="range"
                                            min="1"
                                            max="60"
                                            value={value}
                                            onChange={(e) => setPrivacy(prev => ({ ...prev, autoLogout: parseInt(e.target.value) }))}
                                            style={{ width: '150px' }}
                                        />
                                        <span style={{ fontWeight: '600', minWidth: '30px' }}>{value}m</span>
                                    </div>
                                </div>
                            ) : (
                                <div key={key} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: '#F9FAFB',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>
                                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                            {getPrivacyDescription(key)}
                                        </div>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={value}
                                            onChange={() => handlePrivacyToggle(key)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            )
                        ))}
                        
                        {/* Password Change Section */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'stretch',
                            gap: '1rem',
                            padding: '1rem',
                            background: '#F9FAFB',
                            borderRadius: '8px',
                            border: '1px solid #E5E7EB'
                        }}>
                            <div>
                                <div style={{ fontWeight: '600', color: '#1F2937', marginBottom: '0.25rem' }}>Change Password</div>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                    Update your account password
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                                    <div key={field} className="form-group">
                                        <label>
                                            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                                        </label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type={showPassword[field.replace('Password', '').toLowerCase()] ? 'text' : 'password'}
                                                name={field}
                                                value={passwords[field]}
                                                onChange={handlePasswordChange}
                                                placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                                                style={{ paddingRight: '40px', width: '100%' }}
                                            />
                                            <button
                                                type="button"
                                                style={{
                                                    position: 'absolute',
                                                    right: '10px',
                                                    top: '50%',
                                                    transform: 'translateY(-50%)',
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#6B7280',
                                                    cursor: 'pointer',
                                                    padding: '4px'
                                                }}
                                                onClick={() => togglePasswordVisibility(field.replace('Password', '').toLowerCase())}
                                            >
                                                {showPassword[field.replace('Password', '').toLowerCase()] ? <FiEyeOff /> : <FiEye />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    className="btn-primary"
                                    onClick={() => saveSettings('password')}
                                    disabled={loading || !passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword}
                                    style={{ marginTop: '1rem' }}
                                >
                                    Update Password
                                </button>
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #E5E7EB'
                    }}>
                        <button 
                            className="btn-secondary"
                            onClick={() => resetToDefaults('privacy')}
                        >
                            Reset Privacy
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={() => saveSettings('privacy')}
                            disabled={loading}
                        >
                            Save Privacy
                        </button>
                    </div>
                </div>

                {/* Display Preferences Section */}
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '2rem',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #E5E7EB',
                    marginBottom: '2rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '2rem',
                        paddingBottom: '1rem',
                        borderBottom: '2px solid #F3F4F6'
                    }}>
                        <FiMoon size={24} style={{ color: '#8B5CF6' }} />
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1F2937', margin: 0 }}>Display Preferences</h2>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div className="form-group">
                            <label>Theme</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                {['light', 'dark', 'system'].map((theme) => (
                                    <label key={theme} style={{ cursor: 'pointer', flex: 1 }}>
                                        <input
                                            type="radio"
                                            name="theme"
                                            value={theme}
                                            checked={display.theme === theme}
                                            onChange={() => handleDisplayChange('theme', theme)}
                                            style={{ display: 'none' }}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            border: '2px solid #E5E7EB',
                                            background: 'white',
                                            transition: 'all 0.3s ease',
                                            borderColor: display.theme === theme ? '#4F46E5' : '#E5E7EB',
                                            background: display.theme === theme ? '#4F46E5' : 'white',
                                            color: display.theme === theme ? 'white' : 'inherit'
                                        }}>
                                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Font Size</label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                                {['small', 'medium', 'large'].map((size) => (
                                    <label key={size} style={{ cursor: 'pointer', flex: 1 }}>
                                        <input
                                            type="radio"
                                            name="fontSize"
                                            value={size}
                                            checked={display.fontSize === size}
                                            onChange={() => handleDisplayChange('fontSize', size)}
                                            style={{ display: 'none' }}
                                        />
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            fontWeight: '600',
                                            border: '2px solid #E5E7EB',
                                            background: 'white',
                                            transition: 'all 0.3s ease',
                                            borderColor: display.fontSize === size ? '#4F46E5' : '#E5E7EB',
                                            background: display.fontSize === size ? '#4F46E5' : 'white',
                                            color: display.fontSize === size ? 'white' : 'inherit'
                                        }}>
                                            {size.charAt(0).toUpperCase() + size.slice(1)}
                                            <div style={{ 
                                                marginTop: '0.5rem', 
                                                fontWeight: '700',
                                                fontSize: size === 'small' ? '12px' : size === 'medium' ? '14px' : '16px'
                                            }}>
                                                Aa
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Compact Mode</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={display.compactMode}
                                    onChange={() => handleDisplayChange('compactMode', !display.compactMode)}
                                />
                                <span className="slider"></span>
                            </label>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem' }}>
                                Reduce padding and spacing for more content
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Show Animations</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={display.showAnimations}
                                    onChange={() => handleDisplayChange('showAnimations', !display.showAnimations)}
                                />
                                <span className="slider"></span>
                            </label>
                            <div style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: '0.5rem' }}>
                                Enable UI animations and transitions
                            </div>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid #E5E7EB'
                    }}>
                        <button 
                            className="btn-secondary"
                            onClick={() => resetToDefaults('display')}
                        >
                            Reset Display
                        </button>
                        <button 
                            className="btn-primary"
                            onClick={() => saveSettings('display')}
                            disabled={loading}
                        >
                            Save Display
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
