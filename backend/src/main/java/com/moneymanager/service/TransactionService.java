package com.moneymanager.service;

import com.moneymanager.model.Transaction;
import com.moneymanager.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TransactionService {
    
    @Autowired
    private TransactionRepository transactionRepository;
    
    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAllByOrderByDateDesc();
    }
    
    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }
    
    public Double getTotalIncome() {
        List<Transaction> incomeTransactions = transactionRepository.findByType("INCOME");
        double total = 0.0;
        for (Transaction transaction : incomeTransactions) {
            total += transaction.getAmount();
        }
        return total;
    }
    
    public Double getTotalExpenses() {
        List<Transaction> expenseTransactions = transactionRepository.findByType("EXPENSE");
        double total = 0.0;
        for (Transaction transaction : expenseTransactions) {
            total += transaction.getAmount();
        }
        return total;
    }
    
    public List<Transaction> getRecentTransactions(int limit) {
        List<Transaction> allTransactions = getAllTransactions();
        return allTransactions.stream()
                .limit(limit)
                .toList();
    }
}
