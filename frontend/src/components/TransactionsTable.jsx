import React, { useState, useEffect } from 'react';
import { getTransactions } from '../services/api';

const TransactionsTable = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await getTransactions();
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatAmount = (amount) => {
        const isNegative = amount < 0;
        const absAmount = Math.abs(amount).toFixed(2);
        return `${isNegative ? '-' : '+'}$${absAmount}`;
    };

    const getCategoryClass = (category) => {
        return category.toLowerCase().replace(' & ', '-').replace(' ', '-');
    };

    return (
        <div className="transactions-container">
            <div className="transactions-header">
                <h3>Recent Transactions</h3>
                <button className="view-all-btn">View All →</button>
            </div>
            <div className="table-wrapper">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td className="description-cell">
                                    <div className="transaction-desc">
                                        <div className="transaction-icon">
                                            {transaction.amount >= 0 ? '💰' : '💳'}
                                        </div>
                                        <div>
                                            <div className="description-main">{transaction.description}</div>
                                            <div className="description-sub">{transaction.type}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`category-badge ${getCategoryClass(transaction.category)}`}>
                                        {transaction.category}
                                    </span>
                                </td>
                                <td className="date-cell">{formatDate(transaction.date)}</td>
                                <td className={`amount ${transaction.amount >= 0 ? 'positive' : 'negative'}`}>
                                    {formatAmount(transaction.amount)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsTable;