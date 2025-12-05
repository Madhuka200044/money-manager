package com.moneymanager.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "budgets")
public class Budget implements Serializable {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String category;
    
    @Column(name = "allocated_amount", nullable = false)
    private Double allocatedAmount;
    
    @Column(name = "spent_amount", nullable = false)
    private Double spentAmount;
    
    @Column(name = "remaining_amount", nullable = false)
    private Double remainingAmount;
    
    @Column(name = "percentage_spent", nullable = false)
    private Integer percentageSpent;
    
    // Constructors
    public Budget() {}
    
    public Budget(String category, Double allocatedAmount, Double spentAmount, 
                  Double remainingAmount, Integer percentageSpent) {
        this.category = category;
        this.allocatedAmount = allocatedAmount;
        this.spentAmount = spentAmount;
        this.remainingAmount = remainingAmount;
        this.percentageSpent = percentageSpent;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Double getAllocatedAmount() { return allocatedAmount; }
    public void setAllocatedAmount(Double allocatedAmount) { this.allocatedAmount = allocatedAmount; }
    
    public Double getSpentAmount() { return spentAmount; }
    public void setSpentAmount(Double spentAmount) { this.spentAmount = spentAmount; }
    
    public Double getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(Double remainingAmount) { this.remainingAmount = remainingAmount; }
    
    public Integer getPercentageSpent() { return percentageSpent; }
    public void setPercentageSpent(Integer percentageSpent) { this.percentageSpent = percentageSpent; }
}
