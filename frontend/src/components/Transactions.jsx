
import React from 'react';
import TransactionsTable from './TransactionsTable';

const Transactions = () => {
    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Transactions</h1>
                    <p>View and manage all your transactions</p>
                </div>
            </div>
            <TransactionsTable />
        </div>
    );
};

export default Transactions;
