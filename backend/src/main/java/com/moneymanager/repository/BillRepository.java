package com.moneymanager.repository;

import com.moneymanager.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    List<Bill> findByIsPaidFalseOrderByDueDateAsc();
}
