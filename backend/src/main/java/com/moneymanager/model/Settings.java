package com.moneymanager.model;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "user_settings")
public class Settings implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Profile
    private String username;
    private String email;
    private String currency;
    private String language;

    // Preferences
    private boolean notifications;
    private boolean twoFactorAuth;
    private boolean autoBackup;
    private boolean budgetAlerts;
    private boolean spendingLimits;
    private boolean emailReports;

    // Display
    private String theme; // "dark" or "light"
    private boolean compactMode;
    private boolean showCharts;
    private boolean showTips;

    public Settings() {
        // Defaults
        this.username = "Alex Johnson";
        this.email = "alex.johnson@example.com";
        this.currency = "USD";
        this.language = "en";
        this.notifications = true;
        this.twoFactorAuth = false;
        this.autoBackup = true;
        this.budgetAlerts = true;
        this.spendingLimits = true;
        this.emailReports = true;
        this.theme = "light";
        this.compactMode = false;
        this.showCharts = true;
        this.showTips = true;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public boolean isNotifications() {
        return notifications;
    }

    public void setNotifications(boolean notifications) {
        this.notifications = notifications;
    }

    public boolean isTwoFactorAuth() {
        return twoFactorAuth;
    }

    public void setTwoFactorAuth(boolean twoFactorAuth) {
        this.twoFactorAuth = twoFactorAuth;
    }

    public boolean isAutoBackup() {
        return autoBackup;
    }

    public void setAutoBackup(boolean autoBackup) {
        this.autoBackup = autoBackup;
    }

    public boolean isBudgetAlerts() {
        return budgetAlerts;
    }

    public void setBudgetAlerts(boolean budgetAlerts) {
        this.budgetAlerts = budgetAlerts;
    }

    public boolean isSpendingLimits() {
        return spendingLimits;
    }

    public void setSpendingLimits(boolean spendingLimits) {
        this.spendingLimits = spendingLimits;
    }

    public boolean isEmailReports() {
        return emailReports;
    }

    public void setEmailReports(boolean emailReports) {
        this.emailReports = emailReports;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean isCompactMode() {
        return compactMode;
    }

    public void setCompactMode(boolean compactMode) {
        this.compactMode = compactMode;
    }

    public boolean isShowCharts() {
        return showCharts;
    }

    public void setShowCharts(boolean showCharts) {
        this.showCharts = showCharts;
    }

    public boolean isShowTips() {
        return showTips;
    }

    public void setShowTips(boolean showTips) {
        this.showTips = showTips;
    }
}
