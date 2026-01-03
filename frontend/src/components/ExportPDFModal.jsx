import React, { useState } from 'react';
import { FiX, FiFileText, FiDownload, FiCalendar, FiCheck } from 'react-icons/fi';

const ExportPDFModal = ({ isOpen, onClose }) => {
    const [exportType, setExportType] = useState('expenses');
    const [dateRange, setDateRange] = useState('last30');
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeTransactions, setIncludeTransactions] = useState(true);
    const [includeBudgets, setIncludeBudgets] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    if (!isOpen) return null;

    const handleExport = () => {
        setIsGenerating(true);
        setProgress(0);
        
        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsGenerating(false);
                    setIsComplete(true);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const handleDownload = () => {
        // Create and download the report
        const report = generateReport();
        const blob = new Blob([report], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `money-manager-report-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        onClose();
    };

    const generateReport = () => {
        return `=== MONEY MANAGER EXPENSE REPORT ===\n\nGenerated on: ${new Date().toLocaleString()}\n\nThis is a sample report.`;
    };

    const exportOptions = [
        { 
            id: 'expenses', 
            title: 'Expenses Only', 
            description: 'Detailed expense breakdown',
            icon: '💰'
        },
        { 
            id: 'full', 
            title: 'Full Report', 
            description: 'Complete financial overview',
            icon: '📊'
        },
        { 
            id: 'budget', 
            title: 'Budget Report', 
            description: 'Budget vs actual analysis',
            icon: '🎯'
        },
        { 
            id: 'tax', 
            title: 'Tax Summary', 
            description: 'Tax-deductible expenses',
            icon: '📋'
        }
    ];

    const dateRanges = [
        { id: 'last7', label: 'Last 7 Days' },
        { id: 'last30', label: 'Last 30 Days' },
        { id: 'last90', label: 'Last 90 Days' },
        { id: 'currentMonth', label: 'Current Month' },
        { id: 'lastMonth', label: 'Last Month' },
        { id: 'custom', label: 'Custom Range' }
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content export-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Export Expense Report</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                {!isComplete ? (
                    <div className="modal-form">
                        {/* Export Type Selection */}
                        <div className="form-group">
                            <label>Report Type</label>
                            <div className="export-options">
                                {exportOptions.map((option) => (
                                    <div 
                                        key={option.id}
                                        className={`export-option ${exportType === option.id ? 'selected' : ''}`}
                                        onClick={() => setExportType(option.id)}
                                    >
                                        <div className="export-option-icon">
                                            {option.icon}
                                        </div>
                                        <div className="export-option-title">
                                            {option.title}
                                        </div>
                                        <div className="export-option-description">
                                            {option.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="form-group">
                            <label>Date Range</label>
                            <div className="export-date-range">
                                {dateRanges.map((range) => (
                                    <label key={range.id} className="export-checkbox">
                                        <input
                                            type="radio"
                                            name="dateRange"
                                            value={range.id}
                                            checked={dateRange === range.id}
                                            onChange={() => setDateRange(range.id)}
                                        />
                                        <span className="export-checkbox-label">
                                            {range.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Include Options */}
                        <div className="form-group">
                            <label>Include in Report</label>
                            <div className="export-checkboxes">
                                <label className="export-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={includeCharts}
                                        onChange={() => setIncludeCharts(!includeCharts)}
                                    />
                                    <div>
                                        <div className="export-checkbox-label">Charts & Graphs</div>
                                        <div className="export-checkbox-description">
                                            Visual representation of your data
                                        </div>
                                    </div>
                                </label>
                                <label className="export-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={includeTransactions}
                                        onChange={() => setIncludeTransactions(!includeTransactions)}
                                    />
                                    <div>
                                        <div className="export-checkbox-label">Transaction Details</div>
                                        <div className="export-checkbox-description">
                                            All individual transactions
                                        </div>
                                    </div>
                                </label>
                                <label className="export-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={includeBudgets}
                                        onChange={() => setIncludeBudgets(!includeBudgets)}
                                    />
                                    <div>
                                        <div className="export-checkbox-label">Budget Analysis</div>
                                        <div className="export-checkbox-description">
                                            Budget vs actual spending
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        {isGenerating && (
                            <div className="export-progress">
                                <div className="progress-bar-container">
                                    <div 
                                        className="progress-bar-fill"
                                        style={{ width: `${progress}%` }}
                                    ></div>
                                </div>
                                <div className="progress-text">
                                    <span>Generating report...</span>
                                    <span>{progress}%</span>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="modal-actions">
                            <button 
                                className="btn-secondary" 
                                onClick={onClose}
                                disabled={isGenerating}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleExport}
                                disabled={isGenerating}
                                style={{ minWidth: '140px' }}
                            >
                                {isGenerating ? (
                                    <>
                                        <div className="spinner"></div>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <FiFileText /> Generate PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Success Screen */
                    <div className="export-success">
                        <div className="export-success-icon">
                            <FiCheck />
                        </div>
                        <h3>Report Generated Successfully!</h3>
                        <p>Your expense report is ready to download.</p>
                        <div className="modal-actions">
                            <button 
                                className="btn-secondary" 
                                onClick={() => {
                                    setIsComplete(false);
                                    setProgress(0);
                                }}
                            >
                                Create Another
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleDownload}
                                style={{ minWidth: '140px' }}
                            >
                                <FiDownload /> Download PDF
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExportPDFModal;