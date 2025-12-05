import React from 'react';
import { 
    FiCreditCard, FiPieChart, FiTarget, 
    FiDollarSign, FiFileText, FiSettings 
} from 'react-icons/fi';

const Sidebar = () => {
    const menuItems = [
        { icon: <FiCreditCard />, label: 'Dashboard', active: true },
        { icon: <FiDollarSign />, label: 'Transactions' },
        { icon: <FiPieChart />, label: 'Analytics' },
        { icon: <FiTarget />, label: 'Budget' },
        { icon: <FiDollarSign />, label: 'Savings' },
        { icon: <FiFileText />, label: 'Bills' },
        { icon: <FiSettings />, label: 'Settings' },
    ];

    return (
        <div className="sidebar">
            <h2 className="sidebar-title">Money Manager</h2>
            <nav className="sidebar-nav">
                {menuItems.map((item, index) => (
                    <a 
                        key={index} 
                        href="#" 
                        className={`nav-item ${item.active ? 'active' : ''}`}
                        onClick={(e) => e.preventDefault()}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </a>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;