
import React from 'react';
import { 
    FiCreditCard, FiPieChart, FiTarget, 
    FiDollarSign, FiFileText, FiSettings,
    FiHome, FiBarChart2, FiTrendingUp,
    FiBell, FiUser
} from 'react-icons/fi';

const Sidebar = ({ onNavigate, currentPage }) => {
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
        } else {
            console.error('onNavigate is not a function or not provided');
            // Fallback: Reload the page or show error
            alert(`Would navigate to: ${pageId}`);
        }
    };

    return (
        <div className="sidebar">
            <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                marginBottom: '2rem',
                paddingLeft: '1rem',
                cursor: 'pointer'
            }} onClick={() => handleNavigation('dashboard')}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.8rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
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
                            borderRadius: '8px',
                            transition: 'all 0.3s ease',
                            fontWeight: '500'
                        }}
                    >
                        <span className="nav-icon" style={{ 
                            fontSize: '1.2rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {item.icon}
                        </span>
                        <span className="nav-label" style={{ fontSize: '0.95rem' }}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </nav>
            
            {/* User profile at bottom */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '1rem',
                right: '1rem',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer'
            }} onClick={() => handleNavigation('settings')}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <FiUser size={20} />
                </div>
                <div>
                    <div style={{ 
                        color: 'white', 
                        fontWeight: '600',
                        fontSize: '0.9rem'
                    }}>
                        John Doe
                    </div>
                    <div style={{ 
                        color: '#9CA3AF', 
                        fontSize: '0.8rem',
                        marginTop: '2px'
                    }}>
                        Premium User
                    </div>
                </div>
            </div>
        </div>
    );
};

// Add default props for safety
Sidebar.defaultProps = {
    onNavigate: () => console.warn('onNavigate not provided'),
    currentPage: 'dashboard'
};

export default Sidebar;
