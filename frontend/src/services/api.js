
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
        // Return comprehensive mock data for analytics
        return {
            data: generateMockTransactions()
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

// Bill APIs
export const getBills = async () => {
    try {
        const response = await api.get('/bills');
        return { data: response.data };
    } catch (error) {
        console.error('Error fetching bills:', error);
        throw error;
    }
};

export const addBill = async (billData) => {
    try {
        const response = await api.post('/bills', billData);
        return { data: response.data };
    } catch (error) {
        console.error('Error adding bill:', error);
        throw error;
    }
};

export const toggleBillStatus = async (id) => {
    try {
        const response = await api.patch(`/bills/${id}/toggle-status`);
        return { data: response.data };
    } catch (error) {
        console.error('Error toggling bill status:', error);
        throw error;
    }
};

export const deleteBill = async (id) => {
    try {
        const response = await api.delete(`/bills/${id}`);
        return { data: response.data };
    } catch (error) {
        console.error('Error deleting bill:', error);
        throw error;
    }
};

// Generate comprehensive mock transactions for analytics
const generateMockTransactions = () => {
    const categories = [
        'Shopping', 'Food & Dining', 'Transportation',
        'Bills & Utilities', 'Entertainment', 'Healthcare',
        'Education', 'Investment', 'Salary', 'Freelance', 'Business'
    ];

    const descriptions = {
        'Shopping': ['Amazon Purchase', 'Clothing Store', 'Electronics', 'Home Decor'],
        'Food & Dining': ['Groceries', 'Restaurant', 'Coffee Shop', 'Food Delivery'],
        'Transportation': ['Fuel', 'Public Transport', 'Taxi', 'Car Maintenance'],
        'Bills & Utilities': ['Electricity', 'Water', 'Internet', 'Phone Bill'],
        'Entertainment': ['Movie Tickets', 'Streaming Service', 'Concert', 'Games'],
        'Healthcare': ['Doctor Visit', 'Medication', 'Health Insurance', 'Gym'],
        'Education': ['Books', 'Course', 'Software', 'Workshop'],
        'Investment': ['Stocks', 'Crypto', 'Mutual Funds', 'Bonds'],
        'Salary': ['Monthly Salary', 'Bonus', 'Commission'],
        'Freelance': ['Freelance Project', 'Consulting Fee'],
        'Business': ['Business Income', 'Client Payment']
    };

    const mockData = [];
    const now = new Date();

    // Generate 50 transactions
    for (let i = 0; i < 150; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - Math.floor(Math.random() * 365));

        const category = categories[Math.floor(Math.random() * categories.length)];
        const isIncome = category === 'Salary' || category === 'Freelance' || category === 'Business' || Math.random() > 0.7;
        const type = isIncome ? 'INCOME' : 'EXPENSE';

        let amount;
        if (type === 'INCOME') {
            amount = Math.floor(Math.random() * 5000) + 1000;
        } else {
            amount = Math.floor(Math.random() * 500) + 10;
        }

        const categoryDescriptions = descriptions[category] || ['Transaction'];
        const description = categoryDescriptions[Math.floor(Math.random() * categoryDescriptions.length)];

        mockData.push({
            id: i + 1,
            description: type === 'INCOME' ? `Income: ${description}` : description,
            category,
            date: date.toISOString().split('T')[0],
            amount,
            type
        });
    }

    return mockData;
};

export default api;
