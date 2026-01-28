-- DO NOT DELETE FROM tables that don't exist yet

-- Insert default user
INSERT INTO users (username, password, email, full_name) VALUES
('admin', 'password123', 'admin@example.com', 'Madhuka');

-- Insert sample transactions
INSERT INTO transactions (description, category, date, amount, type) VALUES
('Amazon Purchase Online Shopping', 'Shopping', '2023-10-12', 89.99, 'EXPENSE'),
('Monthly Salary Company Inc.', 'Income', '2023-10-10', 3500.00, 'INCOME'),
('Restaurant Dinner Italian Blanco', 'Food & Dining', '2023-10-08', 67.50, 'EXPENSE'),
('Gas Station Fuel', 'Transportation', '2023-10-05', 45.20, 'EXPENSE'),
('Internet Bill Monthly Subscription', 'Bills & Utilities', '2023-10-03', 79.99, 'EXPENSE'),
('Freelance Project Payment', 'Income', '2023-10-01', 1200.00, 'INCOME'),
('Grocery Shopping', 'Food & Dining', '2023-09-28', 120.50, 'EXPENSE'),
('Netflix Subscription', 'Entertainment', '2023-09-25', 15.99, 'EXPENSE'),
('Electricity Bill', 'Bills & Utilities', '2023-09-20', 85.75, 'EXPENSE'),
('Bonus Payment', 'Income', '2023-09-15', 500.00, 'INCOME'),
('Uber Ride', 'Transportation', '2023-09-10', 25.50, 'EXPENSE'),
('Clothing Purchase', 'Shopping', '2023-09-05', 89.99, 'EXPENSE'),
('Stock Dividend', 'Investment', '2023-09-01', 150.00, 'INCOME');

-- Insert sample budgets
INSERT INTO budgets (category, allocated_amount, spent_amount, remaining_amount, percentage_spent) VALUES
('Food & Dining', 600.00, 187.50, 412.50, 31),
('Transportation', 300.00, 70.70, 229.30, 24),
('Shopping', 300.00, 179.98, 120.02, 60),
('Bills & Utilities', 500.00, 165.74, 334.26, 33),
('Entertainment', 150.00, 15.99, 134.01, 11);