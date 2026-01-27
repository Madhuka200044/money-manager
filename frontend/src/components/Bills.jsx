import React, { useState, useEffect } from 'react';
import { FiPlus, FiX, FiCheck, FiClock, FiAlertCircle } from 'react-icons/fi';
import { getBills, addBill, toggleBillStatus, deleteBill } from '../services/api';

const Bills = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newBill, setNewBill] = useState({
        description: '',
        amount: '',
        dueDate: '',
        category: 'Bills & Utilities',
        isPaid: false
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchBills();
    }, []);

    const fetchBills = async () => {
        try {
            setLoading(true);
            const response = await getBills();
            setBills(response.data || []);
        } catch (error) {
            console.error('Failed to fetch bills', error);
            // Use mock data if API fails
            const mockBills = generateMockBills();
            setBills(mockBills);
        } finally {
            setLoading(false);
        }
    };

    // Generate mock bills for demo
    const generateMockBills = () => {
        const categories = ['Bills & Utilities', 'Rent', 'Subscription', 'Insurance', 'Loan', 'Other'];
        const descriptions = {
            'Bills & Utilities': ['Electricity Bill', 'Water Bill', 'Internet Bill', 'Phone Bill'],
            'Rent': ['Monthly Rent', 'Apartment Maintenance'],
            'Subscription': ['Netflix', 'Spotify', 'Amazon Prime', 'YouTube Premium'],
            'Insurance': ['Health Insurance', 'Car Insurance', 'Life Insurance'],
            'Loan': ['Car Loan', 'Student Loan', 'Personal Loan'],
            'Other': ['Gym Membership', 'Newspaper', 'Magazine']
        };

        const mockBills = [];
        const now = new Date();

        for (let i = 0; i < 5; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);

            const category = categories[Math.floor(Math.random() * categories.length)];
            const categoryDescriptions = descriptions[category] || ['Bill'];
            const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];

            const amount = Math.floor(Math.random() * 500) + 50;
            const isPaid = Math.random() > 0.5;

            mockBills.push({
                id: i + 1,
                description,
                category,
                dueDate: date.toISOString().split('T')[0],
                amount,
                isPaid,
                createdAt: new Date().toISOString()
            });
        }

        return mockBills;
    };

    const handleAddBill = async (e) => {
        e.preventDefault();
        setError('');

        // Validate form
        if (!newBill.description.trim()) {
            setError('Description is required');
            return;
        }
        if (!newBill.amount || parseFloat(newBill.amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }
        if (!newBill.dueDate) {
            setError('Due date is required');
            return;
        }

        try {
            // Create bill object
            const billData = {
                description: newBill.description.trim(),
                category: newBill.category,
                dueDate: newBill.dueDate,
                amount: parseFloat(newBill.amount),
                isPaid: false,
                createdAt: new Date().toISOString()
            };

            console.log('Adding bill:', billData);

            // Try to add via API first
            try {
                const response = await addBill(billData);
                console.log('Bill added via API:', response.data);
            } catch (apiError) {
                console.log('API failed, using local storage');
                // If API fails, add to local storage
                const storedBills = JSON.parse(localStorage.getItem('bills') || '[]');
                const newBillWithId = {
                    ...billData,
                    id: Date.now()
                };
                storedBills.push(newBillWithId);
                localStorage.setItem('bills', JSON.stringify(storedBills));
            }

            // Reset form and close modal
            setNewBill({
                description: '',
                amount: '',
                dueDate: '',
                category: 'Bills & Utilities',
                isPaid: false
            });
            setShowAddModal(false);

            // Refresh bills list
            fetchBills();

        } catch (err) {
            console.error('Failed to add bill', err);
            setError(err.response?.data?.message || err.message || 'Failed to add bill');
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            // Try API first
            try {
                await toggleBillStatus(id);
            } catch (apiError) {
                console.log('API failed, updating locally');
                // Update in local storage
                const storedBills = JSON.parse(localStorage.getItem('bills') || '[]');
                const updatedBills = storedBills.map(bill =>
                    bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
                );
                localStorage.setItem('bills', JSON.stringify(updatedBills));
            }

            // Update local state
            setBills(prevBills =>
                prevBills.map(bill =>
                    bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
                )
            );

        } catch (error) {
            console.error('Failed to toggle bill status', error);
            alert('Failed to update bill status. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this bill?')) {
            try {
                // Try API first
                try {
                    await deleteBill(id);
                } catch (apiError) {
                    console.log('API failed, deleting locally');
                    // Delete from local storage
                    const storedBills = JSON.parse(localStorage.getItem('bills') || '[]');
                    const filteredBills = storedBills.filter(bill => bill.id !== id);
                    localStorage.setItem('bills', JSON.stringify(filteredBills));
                }

                // Update local state
                setBills(prevBills => prevBills.filter(bill => bill.id !== id));

            } catch (error) {
                console.error('Failed to delete bill', error);
                alert('Failed to delete bill. Please try again.');
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getDaysDue = (dueDate) => {
        const today = new Date();
        const due = new Date(dueDate);
        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`,
                class: 'overdue',
                icon: <FiAlertCircle />
            };
        }
        if (diffDays === 0) {
            return {
                text: 'Due today',
                class: 'due-soon',
                icon: <FiClock />
            };
        }
        if (diffDays <= 3) {
            return {
                text: `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`,
                class: 'due-soon',
                icon: <FiClock />
            };
        }
        if (diffDays <= 7) {
            return {
                text: `Due in ${diffDays} days`,
                class: '',
                icon: <FiClock />
            };
        }
        return {
            text: `Due in ${diffDays} days`,
            class: '',
            icon: null
        };
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Bills & Utilities':
                return '💡';
            case 'Rent':
                return '🏠';
            case 'Subscription':
                return '📱';
            case 'Insurance':
                return '🛡️';
            case 'Loan':
                return '💰';
            default:
                return '📄';
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Bills & Payments</h1>
                    <p>Track and manage your recurring bills</p>
                </div>
                <button
                    className="btn-primary"
                    onClick={() => setShowAddModal(true)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    <FiPlus /> Add New Bill
                </button>
            </div>

            {/* Stats Summary */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                        Total Bills
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-color)' }}>
                        {bills.length}
                    </div>
                </div>
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                        Pending
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#EF4444' }}>
                        {bills.filter(b => !b.isPaid).length}
                    </div>
                </div>
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                        Paid
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10B981' }}>
                        {bills.filter(b => b.isPaid).length}
                    </div>
                </div>
                <div style={{
                    background: 'var(--card-bg)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
                        Total Amount
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-color)' }}>
                        ${bills.reduce((sum, bill) => sum + bill.amount, 0).toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Add Bill Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content add-transaction-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h2>Add New Bill</h2>
                                <p className="modal-subtitle">Add a recurring bill or payment</p>
                            </div>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>
                                <FiX />
                            </button>
                        </div>

                        {error && (
                            <div className="error-message" style={{ marginBottom: '1rem' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAddBill}>
                            <div className="form-group">
                                <label className="section-label">Description</label>
                                <input
                                    type="text"
                                    value={newBill.description}
                                    onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
                                    placeholder="e.g., Electricity Bill, Netflix Subscription"
                                    required
                                    autoFocus
                                />
                            </div>

                            <div className="form-group">
                                <label className="section-label">Category</label>
                                <select
                                    value={newBill.category}
                                    onChange={(e) => setNewBill({ ...newBill, category: e.target.value })}
                                    required
                                >
                                    <option value="Bills & Utilities">Bills & Utilities</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Subscription">Subscription</option>
                                    <option value="Insurance">Insurance</option>
                                    <option value="Loan">Loan</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="section-label">Amount</label>
                                    <div className="amount-input-container">
                                        <span className="currency-symbol">$</span>
                                        <input
                                            type="number"
                                            value={newBill.amount}
                                            onChange={(e) => setNewBill({ ...newBill, amount: e.target.value })}
                                            placeholder="0.00"
                                            step="0.01"
                                            min="0.01"
                                            required
                                            className="amount-input"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="section-label">Due Date</label>
                                    <input
                                        type="date"
                                        value={newBill.dueDate}
                                        onChange={(e) => setNewBill({ ...newBill, dueDate: e.target.value })}
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn-secondary cancel-btn"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary add-btn"
                                >
                                    <FiPlus /> Add Bill
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bills List */}
            <div className="bills-list-container">
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '200px',
                        background: 'var(--card-bg)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div className="spinner" style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid rgba(79, 70, 229, 0.2)',
                            borderTopColor: 'var(--primary-color)'
                        }}></div>
                        <div style={{ marginLeft: '1rem', color: 'var(--text-light)' }}>
                            Loading bills...
                        </div>
                    </div>
                ) : bills.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'var(--card-bg)',
                        borderRadius: '12px',
                        border: '2px dashed var(--border-color)'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            margin: '0 auto 1.5rem',
                            borderRadius: '50%',
                            background: 'var(--light-color)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-light)',
                            fontSize: '2rem'
                        }}>
                            📄
                        </div>
                        <h3 style={{ color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                            No bills yet
                        </h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                            Add your first bill to start tracking payments
                        </p>
                        <button
                            className="btn-primary"
                            onClick={() => setShowAddModal(true)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                        >
                            <FiPlus /> Add Your First Bill
                        </button>
                    </div>
                ) : (
                    <div className="bills-grid">
                        {bills.map(bill => {
                            const dueStatus = getDaysDue(bill.dueDate);
                            return (
                                <div key={bill.id} className={`bill-item ${bill.isPaid ? 'paid' : ''}`}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: bill.isPaid ? 'rgba(16, 185, 129, 0.1)' : 'var(--light-color)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            color: bill.isPaid ? '#10B981' : 'var(--text-color)'
                                        }}>
                                            {getCategoryIcon(bill.category)}
                                        </div>
                                        <div className="bill-info">
                                            <h3>{bill.description}</h3>
                                            <div className="bill-meta">
                                                <span style={{
                                                    background: 'var(--light-color)',
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: 'var(--text-color)'
                                                }}>
                                                    {bill.category}
                                                </span>
                                                <span>•</span>
                                                <span className={`bill-status ${!bill.isPaid ? dueStatus.class : ''}`}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    {!bill.isPaid && dueStatus.icon}
                                                    {formatDate(bill.dueDate)} {!bill.isPaid && `(${dueStatus.text})`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bill-actions">
                                        <div className="bill-amount" style={{
                                            color: bill.isPaid ? '#10B981' : 'var(--text-color)',
                                            textDecoration: bill.isPaid ? 'line-through' : 'none'
                                        }}>
                                            ${bill.amount.toFixed(2)}
                                        </div>
                                        <button
                                            className={`btn-mark-paid ${bill.isPaid ? 'paid' : ''}`}
                                            onClick={() => handleToggleStatus(bill.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                minWidth: '120px',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            {bill.isPaid ? (
                                                <>
                                                    <FiCheck /> Paid
                                                </>
                                            ) : (
                                                'Mark as Paid'
                                            )}
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(bill.id)}
                                            title="Delete Bill"
                                        >
                                            ×
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Help Tips */}
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid var(--border-color)',
                marginTop: '2rem'
            }}>
                <h3 style={{ color: 'var(--text-color)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    💡 Tips for Managing Bills
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                }}>
                    <div style={{ padding: '1rem', background: 'var(--light-color)', borderRadius: '8px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                            Set Reminders
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            Mark bills due in next 3 days as "Due Soon" to stay on top of payments
                        </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--light-color)', borderRadius: '8px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                            Use Categories
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            Categorize bills to better understand your spending patterns
                        </div>
                    </div>
                    <div style={{ padding: '1rem', background: 'var(--light-color)', borderRadius: '8px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text-color)', marginBottom: '0.25rem' }}>
                            Auto-pay Setup
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            Consider setting up auto-pay for recurring bills to avoid late fees
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bills;