import React from 'react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const SpendingChart = () => {
    const data = [
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
                            formatter={(value) => [`$${value}`, 'Amount']}
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