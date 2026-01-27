import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiPieChart, FiDollarSign } from 'react-icons/fi';
import { getBudgets, addBudget, updateBudget, deleteBudget } from '../services/api';

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentBudget, setCurrentBudget] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        category: '',
        allocatedAmount: '',
        spentAmount: 0 // Default to 0 for new budgets
    });

    useEffect(() => {
        fetchBudgets();
    }, []);

    const fetchBudgets = async () => {
        try {
            setLoading(true);
            const response = await getBudgets();
            setBudgets(response.data || []);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const openAddModal = () => {
        setEditMode(false);
        setFormData({
            category: '',
            allocatedAmount: '',
            spentAmount: 0
        });
        setShowModal(true);
    };

    const openEditModal = (budget) => {
        setEditMode(true);
        setCurrentBudget(budget);
        setFormData({
            category: budget.category,
            allocatedAmount: budget.allocatedAmount || budget.limit, // Handle both formats if legacy data exists
            spentAmount: budget.spentAmount || budget.spent || 0
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const budgetPayload = {
                category: formData.category,
                allocatedAmount: parseFloat(formData.allocatedAmount),
                spentAmount: parseFloat(formData.spentAmount)
            };

            if (editMode && currentBudget) {
                await updateBudget(currentBudget.id, budgetPayload);
                alert('Budget updated successfully!');
            } else {
                // Check for duplicate category locally
                const exists = budgets.some(b => b.category === formData.category);
                if (exists) {
                    alert(`A budget for ${formData.category} already exists. Please edit the existing one.`);
                    return;
                }

                await addBudget(budgetPayload);
                alert('Budget created successfully!');
            }

            setShowModal(false);
            fetchBudgets();
        } catch (error) {
            console.error('Error saving budget:', error);
            alert('Failed to save budget. Please try again.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this budget?')) {
            try {
                await deleteBudget(id);
                fetchBudgets();
            } catch (error) {
                console.error('Error deleting budget:', error);
                alert('Failed to delete budget.');
            }
        }
    };

    const getProgressColor = (percentage) => {
        if (percentage >= 100) return '#EF4444'; // Red (Over budget)
        if (percentage >= 85) return '#F59E0B'; // Orange (Warning)
        return '#10B981'; // Green (Safe)
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Budget Management</h1>
                    <p>Track your spending limits and goals</p>
                </div>
                <div className="header-actions">
                    <button
                        onClick={openAddModal}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FiPlus /> New Budget
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="budget-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                    {budgets.length === 0 ? (
                        <div style={{
                            background: 'var(--card-bg)',
                            padding: '3rem',
                            textAlign: 'center',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                            <h3>No Budgets Set</h3>
                            <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem' }}>
                                Create a budget to start tracking your expenses.
                            </p>
                            <button onClick={openAddModal} className="btn-primary">
                                Create First Budget
                            </button>
                        </div>
                    ) : (
                        budgets.map((budget, index) => {
                            // Normalize data structure handling (API vs Mock/Legacy)
                            const limit = budget.allocatedAmount || budget.limit || 0;
                            const spent = budget.spentAmount || budget.spent || 0;
                            const percentage = limit > 0 ? (spent / limit) * 100 : 0;
                            const remaining = limit - spent;

                            return (
                                <div key={budget.id || index} style={{
                                    background: 'var(--card-bg)',
                                    borderRadius: '16px',
                                    padding: '1.5rem',
                                    border: '1px solid var(--border-color)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{
                                                background: 'var(--light-color)',
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '12px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '1.5rem'
                                            }}>
                                                {budget.category === 'Food & Dining' ? '🍔' :
                                                    budget.category === 'Transportation' ? '🚗' :
                                                        budget.category === 'Shopping' ? '🛍️' : '💡'}
                                            </div>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-color)' }}>
                                                    {budget.category}
                                                </h3>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                                    Monthly Limit
                                                </span>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => openEditModal(budget)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'transparent',
                                                    border: '1px solid var(--border-color)',
                                                    borderRadius: '8px',
                                                    color: 'var(--text-color)',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(budget.id)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    color: '#EF4444',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: '600' }}>
                                        <span style={{ color: 'var(--text-color)' }}>${spent.toLocaleString()} spent</span>
                                        <span style={{ color: 'var(--text-light)' }}>of ${limit.toLocaleString()}</span>
                                    </div>

                                    <div style={{
                                        width: '100%',
                                        height: '8px',
                                        background: 'var(--light-color)',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                    }}>
                                        <div style={{
                                            width: `${Math.min(percentage, 100)}%`,
                                            height: '100%',
                                            background: getProgressColor(percentage),
                                            transition: 'width 0.5s ease'
                                        }}></div>
                                    </div>

                                    <div style={{ textAlign: 'right', fontSize: '0.875rem' }}>
                                        <span style={{ color: 'var(--text-light)' }}>Running Balance: </span>
                                        <span style={{
                                            color: remaining >= 0 ? '#10B981' : '#EF4444',
                                            fontWeight: '700'
                                        }}>
                                            ${remaining.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'var(--card-bg)',
                        padding: '2rem',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '450px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-color)' }}>
                                {editMode ? 'Edit Budget' : 'Create Budget'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-light)' }}>
                                <FiPlus style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-color)' }}>Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
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
                                    <option value="">Select Category</option>
                                    {[
                                        "Food & Dining",
                                        "Transportation",
                                        "Shopping",
                                        "Bills & Utilities",
                                        "Entertainment",
                                        "Health",
                                        "Education",
                                        "Rent/Mortgage",
                                        "Savings",
                                        "Travel",
                                        "Misc"
                                    ].map(cat => (
                                        <option
                                            key={cat}
                                            value={cat}
                                            disabled={!editMode && budgets.some(b => b.category === cat)}
                                        >
                                            {cat} {!editMode && budgets.some(b => b.category === cat) ? '(Exists)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-color)' }}>Monthly Limit</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }}>$</span>
                                    <input
                                        type="number"
                                        name="allocatedAmount"
                                        value={formData.allocatedAmount}
                                        onChange={handleInputChange}
                                        required
                                        min="1"
                                        placeholder="0.00"
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem 1rem 0.75rem 2.5rem',
                                            borderRadius: '8px',
                                            border: '1px solid var(--border-color)',
                                            background: 'var(--card-bg)',
                                            color: 'var(--text-color)',
                                            fontSize: '1rem'
                                        }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'var(--primary-color)', // Fallback to blue if var not set
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                {editMode ? 'Update Budget' : 'Create Budget'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Budget;
