import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiTarget } from 'react-icons/fi';
import { getDashboardStats } from '../services/api';

const FinancialCards = () => {
    const [stats, setStats] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        currentBalance: 0,
        monthlySavings: 0,
        incomeChange: '+0%',
        expenseChange: '+0%',
        savingsPercentage: '0%'
    });

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await getDashboardStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    return (
        <div className="financial-cards">
            <div className="card">
                <div className="card-header">
                    <h3>TOTAL INCOME</h3>
                    <span className="change positive">
                        <FiTrendingUp /> {stats.incomeChange}
                    </span>
                </div>
                <div className="card-content">
                    <FiDollarSign className="card-icon income" />
                    <h2>${stats.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p>from last month</p>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>TOTAL EXPENSES</h3>
                    <span className="change negative">
                        <FiTrendingDown /> {stats.expenseChange}
                    </span>
                </div>
                <div className="card-content">
                    <FiDollarSign className="card-icon expense" />
                    <h2>${stats.totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p>from last month</p>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>CURRENT BALANCE</h3>
                </div>
                <div className="card-content">
                    <FiDollarSign className="card-icon balance" />
                    <h2>${stats.currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p>Across 3 accounts</p>
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h3>MONTHLY SAVINGS</h3>
                </div>
                <div className="card-content">
                    <FiTarget className="card-icon savings" />
                    <h2>${stats.monthlySavings.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
                    <p>{stats.savingsPercentage} of target</p>
                </div>
            </div>
        </div>
    );
};

export default FinancialCards;