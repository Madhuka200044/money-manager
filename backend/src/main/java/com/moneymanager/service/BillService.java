package com.moneymanager.service;

import com.moneymanager.model.Bill;
import com.moneymanager.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public List<Bill> getUnpaidBills() {
        return billRepository.findByIsPaidFalseOrderByDueDateAsc();
    }

    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }

    public Bill updateBill(Long id, Bill billDetails) {
        Optional<Bill> billOptional = billRepository.findById(id);
        if (billOptional.isPresent()) {
            Bill bill = billOptional.get();
            bill.setDescription(billDetails.getDescription());
            bill.setAmount(billDetails.getAmount());
            bill.setDueDate(billDetails.getDueDate());
            bill.setCategory(billDetails.getCategory());
            bill.setIsPaid(billDetails.getIsPaid());
            return billRepository.save(bill);
        }
        return null;
    }

    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }

    public Bill toggleBillStatus(Long id) {
        Optional<Bill> billOptional = billRepository.findById(id);
        if (billOptional.isPresent()) {
            Bill bill = billOptional.get();
            bill.setIsPaid(!bill.getIsPaid());
            return billRepository.save(bill);
        }
        return null;
    }
}
