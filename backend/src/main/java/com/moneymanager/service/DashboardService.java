package com.moneymanager.service;

import com.moneymanager.dto.DashboardStatsDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class DashboardService {
    
    @Autowired
    private TransactionService transactionService;
    
    public DashboardStatsDTO getDashboardStats() {
        Double totalIncome = transactionService.getTotalIncome();
        Double totalExpenses = transactionService.getTotalExpenses();
        Double currentBalance = totalIncome - totalExpenses;
        
        // Calculate monthly savings (25% of income)
        Double monthlySavings = totalIncome * 0.25;
        
        // Calculate savings percentage
        Double savingsTarget = totalIncome * 0.30; // 30% target
        String savingsPercentage = savingsTarget > 0 ? 
            String.format("%.0f%%", (monthlySavings / savingsTarget) * 100) : "0%";
        
        return new DashboardStatsDTO(
            round(totalIncome, 2),
            round(totalExpenses, 2),
            round(currentBalance, 2),
            round(monthlySavings, 2),
            "+12%", // Mock data for changes
            "-5%",  // Mock data for changes
            savingsPercentage
        );
    }
    
    private Double round(Double value, int places) {
        if (value == null) return 0.0;
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
