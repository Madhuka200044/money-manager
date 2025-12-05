
import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getTransactions } from '../services/api';

const SpendingChart = ({ refreshKey }) => { // Accept refreshKey as prop
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        // This will re-run every time refreshKey changes
        const loadChartData = async () => {
            try {
                // Try to get real data first
                const response = await getTransactions();
                const transactions = response.data || [];
                
                if (transactions.length > 0) {
                    // Process transactions into chart data
                    const processedData = processTransactions(transactions);
                    setChartData(processedData);
                } else {
                    // Fallback to static data if no transactions
                    setChartData(getStaticData());
                }
            } catch (error) {
                console.log('Using static chart data due to error:', error);
                setChartData(getStaticData());
            }
        };
        
        loadChartData();
    }, [refreshKey]); // Add refreshKey as dependency

    // Process transactions into monthly data
    const processTransactions = (transactions) => {
        const monthlyTotals = {};
        
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const month = date.toLocaleString('default', { month: 'short' });
            
            if (!monthlyTotals[month]) {
                monthlyTotals[month] = { month, income: 0, expenses: 0 };
            }
            
            if (transaction.type === 'INCOME') {
                monthlyTotals[month].income += transaction.amount;
            } else {
                monthlyTotals[month].expenses += Math.abs(transaction.amount);
            }
        });
        
        // Convert to array and sort
        const result = Object.values(monthlyTotals);
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        result.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
        
        return result;
    };

    // Static fallback data
    const getStaticData = () => {
        return [
            { month: 'Jan', income: 5200, expenses: 3400 },
            { month: 'Feb', income: 5400, expenses: 3800 },
            { month: 'Mar', income: 5600, expenses: 3200 },
            { month: 'Apr', income: 5800, expenses: 3500 },
            { month: 'May', income: 6200, expenses: 3100 },
            { month: 'Jun', income: 6500, expenses: 4000 },
            { month: 'Jul', income: 5800, expenses: 3300 },
            { month: 'Aug', income: 6000, expenses: 3500 },
            { month: 'Sep', income: 6200, expenses: 3200 },
            { month: 'Oct', income: 5842, expenses: 3216 },
        ];
    };

    const data = chartData.length > 0 ? chartData : getStaticData();

    return (
        <div className="chart-container">
            <h3>Spending Overview</h3>
            <div className="chart">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis 
                            dataKey="month" 
                            stroke="#666"
                            tick={{ fill: '#666' }}
                        />
                        <YAxis 
                            stroke="#666"
                            tick={{ fill: '#666' }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Amount']}
                            labelFormatter={(label) => `Month: ${label}`}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #ddd',
                                borderRadius: '5px'
                            }}
                        />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="income" 
                            stroke="#4CAF50" 
                            strokeWidth={3}
                            name="Income"
                            dot={{ stroke: '#4CAF50', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="expenses" 
                            stroke="#F44336" 
                            strokeWidth={3}
                            name="Expenses"
                            dot={{ stroke: '#F44336', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpendingChart;
