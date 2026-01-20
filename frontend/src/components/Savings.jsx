import React, { useState, useEffect } from 'react';
import { 
    FiTarget, FiTrendingUp, FiCalendar, FiDollarSign, 
    FiPercent, FiClock, FiCheckCircle, FiAlertCircle,
    FiPlus, FiEdit2, FiTrash2, FiDownload, FiShare
} from 'react-icons/fi';
import { 
    LineChart, Line, AreaChart, Area, XAxis, YAxis, 
    CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { getTransactions, getDashboardStats } from '../services/api';

const Savings = ({ refreshKey }) => {
    const [savingsGoal, setSavingsGoal] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [goalForm, setGoalForm] = useState({
        name: '',
        targetAmount: '',
        targetDate: '',
        currentAmount: '',
        category: 'General'
    });

    useEffect(() => {
        fetchSavingsData();
    }, [refreshKey]);

    const fetchSavingsData = async () => {
        try {
            setLoading(true);
            const saved = localStorage.getItem('savingsGoal');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && (parsed.name || parsed.amount)) {
                        setSavingsGoal(parsed);
                        setGoalForm({
                            name: parsed.name || '',
                            targetAmount: parsed.targetAmount || parsed.amount || '',
                            targetDate: parsed.targetDate || '',
                            currentAmount: parsed.currentAmount || parsed.amount || 0,
                            category: parsed.category || 'General'
                        });
                    }
                } catch (e) {
                    console.error('Error parsing saved goal:', e);
                }
            }

            const [transactionsResponse, statsResponse] = await Promise.all([
                getTransactions(),
                getDashboardStats()
            ]);
            
            setTransactions(transactionsResponse.data || []);
            setStats(statsResponse.data || {});
        } catch (error) {
            console.error('Error fetching savings data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate savings metrics
    const calculateSavingsMetrics = () => {
        if (!savingsGoal) return null;

        const targetAmount = parseFloat(savingsGoal.targetAmount || savingsGoal.amount || 0);
        const currentAmount = parseFloat(savingsGoal.currentAmount || 0);
        const targetDate = savingsGoal.targetDate ? new Date(savingsGoal.targetDate) : null;
        
        const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;
        const remainingAmount = Math.max(0, targetAmount - currentAmount);
        
        // Calculate days remaining
        let daysRemaining = null;
        let dailyRequired = null;
        let isOnTrack = true;
        
        if (targetDate) {
            const today = new Date();
            const timeDiff = targetDate.getTime() - today.getTime();
            daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (daysRemaining > 0) {
                dailyRequired = remainingAmount / daysRemaining;
                
                // Check if on track (less than 30 days behind schedule)
                const expectedProgress = (targetAmount / (365 * 3)) * (365 * 3 - daysRemaining);
                isOnTrack = currentAmount >= expectedProgress * 0.8; // 80% of expected progress
            }
        }

        return {
            targetAmount,
            currentAmount,
            progress,
            remainingAmount,
            daysRemaining,
            dailyRequired,
            isOnTrack
        };
    };

    const metrics = calculateSavingsMetrics();

    const getSavingsAllocation = () => {
        const allocations = [
            { name: 'Emergency Fund', value: 40, color: '#4F46E5' },
            { name: 'Retirement', value: 30, color: '#10B981' },
            { name: 'Travel', value: 15, color: '#F59E0B' },
            { name: 'Education', value: 10, color: '#EF4444' },
            { name: 'Other', value: 5, color: '#8B5CF6' }
        ];
        return allocations;
    };

    const handleSaveGoal = () => {
        // Validate required fields
        if (!goalForm.name.trim()) {
            alert('Please enter a goal name');
            return;
        }
        
        if (!goalForm.targetAmount || parseFloat(goalForm.targetAmount) <= 0) {
            alert('Please enter a valid target amount');
            return;
        }

        const newGoal = {
            name: goalForm.name,
            targetAmount: parseFloat(goalForm.targetAmount),
            amount: parseFloat(goalForm.targetAmount), // Keep for backward compatibility
            targetDate: goalForm.targetDate || null,
            currentAmount: parseFloat(goalForm.currentAmount) || 0,
            category: goalForm.category || 'General',
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('Saving goal:', newGoal);
        localStorage.setItem('savingsGoal', JSON.stringify(newGoal));
        setSavingsGoal(newGoal);
        setShowGoalModal(false);
        setEditMode(false);
        
        // Reset form
        setGoalForm({
            name: '',
            targetAmount: '',
            targetDate: '',
            currentAmount: '',
            category: 'General'
        });
        
        alert('Savings goal saved successfully!');
    };

    const handleDeleteGoal = () => {
        if (window.confirm('Are you sure you want to delete this savings goal?')) {
            localStorage.removeItem('savingsGoal');
            setSavingsGoal(null);
            setGoalForm({
                name: '',
                targetAmount: '',
                targetDate: '',
                currentAmount: '',
                category: 'General'
            });
            alert('Savings goal deleted!');
        }
    };

    const exportSavingsReport = () => {
        if (!savingsGoal) {
            alert('No savings goal to export');
            return;
        }
        
        const reportData = {
            goal: savingsGoal,
            metrics,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `savings-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const shareGoal = () => {
        if (!savingsGoal) return;
        
        if (navigator.share) {
            navigator.share({
                title: `My Savings Goal: ${savingsGoal.name}`,
                text: `I'm saving $${metrics?.targetAmount?.toLocaleString()} for ${savingsGoal.name}. Current progress: ${metrics?.progress?.toFixed(1)}%!`,
                url: window.location.href
            });
        } else {
            // Fallback: Copy to clipboard
            const text = `Savings Goal: ${savingsGoal?.name}\nTarget: $${metrics?.targetAmount?.toLocaleString()}\nProgress: ${metrics?.progress?.toFixed(1)}%`;
            navigator.clipboard.writeText(text);
            alert('Goal details copied to clipboard!');
        }
    };

    const SavingsGoalCard = () => (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '2rem',
            border: '1px solid var(--border-color)',
            marginBottom: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '200px',
                height: '200px',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1))',
                borderRadius: '50%',
                transform: 'translate(100px, -100px)'
            }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.75rem',
                        marginBottom: '0.5rem'
                    }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.25rem'
                        }}>
                            <FiTarget />
                        </div>
                        <div>
                            <h2 style={{ 
                                fontSize: '1.5rem', 
                                fontWeight: '700', 
                                color: 'var(--text-color)',
                                margin: 0
                            }}>
                                {savingsGoal?.name || 'Savings Goal'}
                            </h2>
                            <div style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--text-light)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <FiCalendar size={14} />
                                {savingsGoal?.targetDate ? 
                                    `Target: ${new Date(savingsGoal.targetDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}` :
                                    'No target date set'
                                }
                            </div>
                        </div>
                    </div>
                    
                    <div style={{ 
                        fontSize: '0.875rem', 
                        color: 'var(--text-light)',
                        marginTop: '0.5rem'
                    }}>
                        Category: <span style={{ 
                            fontWeight: '600', 
                            color: 'var(--primary-color)',
                            background: 'rgba(79, 70, 229, 0.1)',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '20px',
                            marginLeft: '0.5rem'
                        }}>
                            {savingsGoal?.category || 'General'}
                        </span>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                        onClick={() => {
                            setGoalForm({
                                name: savingsGoal.name || '',
                                targetAmount: savingsGoal.targetAmount || savingsGoal.amount || '',
                                targetDate: savingsGoal.targetDate || '',
                                currentAmount: savingsGoal.currentAmount || savingsGoal.amount || 0,
                                category: savingsGoal.category || 'General'
                            });
                            setEditMode(true);
                            setShowGoalModal(true);
                        }}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--light-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '500'
                        }}
                    >
                        <FiEdit2 /> Edit
                    </button>
                    <button 
                        onClick={handleDeleteGoal}
                        style={{
                            padding: '0.5rem 1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '8px',
                            color: '#EF4444',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontWeight: '500'
                        }}
                    >
                        <FiTrash2 /> Delete
                    </button>
                </div>
            </div>
            
            {/* Progress Section */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                            Progress
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-color)' }}>
                            {metrics?.progress?.toFixed(1)}%
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '0.25rem' }}>
                            Remaining
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)' }}>
                            ${metrics?.remainingAmount?.toLocaleString()}
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar */}
                <div style={{
                    height: '12px',
                    background: 'var(--border-color)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                }}>
                    <div 
                        style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, #4F46E5, #7C3AED)',
                            borderRadius: '6px',
                            width: `${Math.min(metrics?.progress || 0, 100)}%`,
                            transition: 'width 0.5s ease'
                        }}
                    />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--text-light)' }}>
                    <span>${metrics?.currentAmount?.toLocaleString()}</span>
                    <span>${metrics?.targetAmount?.toLocaleString()}</span>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem'
            }}>
                <div style={{
                    padding: '1rem',
                    background: 'var(--light-color)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <FiCalendar style={{ color: '#4F46E5' }} />
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            Days Remaining
                        </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)' }}>
                        {metrics?.daysRemaining !== null ? metrics.daysRemaining : 'N/A'}
                    </div>
                </div>
                
                <div style={{
                    padding: '1rem',
                    background: 'var(--light-color)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <FiDollarSign style={{ color: '#10B981' }} />
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            Daily Required
                        </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)' }}>
                        ${metrics?.dailyRequired ? metrics.dailyRequired.toFixed(2) : 'N/A'}
                    </div>
                </div>
                
                <div style={{
                    padding: '1rem',
                    background: 'var(--light-color)',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {metrics?.isOnTrack ? 
                            <FiCheckCircle style={{ color: '#10B981' }} /> : 
                            <FiAlertCircle style={{ color: '#EF4444' }} />
                        }
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            Status
                        </div>
                    </div>
                    <div style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        color: metrics?.isOnTrack ? '#10B981' : '#EF4444'
                    }}>
                        {metrics?.isOnTrack ? 'On Track' : 'Needs Attention'}
                    </div>
                </div>
            </div>
        </div>
    );

    const NoGoalCard = () => (
        <div style={{
            background: 'var(--card-bg)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            border: '2px dashed var(--border-color)',
            marginBottom: '2rem',
            textAlign: 'center'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1.5rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(139, 92, 246, 0.1))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-color)',
                fontSize: '2rem'
            }}>
                <FiTarget />
            </div>
            
            <h2 style={{ 
                fontSize: '1.75rem', 
                fontWeight: '700', 
                color: 'var(--text-color)',
                margin: '0 0 0.75rem 0'
            }}>
                No Savings Goal Set
            </h2>
            
            <p style={{ 
                fontSize: '1rem', 
                color: 'var(--text-light)',
                maxWidth: '500px',
                margin: '0 auto 2rem',
                lineHeight: 1.6
            }}>
                Set a savings goal to track your progress and stay motivated. You can set goals for emergencies, travel, education, or any other purpose.
            </p>
            
            <button 
                onClick={() => setShowGoalModal(true)}
                style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0 auto',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(79, 70, 229, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <FiPlus /> Set Your First Goal
            </button>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginTop: '2rem',
                textAlign: 'left'
            }}>
                {[
                    { icon: '🏠', title: 'Emergency Fund', desc: '3-6 months of expenses' },
                    { icon: '✈️', title: 'Travel', desc: 'Dream vacation fund' },
                    { icon: '🎓', title: 'Education', desc: 'Courses and learning' },
                    { icon: '🚗', title: 'Vehicle', desc: 'Car or bike purchase' }
                ].map((suggestion, index) => (
                    <div 
                        key={index}
                        style={{
                            padding: '1rem',
                            background: 'var(--light-color)',
                            borderRadius: '10px',
                            border: '1px solid var(--border-color)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => {
                            setGoalForm(prev => ({
                                ...prev,
                                name: suggestion.title,
                                category: suggestion.title
                            }));
                            setShowGoalModal(true);
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{suggestion.icon}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-color)' }}>
                            {suggestion.title}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
                            {suggestion.desc}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const GoalModal = () => (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'var(--card-bg)',
                borderRadius: '16px',
                padding: '2rem',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto',
                border: '1px solid var(--border-color)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)', margin: 0 }}>
                        {editMode ? 'Edit Goal' : 'Set Savings Goal'}
                    </h2>
                    <button 
                        onClick={() => {
                            setShowGoalModal(false);
                            setEditMode(false);
                            // Reset form when closing
                            setGoalForm({
                                name: '',
                                targetAmount: '',
                                targetDate: '',
                                currentAmount: '',
                                category: 'General'
                            });
                        }}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-light)',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '6px'
                        }}
                    >
                        ×
                    </button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-color)' }}>
                            Goal Name *
                        </label>
                        <input
                            type="text"
                            value={goalForm.name}
                            onChange={(e) => setGoalForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g., Emergency Fund, Vacation, New Car"
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                background: 'var(--card-bg)',
                                color: 'var(--text-color)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-color)' }}>
                                Target Amount *
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--text-light)'
                                }}>$</span>
                                <input
                                    type="number"
                                    value={goalForm.targetAmount}
                                    onChange={(e) => setGoalForm(prev => ({ ...prev, targetAmount: e.target.value }))}
                                    placeholder="0.00"
                                    min="0.01"
                                    step="0.01"
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem 0.875rem 2.5rem',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: '8px',
                                        background: 'var(--card-bg)',
                                        color: 'var(--text-color)',
                                        fontSize: '1rem'
                                    }}
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-color)' }}>
                                Target Date
                            </label>
                            <input
                                type="date"
                                value={goalForm.targetDate}
                                onChange={(e) => setGoalForm(prev => ({ ...prev, targetDate: e.target.value }))}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    background: 'var(--card-bg)',
                                    color: 'var(--text-color)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-color)' }}>
                            Current Amount Saved
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute',
                                left: '1rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: 'var(--text-light)'
                            }}>$</span>
                            <input
                                type="number"
                                value={goalForm.currentAmount}
                                onChange={(e) => setGoalForm(prev => ({ ...prev, currentAmount: e.target.value }))}
                                placeholder="Current savings"
                                min="0"
                                step="0.01"
                                style={{
                                    width: '100%',
                                    padding: '0.875rem 1rem 0.875rem 2.5rem',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: '8px',
                                    background: 'var(--card-bg)',
                                    color: 'var(--text-color)',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--text-color)' }}>
                            Category
                        </label>
                        <select
                            value={goalForm.category}
                            onChange={(e) => setGoalForm(prev => ({ ...prev, category: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '0.875rem 1rem',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                background: 'var(--card-bg)',
                                color: 'var(--text-color)',
                                fontSize: '1rem'
                            }}
                        >
                            <option value="General">General Savings</option>
                            <option value="Emergency Fund">Emergency Fund</option>
                            <option value="Travel">Travel</option>
                            <option value="Education">Education</option>
                            <option value="Home">Home Purchase</option>
                            <option value="Vehicle">Vehicle</option>
                            <option value="Retirement">Retirement</option>
                            <option value="Investment">Investment</option>
                            <option value="Health">Health & Wellness</option>
                        </select>
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                    <button 
                        onClick={() => {
                            setShowGoalModal(false);
                            setEditMode(false);
                            // Reset form when closing
                            setGoalForm({
                                name: '',
                                targetAmount: '',
                                targetDate: '',
                                currentAmount: '',
                                category: 'General'
                            });
                        }}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'var(--light-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '8px',
                            color: 'var(--text-color)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveGoal}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        {editMode ? 'Update Goal' : 'Create Goal'}
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Savings Goals</h1>
                    <p>Track and achieve your financial dreams</p>
                </div>
                <div className="header-actions">
                    {savingsGoal && (
                        <>
                            <button 
                                onClick={shareGoal}
                                className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <FiShare /> Share
                            </button>
                            <button 
                                onClick={exportSavingsReport}
                                className="btn-secondary"
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <FiDownload /> Export
                            </button>
                        </>
                    )}
                    <button 
                        onClick={() => setShowGoalModal(true)}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FiPlus /> {savingsGoal ? 'New Goal' : 'Set Goal'}
                    </button>
                </div>
            </div>
            
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    background: 'var(--card-bg)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color)'
                }}>
                    <div className="spinner" style={{ width: '40px', height: '40px' }}></div>
                </div>
            ) : (
                <>
                    {/* Main Goal Section */}
                    {savingsGoal ? <SavingsGoalCard /> : <NoGoalCard />}
                    
                    {/* Charts Section - Only show if we have a goal */}
                    {savingsGoal && (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr',
                            gap: '2rem',
                            marginBottom: '2rem'
                        }}>
                            {/* Savings Progress Chart */}
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
                                    <FiTrendingUp /> Goal Progress
                                </h3>
                                <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '4rem', fontWeight: '800', color: '#4F46E5' }}>
                                            {metrics?.progress?.toFixed(1)}%
                                        </div>
                                        <div style={{ fontSize: '1rem', color: 'var(--text-light)', marginTop: '1rem' }}>
                                            of ${metrics?.targetAmount?.toLocaleString()} target reached
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Savings Allocation */}
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
                                    <FiPercent /> Allocation
                                </h3>
                                <div style={{ height: '300px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={getSavingsAllocation()}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={(entry) => `${entry.name}: ${entry.value}%`}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {getSavingsAllocation().map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value) => [`${value}%`, 'Allocation']}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {/* Tips & Suggestions */}
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
                            margin: '0 0 1.5rem 0'
                        }}>
                            💡 Savings Tips
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1rem'
                        }}>
                            {[
                                {
                                    title: 'Automate Your Savings',
                                    desc: 'Set up automatic transfers to your savings account on payday.',
                                    icon: '🤖'
                                },
                                {
                                    title: 'Track Small Expenses',
                                    desc: 'Cutting daily coffee can save $100+ monthly.',
                                    icon: '☕'
                                },
                                {
                                    title: 'Use the 50/30/20 Rule',
                                    desc: '50% needs, 30% wants, 20% savings.',
                                    icon: '📊'
                                },
                                {
                                    title: 'Review Subscriptions',
                                    desc: 'Cancel unused subscriptions monthly.',
                                    icon: '📱'
                                }
                            ].map((tip, index) => (
                                <div key={index} style={{
                                    padding: '1.25rem',
                                    background: 'var(--light-color)',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ 
                                        fontSize: '1.5rem', 
                                        marginBottom: '0.75rem' 
                                    }}>
                                        {tip.icon}
                                    </div>
                                    <div style={{ 
                                        fontSize: '1rem', 
                                        fontWeight: '600', 
                                        color: 'var(--text-color)',
                                        marginBottom: '0.5rem'
                                    }}>
                                        {tip.title}
                                    </div>
                                    <div style={{ 
                                        fontSize: '0.875rem', 
                                        color: 'var(--text-light)',
                                        lineHeight: 1.5
                                    }}>
                                        {tip.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
            
            {/* Modals */}
            {showGoalModal && <GoalModal />}
        </div>
    );
};

export default Savings;