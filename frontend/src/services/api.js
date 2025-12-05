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
        throw error;
    }
};

export const getTransactions = async () => {
    try {
        const response = await api.get('/transactions');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
    }
};

export const getRecentTransactions = async () => {
    try {
        const response = await api.get('/transactions/recent');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching recent transactions:', error);
        throw error;
    }
};

export const getBudgets = async () => {
    try {
        const response = await api.get('/budgets');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching budgets:', error);
        throw error;
    }
};

// In your api.js file, make sure you have:
export const addTransaction = async (transactionData) => {
    try {
        const response = await api.post('/transactions', transactionData);
        return { data: response.data };
    } catch (error) {
        console.error('Error adding transaction:', error);
        throw error;
    }
};
// Add this function to your api.js file
export const getChartData = async () => {
    try {
        const response = await api.get('/dashboard/chart-data');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching chart data:', error);
        throw error;
    }
};

export default api;