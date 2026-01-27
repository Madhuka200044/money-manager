package com.moneymanager.model;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

@Entity
@Table(name = "bills")
public class Bill implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "due_date", nullable = false)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;

    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid = false;

    @Column(nullable = false)
    private String category;

    // Constructors
    public Bill() {
    }

    public Bill(String description, Double amount, LocalDate dueDate, String category) {
        this.description = description;
        this.amount = amount;
        this.dueDate = dueDate;
        this.category = category;
        this.isPaid = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Boolean getIsPaid() {
        return isPaid;
    }

    public void setIsPaid(Boolean isPaid) {
        this.isPaid = isPaid;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    @Override
    public String toString() {
        return "Bill{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", amount=" + amount +
                ", dueDate=" + dueDate +
                ", isPaid=" + isPaid +
                ", category='" + category + '\'' +
                '}';
    }
}
