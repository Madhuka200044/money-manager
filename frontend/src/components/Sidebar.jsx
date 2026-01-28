import React from 'react';
import {
    FiCreditCard, FiTarget, FiSettings, FiHome,
    FiBarChart2, FiTrendingUp, FiBell, FiUser,
    FiMoon, FiSun
} from 'react-icons/fi';

const Sidebar = ({ onNavigate, currentPage, isDarkMode, toggleTheme, userProfile }) => {
    const menuItems = [
        { icon: <FiHome />, label: 'Dashboard', id: 'dashboard' },
        { icon: <FiCreditCard />, label: 'Transactions', id: 'transactions' },
        { icon: <FiBarChart2 />, label: 'Analytics', id: 'analytics' },
        { icon: <FiTarget />, label: 'Budget', id: 'budget' },
        { icon: <FiTrendingUp />, label: 'Savings', id: 'savings' },
        { icon: <FiBell />, label: 'Bills', id: 'bills' },
        { icon: <FiSettings />, label: 'Settings', id: 'settings' },
    ];

    const handleNavigation = (pageId) => {
        if (onNavigate && typeof onNavigate === 'function') {
            onNavigate(pageId);
        }
    };

    return (
        <div className="sidebar">
            {/* App Logo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '3rem',
                padding: '0 1rem'
            }}>
                <div style={{
                    width: '52px',
                    height: '52px',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.4)'
                }}>
                    💰
                </div>
                <div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #fff, #a5b4fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        lineHeight: 1.2
                    }}>
                        Money Manager
                    </h1>
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#a5b4fc',
                        margin: '4px 0 0 0',
                        opacity: 0.8,
                        fontWeight: '500'
                    }}>
                        Your Financial Dashboard
                    </p>
                </div>
            </div>

            {/* Theme Toggle */}
            <div style={{
                marginBottom: '2rem',
                padding: '0 1rem'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '0.875rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
                    onClick={toggleTheme}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <div style={{
                            color: isDarkMode ? '#FBBF24' : '#a5b4fc',
                            fontSize: '1.2rem',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            {isDarkMode ? <FiSun /> : <FiMoon />}
                        </div>
                        <span style={{
                            color: '#D1D5DB',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                        }}>
                            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </span>
                    </div>
                    <div style={{
                        position: 'relative',
                        width: '52px',
                        height: '26px',
                        background: isDarkMode ? '#4F46E5' : 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '13px',
                        transition: 'all 0.3s ease',
                        border: isDarkMode ? 'none' : '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '3px',
                            left: isDarkMode ? '28px' : '3px',
                            width: '20px',
                            height: '20px',
                            background: 'white',
                            borderRadius: '50%',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                        }} />
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                        onClick={() => handleNavigation(item.id)}
                        style={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '0.875rem 1rem',
                            color: '#9CA3AF',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            transition: 'all 0.3s ease',
                            fontWeight: '500',
                            margin: '0.25rem 0'
                        }}
                    >
                        <span className="nav-icon" style={{
                            fontSize: '1.25rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {item.icon}
                        </span>
                        <span className="nav-label" style={{
                            fontSize: '0.95rem',
                            fontWeight: '600'
                        }}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </nav>

            {/* User Profile */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '1rem',
                right: '1rem',
                padding: '1.25rem',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
            }}
                onClick={() => handleNavigation('settings')}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'}
            >
                <div style={{
                    width: '44px',
                    height: '44px',
                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                }}>
                    {userProfile?.name
                        ? userProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        : 'U'}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{
                        color: 'white',
                        fontWeight: '700',
                        fontSize: '0.95rem',
                        marginBottom: '2px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '140px'
                    }}>
                        {userProfile?.name || 'User'}
                    </div>
                    <div style={{
                        color: '#a5b4fc',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '140px'
                    }}>
                        {userProfile?.email || 'Premium User'}
                    </div>
                </div>
            </div>
        </div>
    );
};

Sidebar.defaultProps = {
    onNavigate: () => console.warn('onNavigate not provided'),
    currentPage: 'dashboard',
    isDarkMode: false,
    toggleTheme: () => console.warn('toggleTheme not provided')
};

export default Sidebar;