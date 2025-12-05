package com.moneymanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class MoneyManagerApplication {
    public static void main(String[] args) {
        SpringApplication.run(MoneyManagerApplication.class, args);
        System.out.println("\n=========================================");
        System.out.println("💰 Money Manager Backend Started!");
        System.out.println("=========================================");
        System.out.println("Local: http://localhost:8080");
        System.out.println("API Endpoints:");
        System.out.println("  • GET /api/dashboard/stats");
        System.out.println("  • GET /api/transactions");
        System.out.println("  • GET /api/budgets");
        System.out.println("H2 Console: http://localhost:8080/h2-console");
        System.out.println("=========================================\n");
    }
    
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
