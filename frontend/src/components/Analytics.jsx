import React, { useState, useEffect } from 'react';
import { 
    FiTrendingUp, FiTrendingDown, FiDollarSign, 
    FiPieChart, FiCalendar, FiFilter, 
    FiDownload, FiChevronDown, FiChevronUp,
    FiBarChart2, FiActivity, FiTarget
} from 'react-icons/fi';
import { 
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer, AreaChart, Area, RadarChart,
    Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { getTransactions, getDashboardStats } from '../services/api';

const Analytics = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [expandedChart, setExpandedChart] = useState(null);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const [transactionsResponse, statsResponse] = await Promise.all([
                getTransactions(),
                getDashboardStats()
            ]);
            
            setTransactions(transactionsResponse.data || []);
            setStats(statsResponse.data || {});
        } catch (error) {
            console.error('Error fetching analytics data:', error);
            setTransactions(getMockTransactions());
            setStats(getMockStats());
        } finally {
            setLoading(false);
        }
    };

    // Generate mock data for demonstration
    const getMockTransactions = () => {
        const categories = ['Shopping', 'Food & Dining', 'Transportation', 'Bills & Utilities', 'Entertainment', 'Healthcare', 'Education', 'Investment'];
        const descriptions = {
            'Shopping': ['Amazon Purchase', 'Clothing Store', 'Electronics', 'Home Decor'],
            'Food & Dining': ['Groceries', 'Restaurant', 'Coffee Shop', 'Food Delivery'],
            'Transportation': ['Fuel', 'Public Transport', 'Taxi', 'Car Maintenance'],
            'Bills & Utilities': ['Electricity', 'Water', 'Internet', 'Phone Bill'],
            'Entertainment': ['Movie Tickets', 'Streaming Service', 'Concert', 'Games'],
            'Healthcare': ['Doctor Visit', 'Medication', 'Health Insurance', 'Gym'],
            'Education': ['Books', 'Course', 'Software', 'Workshop'],
            'Investment': ['Stocks', 'Crypto', 'Mutual Funds', 'Bonds']
        };
        
        const mockData = [];
        const now = new Date();
        
        for (let i = 0; i < 150; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - Math.floor(Math.random() * 365));
            
            const category = categories[Math.floor(Math.random() * categories.length)];
            const type = Math.random() > 0.3 ? 'EXPENSE' : 'INCOME';
            const amount = type === 'INCOME' 
                ? Math.floor(Math.random() * 5000) + 1000
                : Math.floor(Math.random() * 1000) + 10;
            
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

    const getMockStats = () => ({
        totalIncome: 5842,
        totalExpenses: 3216,
        currentBalance: 2626,
        monthlySavings: 2626,
        incomeChange: '+12.3%',
        expenseChange: '+5.8%',
        savingsPercentage: '65%'
    });

    // Process data for charts
    const getMonthlyData = () => {
        const monthlyData = {};
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        // Initialize all months
        months.forEach(month => {
            monthlyData[month] = {
                month,
                income: 0,
                expenses: 0,
                balance: 0,
                transactionCount: 0
            };
        });
        
        transactions.forEach(t => {
            const date = new Date(t.date);
            const month = date.toLocaleString('default', { month: 'short' });
            
            if (monthlyData[month]) {
                if (t.type === 'INCOME') {
                    monthlyData[month].income += t.amount;
                } else {
                    monthlyData[month].expenses += t.amount;
                }
                monthlyData[month].transactionCount += 1;
                monthlyData[month].balance = monthlyData[month].income - monthlyData[month].expenses;
            }
        });
        
        return Object.values(monthlyData);
    };

    const getCategoryData = () => {
        const categoryData = {};
        
        transactions
            .filter(t => t.type === 'EXPENSE')
            .forEach(t => {
                if (!categoryData[t.category]) {
                    categoryData[t.category] = {
                        name: t.category,
                        value: 0,
                        count: 0,
                        avgAmount: 0
                    };
                }
                categoryData[t.category].value += t.amount;
                categoryData[t.category].count += 1;
            });
        
        // Calculate averages
        Object.values(categoryData).forEach(cat => {
            cat.avgAmount = cat.value / cat.count;
        });
        
        return Object.values(categoryData).sort((a, b) => b.value - a.value);
    };

    const getDailySpendingData = () => {
        const dailyData = {};
        const now = new Date();
        
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
            dailyData[dateStr] = { 
                date: dateStr,
                fullDate: date,
                amount: 0,
                transactions: 0 
            };
        }
        
        transactions
            .filter(t => t.type === 'EXPENSE' && new Date(t.date) >= new Date(now.setDate(now.getDate() - 30)))
            .forEach(t => {
                const date = new Date(t.date);
                const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
                if (dailyData[dateStr]) {
                    dailyData[dateStr].amount += t.amount;
                    dailyData[dateStr].transactions += 1;
                }
            });
        
        return Object.values(dailyData);
    };

    const getIncomeSources = () => {
        const incomeData = {};
        
        transactions
            .filter(t => t.type === 'INCOME')
            .forEach(t => {
                // Extract source from description
                const source = t.description.toLowerCase().includes('salary') ? 'Salary' :
                              t.description.toLowerCase().includes('freelance') ? 'Freelance' :
                              t.description.toLowerCase().includes('business') ? 'Business' :
                              t.description.toLowerCase().includes('investment') ? 'Investment' : 'Other';
                
                if (!incomeData[source]) {
                    incomeData[source] = {
                        name: source,
                        value: 0,
                        count: 0
                    };
                }
                incomeData[source].value += t.amount;
                incomeData[source].count += 1;
            });
        
        return Object.values(incomeData).sort((a, b) => b.value - a.value);
    };

    const getTopExpenses = (limit = 10) => {
        return transactions
            .filter(t => t.type === 'EXPENSE')
            .sort((a, b) => b.amount - a.amount)
            .slice(0, limit);
    };

    const getSpendingPatterns = () => {
        const patterns = {
            weekday: { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 },
            timeOfDay: { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 }
        };
        
        transactions
            .filter(t => t.type === 'EXPENSE')
            .forEach(t => {
                const date = new Date(t.date);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                const hour = date.getHours();
                
                // Weekday spending
                if (patterns.weekday[day] !== undefined) {
                    patterns.weekday[day] += t.amount;
                }
                
                // Time of day spending
                if (hour >= 5 && hour < 12) patterns.timeOfDay.Morning += t.amount;
                else if (hour >= 12 && hour < 17) patterns.timeOfDay.Afternoon += t.amount;
                else if (hour >= 17 && hour < 22) patterns.timeOfDay.Evening += t.amount;
                else patterns.timeOfDay.Night += t.amount;
            });
        
        return patterns;
    };

    const getKeyMetrics = () => {
        const totalIncome = transactions
            .filter(t => t.type === 'INCOME')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpenses = transactions
            .filter(t => t.type === 'EXPENSE')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const avgDailySpending = totalExpenses / 30;
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;
        const avgTransactionAmount = transactions.length > 0 ? 
            (totalIncome + totalExpenses) / transactions.length : 0;
        
        // Calculate month-over-month growth
        const monthlyData = getMonthlyData();
        const lastMonthIncome = monthlyData.slice(-2)[0]?.income || 0;
        const currentMonthIncome = monthlyData.slice(-1)[0]?.income || 0;
        const incomeGrowth = lastMonthIncome > 0 ? 
            ((currentMonthIncome - lastMonthIncome) / lastMonthIncome * 100) : 0;
        
        const lastMonthExpenses = monthlyData.slice(-2)[0]?.expenses || 0;
        const currentMonthExpenses = monthlyData.slice(-1)[0]?.expenses || 0;
        const expenseGrowth = lastMonthExpenses > 0 ? 
            ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses * 100) : 0;
        
        return {
            totalIncome,
            totalExpenses,
            avgDailySpending,
            savingsRate,
            balance: totalIncome - totalExpenses,
            transactionCount: transactions.length,
            avgTransactionAmount,
            incomeGrowth,
            expenseGrowth,
            mostSpentCategory: getCategoryData()[0]?.name || 'N/A',
            largestExpense: getTopExpenses(1)[0]?.amount || 0
        };
    };

    const metrics = getKeyMetrics();
    const monthlyData = getMonthlyData();
    const categoryData = getCategoryData();
    const dailyData = getDailySpendingData();
    const incomeSources = getIncomeSources();
    const topExpenses = getTopExpenses(5);
    const spendingPatterns = getSpendingPatterns();

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4F46E5'];

    const TimeRangeSelector = () => (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            backgroundColor: 'var(--card-bg)',
            padding: '0.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)'
        }}>
            {['week', 'month', 'quarter', 'year', 'all'].map(range => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: 'none',
                        background: timeRange === range ? 'var(--primary-color)' : 'transparent',
                        color: timeRange === range ? 'white' : 'var(--text-color)',
                        cursor: 'pointer',
                        fontWeight: timeRange === range ? '600' : '500',
                        transition: 'all 0.2s',
                        fontSize: '0.875rem'
                    }}
                >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
            ))}
        </div>
    );

    const MetricCard = ({ title, value, change, icon, color, subtitle }) => (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            height: '100%'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '10px',
                    background: `${color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: color,
                    fontSize: '1.25rem'
                }}>
                    {icon}
                </div>
                {change !== undefined && (
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.25rem',
                        color: change > 0 ? '#10B981' : '#EF4444',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        background: change > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                    }}>
                        {change > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
                        {Math.abs(change).toFixed(1)}%
                    </div>
                )}
            </div>
            <div>
                <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--text-light)',
                    marginBottom: '0.25rem',
                    fontWeight: '500'
                }}>
                    {title}
                </div>
                <div style={{ 
                    fontSize: '1.75rem', 
                    fontWeight: '800', 
                    color: 'var(--text-color)',
                    lineHeight: 1.2,
                    marginBottom: subtitle ? '0.25rem' : 0
                }}>
                    {value}
                </div>
                {subtitle && (
                    <div style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-light)',
                        fontWeight: '500'
                    }}>
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    );

    const ChartContainer = ({ title, children, isExpanded, onExpand }) => (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '1.75rem',
            border: '1px solid var(--border-color)',
            gridColumn: isExpanded ? '1 / -1' : 'span 1',
            transition: 'all 0.3s ease'
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem'
            }}>
                <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '700', 
                    color: 'var(--text-color)',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    {title === 'Income vs Expenses' && <FiActivity />}
                    {title === 'Spending by Category' && <FiPieChart />}
                    {title === 'Daily Spending Trend' && <FiBarChart2 />}
                    {title === 'Income Sources' && <FiTarget />}
                    {title}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button 
                        onClick={onExpand}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-light)',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'var(--light-color)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                    >
                        {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                    </button>
                </div>
            </div>
            {children}
        </div>
    );

    const exportAnalyticsData = () => {
        const analyticsData = {
            metrics,
            monthlyData,
            categoryData,
            dailyData,
            incomeSources,
            topExpenses,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(analyticsData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        alert('Analytics data exported successfully!');
    };

    const toggleChartExpansion = (chartName) => {
        setExpandedChart(expandedChart === chartName ? null : chartName);
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Analytics & Insights</h1>
                    <p>Deep insights into your financial patterns and behaviors</p>
                </div>
                <div className="header-actions" style={{ gap: '1rem' }}>
                    <TimeRangeSelector />
                    <button 
                        className="btn-secondary" 
                        onClick={exportAnalyticsData}
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            minWidth: '140px'
                        }}
                    >
                        <FiDownload /> Export Data
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)',
                    gap: '1rem'
                }}>
                    <div className="spinner" style={{ 
                        width: '48px', 
                        height: '48px', 
                        border: '3px solid rgba(79, 70, 229, 0.2)',
                        borderTopColor: 'var(--primary-color)'
                    }}></div>
                    <div style={{ color: 'var(--text-light)', fontWeight: '500' }}>
                        Loading analytics data...
                    </div>
                </div>
            ) : (
                <>
                    {/* Key Metrics Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <MetricCard 
                            title="Total Income" 
                            value={`$${metrics.totalIncome.toLocaleString()}`}
                            change={metrics.incomeGrowth}
                            icon={<FiTrendingUp />}
                            color="#10B981"
                            subtitle="Last 30 days"
                        />
                        <MetricCard 
                            title="Total Expenses" 
                            value={`$${metrics.totalExpenses.toLocaleString()}`}
                            change={metrics.expenseGrowth}
                            icon={<FiTrendingDown />}
                            color="#EF4444"
                            subtitle="Last 30 days"
                        />
                        <MetricCard 
                            title="Savings Rate" 
                            value={`${metrics.savingsRate.toFixed(1)}%`}
                            change={8.3}
                            icon={<FiPieChart />}
                            color="#3B82F6"
                            subtitle={`Balance: $${metrics.balance.toLocaleString()}`}
                        />
                        <MetricCard 
                            title="Avg Daily Spending" 
                            value={`$${metrics.avgDailySpending.toFixed(2)}`}
                            change={-3.1}
                            icon={<FiDollarSign />}
                            color="#F59E0B"
                            subtitle="Per day average"
                        />
                    </div>

                    {/* Detailed Metrics */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                Total Transactions
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)' }}>
                                {metrics.transactionCount}
                            </div>
                        </div>
                        <div style={{
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                Avg Transaction
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)' }}>
                                ${metrics.avgTransactionAmount.toFixed(2)}
                            </div>
                        </div>
                        <div style={{
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                Most Spent Category
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)' }}>
                                {metrics.mostSpentCategory}
                            </div>
                        </div>
                        <div style={{
                            background: 'var(--card-bg)',
                            borderRadius: '10px',
                            padding: '1rem',
                            border: '1px solid var(--border-color)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                                Largest Expense
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#EF4444' }}>
                                ${metrics.largestExpense}
                            </div>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        {/* Income vs Expenses Chart */}
                        <ChartContainer 
                            title="Income vs Expenses"
                            isExpanded={expandedChart === 'incomeExpenses'}
                            onExpand={() => toggleChartExpansion('incomeExpenses')}
                        >
                            <div style={{ height: expandedChart === 'incomeExpenses' ? '400px' : '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={monthlyData}>
                                        <defs>
                                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                                            </linearGradient>
                                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                                        <XAxis 
                                            dataKey="month" 
                                            stroke="var(--text-light)"
                                            tick={{ fill: 'var(--text-light)' }}
                                        />
                                        <YAxis 
                                            stroke="var(--text-light)"
                                            tick={{ fill: 'var(--text-light)' }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                                            labelStyle={{ color: 'var(--text-color)', fontWeight: '600' }}
                                            contentStyle={{
                                                backgroundColor: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                        <Area 
                                            type="monotone" 
                                            dataKey="income" 
                                            stroke="#10B981" 
                                            fillOpacity={1}
                                            fill="url(#colorIncome)"
                                            name="Income"
                                            strokeWidth={2}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="expenses" 
                                            stroke="#EF4444" 
                                            fillOpacity={1}
                                            fill="url(#colorExpenses)"
                                            name="Expenses"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>

                        {/* Spending by Category */}
                        <ChartContainer 
                            title="Spending by Category"
                            isExpanded={expandedChart === 'category'}
                            onExpand={() => toggleChartExpansion('category')}
                        >
                            <div style={{ height: expandedChart === 'category' ? '400px' : '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={(entry) => `${entry.name}: $${entry.value.toLocaleString()}`}
                                            outerRadius={expandedChart === 'category' ? 120 : 80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            paddingAngle={2}
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={COLORS[index % COLORS.length]} 
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            formatter={(value, name, props) => [
                                                `$${value.toLocaleString()}`,
                                                `${props.payload.name} (${((value / metrics.totalExpenses) * 100).toFixed(1)}%)`
                                            ]}
                                            contentStyle={{
                                                backgroundColor: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>

                        {/* Daily Spending Trend */}
                        <ChartContainer 
                            title="Daily Spending Trend"
                            isExpanded={expandedChart === 'daily'}
                            onExpand={() => toggleChartExpansion('daily')}
                        >
                            <div style={{ height: expandedChart === 'daily' ? '350px' : '250px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={dailyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis 
                                            dataKey="date" 
                                            stroke="var(--text-light)"
                                            tick={{ fill: 'var(--text-light)', fontSize: 12 }}
                                        />
                                        <YAxis 
                                            stroke="var(--text-light)"
                                            tick={{ fill: 'var(--text-light)' }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip 
                                            formatter={(value, name, props) => [
                                                `$${value.toLocaleString()}`,
                                                `${props.payload.date} (${props.payload.transactions} transactions)`
                                            ]}
                                            contentStyle={{
                                                backgroundColor: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar 
                                            dataKey="amount" 
                                            fill="#4F46E5" 
                                            radius={[4, 4, 0, 0]}
                                            name="Daily Spending"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>

                        {/* Income Sources */}
                        <ChartContainer 
                            title="Income Sources"
                            isExpanded={expandedChart === 'incomeSources'}
                            onExpand={() => toggleChartExpansion('incomeSources')}
                        >
                            <div style={{ height: expandedChart === 'incomeSources' ? '350px' : '250px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={incomeSources}>
                                        <PolarGrid stroke="var(--border-color)" />
                                        <PolarAngleAxis 
                                            dataKey="name" 
                                            stroke="var(--text-light)"
                                            tick={{ fill: 'var(--text-light)' }}
                                        />
                                        <PolarRadiusAxis 
                                            stroke="var(--text-light)"
                                            tick={{ fill: 'var(--text-light)' }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Radar
                                            name="Income Sources"
                                            dataKey="value"
                                            stroke="#10B981"
                                            fill="#10B981"
                                            fillOpacity={0.6}
                                            strokeWidth={2}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                                            contentStyle={{
                                                backgroundColor: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </ChartContainer>
                    </div>

                    {/* Bottom Section - Spending Patterns & Top Expenses */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '2rem'
                    }}>
                        {/* Weekly Spending Pattern */}
                        <div style={{
                            background: 'var(--card-bg)',
                            borderRadius: '16px',
                            padding: '1.75rem',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{ 
                                fontSize: '1.25rem', 
                                fontWeight: '700', 
                                color: 'var(--text-color)',
                                margin: '0 0 1.5rem 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FiCalendar /> Weekly Spending Pattern
                            </h3>
                            <div style={{ height: '250px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart 
                                        data={Object.entries(spendingPatterns.weekday).map(([day, amount]) => ({ day, amount }))}
                                        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                        <XAxis 
                                            dataKey="day" 
                                            stroke="var(--text-light)"
                                            tick={{ fill: 'var(--text-light)' }}
                                        />
                                        <YAxis 
                                            stroke="var(--text-light)"
                                            tick={{ fill: 'var(--text-light)' }}
                                            tickFormatter={(value) => `$${value}`}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                                            contentStyle={{
                                                backgroundColor: 'var(--card-bg)',
                                                border: '1px solid var(--border-color)',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar 
                                            dataKey="amount" 
                                            fill="#F59E0B" 
                                            radius={[4, 4, 0, 0]}
                                            name="Spending by Day"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Top Expenses */}
                        <div style={{
                            background: 'var(--card-bg)',
                            borderRadius: '16px',
                            padding: '1.75rem',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden'
                        }}>
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1.5rem'
                            }}>
                                <h3 style={{ 
                                    fontSize: '1.25rem', 
                                    fontWeight: '700', 
                                    color: 'var(--text-color)',
                                    margin: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <FiFilter /> Top 5 Expenses
                                </h3>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                                    {topExpenses.length} transactions
                                </div>
                            </div>
                            <div style={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '0.75rem',
                                maxHeight: '250px',
                                overflowY: 'auto',
                                paddingRight: '0.5rem'
                            }}>
                                {topExpenses.map((expense, index) => (
                                    <div key={expense.id} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1rem',
                                        background: 'var(--light-color)',
                                        borderRadius: '10px',
                                        border: '1px solid var(--border-color)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '10px',
                                                background: COLORS[index % COLORS.length] + '20',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: COLORS[index % COLORS.length],
                                                fontWeight: '700',
                                                fontSize: '1rem'
                                            }}>
                                                #{index + 1}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ 
                                                    fontSize: '0.95rem', 
                                                    fontWeight: '600', 
                                                    color: 'var(--text-color)',
                                                    marginBottom: '0.125rem',
                                                    lineHeight: 1.2
                                                }}>
                                                    {expense.description.length > 40 
                                                        ? expense.description.substring(0, 40) + '...' 
                                                        : expense.description}
                                                </div>
                                                <div style={{ 
                                                    fontSize: '0.8rem', 
                                                    color: 'var(--text-light)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }}>
                                                    <span style={{ 
                                                        padding: '0.125rem 0.5rem',
                                                        background: COLORS[index % COLORS.length] + '20',
                                                        borderRadius: '4px',
                                                        color: COLORS[index % COLORS.length],
                                                        fontWeight: '500'
                                                    }}>
                                                        {expense.category}
                                                    </span>
                                                    <span>
                                                        {new Date(expense.date).toLocaleDateString('en-US', { 
                                                            month: 'short', 
                                                            day: 'numeric' 
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ 
                                            fontSize: '1.1rem', 
                                            fontWeight: '700', 
                                            color: '#EF4444',
                                            textAlign: 'right'
                                        }}>
                                            -${expense.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Insights Summary */}
                    <div style={{
                        background: 'var(--card-bg)',
                        borderRadius: '16px',
                        padding: '1.75rem',
                        border: '1px solid var(--border-color)',
                        marginTop: '2rem'
                    }}>
                        <h3 style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: '700', 
                            color: 'var(--text-color)',
                            margin: '0 0 1rem 0'
                        }}>
                            Key Insights
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1rem'
                        }}>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                borderRadius: '10px',
                                borderLeft: '4px solid #10B981'
                            }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#10B981', marginBottom: '0.25rem' }}>
                                    📈 Positive Trend
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                                    Your income grew by <strong>{metrics.incomeGrowth.toFixed(1)}%</strong> compared to last month.
                                </div>
                            </div>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(239, 68, 68, 0.1)',
                                borderRadius: '10px',
                                borderLeft: '4px solid #EF4444'
                            }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#EF4444', marginBottom: '0.25rem' }}>
                                    ⚠️ Watch Out
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                                    Expenses increased by <strong>{Math.abs(metrics.expenseGrowth).toFixed(1)}%</strong>. Consider reviewing your budget.
                                </div>
                            </div>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(79, 70, 229, 0.1)',
                                borderRadius: '10px',
                                borderLeft: '4px solid #4F46E5'
                            }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#4F46E5', marginBottom: '0.25rem' }}>
                                    💡 Recommendation
                                </div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-color)' }}>
                                    Your savings rate is <strong>{metrics.savingsRate.toFixed(1)}%</strong>. Aim for 20% to meet long-term goals.
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;