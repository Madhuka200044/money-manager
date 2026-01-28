package com.moneymanager.controller;

import com.moneymanager.model.Settings;
import com.moneymanager.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:3000")
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping
    public ResponseEntity<Settings> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Settings Controller is working!");
    }

    @PutMapping
    public ResponseEntity<Settings> updateSettings(@RequestBody Settings settings) {
        return ResponseEntity.ok(settingsService.updateSettings(settings));
    }
}
