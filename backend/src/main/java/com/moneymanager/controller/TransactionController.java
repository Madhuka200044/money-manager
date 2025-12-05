package com.moneymanager.controller;

import com.moneymanager.model.Transaction;
import com.moneymanager.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:3000")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @GetMapping
    public ResponseEntity<List<Transaction>> getAllTransactions() {
        List<Transaction> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<Transaction>> getRecentTransactions() {
        List<Transaction> recentTransactions = transactionService.getRecentTransactions(10);
        return ResponseEntity.ok(recentTransactions);
    }
    
    @PostMapping
public ResponseEntity<Transaction> createTransaction(@RequestBody Transaction transaction) {
    Transaction savedTransaction = transactionService.saveTransaction(transaction);
    return ResponseEntity.ok(savedTransaction);
}
}
