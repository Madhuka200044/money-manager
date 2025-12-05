package com.moneymanager.dto;

public class DashboardStatsDTO {
    private Double totalIncome;
    private Double totalExpenses;
    private Double currentBalance;
    private Double monthlySavings;
    private String incomeChange;
    private String expenseChange;
    private String savingsPercentage;
    
    // Constructors
    public DashboardStatsDTO() {}
    
    public DashboardStatsDTO(Double totalIncome, Double totalExpenses, Double currentBalance, 
                            Double monthlySavings, String incomeChange, String expenseChange, 
                            String savingsPercentage) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.currentBalance = currentBalance;
        this.monthlySavings = monthlySavings;
        this.incomeChange = incomeChange;
        this.expenseChange = expenseChange;
        this.savingsPercentage = savingsPercentage;
    }
    
    // Getters and Setters
    public Double getTotalIncome() { return totalIncome; }
    public void setTotalIncome(Double totalIncome) { this.totalIncome = totalIncome; }
    
    public Double getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(Double totalExpenses) { this.totalExpenses = totalExpenses; }
    
    public Double getCurrentBalance() { return currentBalance; }
    public void setCurrentBalance(Double currentBalance) { this.currentBalance = currentBalance; }
    
    public Double getMonthlySavings() { return monthlySavings; }
    public void setMonthlySavings(Double monthlySavings) { this.monthlySavings = monthlySavings; }
    
    public String getIncomeChange() { return incomeChange; }
    public void setIncomeChange(String incomeChange) { this.incomeChange = incomeChange; }
    
    public String getExpenseChange() { return expenseChange; }
    public void setExpenseChange(String expenseChange) { this.expenseChange = expenseChange; }
    
    public String getSavingsPercentage() { return savingsPercentage; }
    public void setSavingsPercentage(String savingsPercentage) { this.savingsPercentage = savingsPercentage; }
}
