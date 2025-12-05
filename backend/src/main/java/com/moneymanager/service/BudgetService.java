package com.moneymanager.service;

import com.moneymanager.model.Budget;
import com.moneymanager.repository.BudgetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BudgetService {
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    public List<Budget> getAllBudgets() {
        return budgetRepository.findAll();
    }
    
    public Budget saveBudget(Budget budget) {
        // Calculate remaining amount
        budget.setRemainingAmount(budget.getAllocatedAmount() - budget.getSpentAmount());
        
        // Calculate percentage spent
        if (budget.getAllocatedAmount() > 0) {
            double percentage = (budget.getSpentAmount() / budget.getAllocatedAmount()) * 100;
            budget.setPercentageSpent((int) Math.round(percentage));
        } else {
            budget.setPercentageSpent(0);
        }
        
        return budgetRepository.save(budget);
    }
    
    public Budget updateBudgetSpent(String category, Double spentAmount) {
        Budget budget = budgetRepository.findByCategory(category);
        if (budget != null) {
            budget.setSpentAmount(budget.getSpentAmount() + spentAmount);
            return saveBudget(budget);
        }
        return null;
    }
}
