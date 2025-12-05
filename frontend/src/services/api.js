
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Real API functions
export const getDashboardStats = async () => {
    try {
        const response = await api.get('/dashboard/stats');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Return mock data if API fails
        return { 
            data: {
                totalIncome: 5842,
                totalExpenses: 3216,
                currentBalance: 2626,
                monthlySavings: 2626,
                incomeChange: '+12.3%',
                expenseChange: '+5.8%',
                savingsPercentage: '65%'
            }
        };
    }
};

export const getTransactions = async () => {
    try {
        const response = await api.get('/transactions');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        // Return mock data if API fails
        return { 
            data: [
                {
                    id: 1,
                    description: 'Salary',
                    category: 'Salary',
                    date: '2025-12-05',
                    amount: 10000,
                    type: 'INCOME'
                },
                {
                    id: 2,
                    description: 'Sell car',
                    category: 'Business',
                    date: '2025-12-05',
                    amount: 15000,
                    type: 'INCOME'
                },
                {
                    id: 3,
                    description: 'Buy good',
                    category: 'Food & Dining',
                    date: '2025-12-05',
                    amount: 750,
                    type: 'EXPENSE'
                }
            ]
        };
    }
};

export const getRecentTransactions = async () => {
    try {
        const response = await api.get('/transactions/recent');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        return { data: [] };
    }
};

export const getBudgets = async () => {
    try {
        const response = await api.get('/budgets');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching budgets:', error);
        // Return mock budget data
        return { 
            data: [
                {
                    category: 'Food & Dining',
                    spent: 450,
                    limit: 600,
                    percentage: 75,
                    remaining: 150
                },
                {
                    category: 'Shopping',
                    spent: 320,
                    limit: 500,
                    percentage: 64,
                    remaining: 180
                },
                {
                    category: 'Transportation',
                    spent: 180,
                    limit: 300,
                    percentage: 60,
                    remaining: 120
                },
                {
                    category: 'Entertainment',
                    spent: 120,
                    limit: 200,
                    percentage: 60,
                    remaining: 80
                }
            ]
        };
    }
};

export const addTransaction = async (transactionData) => {
    try {
        const response = await api.post('/transactions', transactionData);
        return { data: response.data };
    } catch (error) {
        console.error('Error adding transaction:', error);
        // Simulate success for demo
        return { 
            data: {
                ...transactionData,
                id: Date.now(),
                date: new Date().toISOString()
            }
        };
    }
};

export default api;
