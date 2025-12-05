package com.moneymanager.dto;

import java.time.LocalDate;

public class TransactionDTO {
    private Long id;
    private String description;
    private String category;
    private LocalDate date;
    private Double amount;
    private String type;
    
    // Constructors
    public TransactionDTO() {}
    
    public TransactionDTO(String description, String category, LocalDate date, Double amount, String type) {
        this.description = description;
        this.category = category;
        this.date = date;
        this.amount = amount;
        this.type = type;
    }
    
    public TransactionDTO(Long id, String description, String category, LocalDate date, Double amount, String type) {
        this.id = id;
        this.description = description;
        this.category = category;
        this.date = date;
        this.amount = amount;
        this.type = type;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
