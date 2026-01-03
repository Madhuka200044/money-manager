import React, { useState, useEffect } from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getTransactions } from '../services/api';

const SpendingChart = ({ refreshKey }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const loadChartData = async () => {
            try {
                const response = await getTransactions();
                const transactions = response.data || [];
                
                if (transactions.length > 0) {
                    const processedData = processTransactions(transactions);
                    setChartData(processedData);
                } else {
                    setChartData(getStaticData());
                }
            } catch (error) {
                console.log('Using static chart data due to error:', error);
                setChartData(getStaticData());
            }
        };
        
        loadChartData();
    }, [refreshKey]);

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
        
        const result = Object.values(monthlyTotals);
        const monthOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        result.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
        
        return result;
    };

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
        <div className="chart-section">
            <h3>Spending Overview</h3>
            <div className="chart">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart 
                        data={data} 
                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke="#E5E7EB" 
                            vertical={false}
                        />
                        <XAxis 
                            dataKey="month" 
                            stroke="#6B7280"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            stroke="#6B7280"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                            labelFormatter={(label) => `Month: ${label}`}
                            contentStyle={{
                                backgroundColor: 'white',
                                border: '1px solid #E5E7EB',
                                borderRadius: '8px',
                                padding: '12px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                            }}
                            labelStyle={{ color: '#1F2937', fontWeight: 600 }}
                        />
                        <Legend 
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="income" 
                            stroke="#4F46E5" 
                            strokeWidth={3}
                            name="Income"
                            dot={{ stroke: '#4F46E5', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="expenses" 
                            stroke="#10B981" 
                            strokeWidth={3}
                            name="Expenses"
                            dot={{ stroke: '#10B981', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpendingChart;