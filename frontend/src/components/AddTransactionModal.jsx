import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { addTransaction } from '../services/api';

const AddTransactionModal = ({ isOpen, onClose, defaultType = 'EXPENSE', onTransactionAdded }) => {
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        amount: '',
        type: defaultType
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Define categories with fallback
    const categories = {
        'INCOME': ['Salary', 'Freelance', 'Business', 'Investment', 'Other Income'],
        'EXPENSE': [
            'Shopping',
            'Food & Dining',
            'Transportation',
            'Bills & Utilities',
            'Entertainment',
            'Healthcare',
            'Education',
            'Rent/Mortgage',
            'Other'
        ]
    };

    // Get categories for current type with fallback
    const getCategoriesForType = (type) => {
        return categories[type] || categories['EXPENSE'];
    };

    // Initialize form when modal opens or defaultType changes
    useEffect(() => {
        if (isOpen) {
            const initialCategory = defaultType === 'INCOME' ? 'Salary' : 'Shopping';
            setFormData({
                description: '',
                category: initialCategory,
                date: new Date().toISOString().split('T')[0],
                amount: '',
                type: defaultType || 'EXPENSE'
            });
            setError('');
        }
    }, [isOpen, defaultType]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Validate form
            if (!formData.description.trim()) {
                throw new Error('Description is required');
            }
            if (!formData.amount || parseFloat(formData.amount) <= 0) {
                throw new Error('Amount must be greater than 0');
            }

            const transactionData = {
                description: formData.description.trim(),
                category: formData.category,
                date: formData.date,
                amount: parseFloat(formData.amount),
                type: formData.type
            };

            console.log('Sending transaction:', transactionData);

            const response = await addTransaction(transactionData);
            console.log('Transaction added successfully:', response.data);
            
            // Reset form
            const initialCategory = formData.type === 'INCOME' ? 'Salary' : 'Shopping';
            setFormData({
                description: '',
                category: initialCategory,
                date: new Date().toISOString().split('T')[0],
                amount: '',
                type: formData.type
            });

            // Notify parent
            if (onTransactionAdded) {
                onTransactionAdded();
            }
            
            // Close modal
            onClose();
            
        } catch (err) {
            console.error('Error adding transaction:', err);
            setError(err.response?.data?.message || err.message || 'Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{formData.type === 'INCOME' ? 'Add Income' : 'Add Expense'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Description *</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder={`Enter ${formData.type === 'INCOME' ? 'income' : 'expense'} description`}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a category</option>
                            {getCategoriesForType(formData.type).map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date</label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Amount *</label>
                            <div className="amount-input-container">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0.01"
                                    required
                                    className="amount-input"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Type</label>
                        <div className="type-options">
                            <label className="type-option">
                                <input
                                    type="radio"
                                    name="type"
                                    value="EXPENSE"
                                    checked={formData.type === 'EXPENSE'}
                                    onChange={handleChange}
                                />
                                <span className={`type-badge expense ${formData.type === 'EXPENSE' ? 'active' : ''}`}>
                                    Expense
                                </span>
                            </label>
                            <label className="type-option">
                                <input
                                    type="radio"
                                    name="type"
                                    value="INCOME"
                                    checked={formData.type === 'INCOME'}
                                    onChange={handleChange}
                                />
                                <span className={`type-badge income ${formData.type === 'INCOME' ? 'active' : ''}`}>
                                    Income
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Adding...
                                </>
                            ) : (
                                `Add ${formData.type === 'INCOME' ? 'Income' : 'Expense'}`
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;