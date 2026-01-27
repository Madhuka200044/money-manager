package com.moneymanager.controller;

import com.moneymanager.model.Bill;
import com.moneymanager.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:3000")
public class BillController {

    @Autowired
    private BillService billService;

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/unpaid")
    public ResponseEntity<List<Bill>> getUnpaidBills() {
        return ResponseEntity.ok(billService.getUnpaidBills());
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        System.out.println("Received request to create bill: " + bill);
        try {
            Bill savedBill = billService.saveBill(bill);
            System.out.println("Successfully saved bill: " + savedBill);
            return ResponseEntity.ok(savedBill);
        } catch (Exception e) {
            System.err.println("Error creating bill: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id, @RequestBody Bill bill) {
        Bill updatedBill = billService.updateBill(id, bill);
        if (updatedBill != null) {
            return ResponseEntity.ok(updatedBill);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        billService.deleteBill(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<Bill> toggleBillStatus(@PathVariable Long id) {
        Bill updatedBill = billService.toggleBillStatus(id);
        if (updatedBill != null) {
            return ResponseEntity.ok(updatedBill);
        }
        return ResponseEntity.notFound().build();
    }
}
