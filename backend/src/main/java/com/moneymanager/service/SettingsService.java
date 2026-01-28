package com.moneymanager.service;

import com.moneymanager.model.Settings;
import com.moneymanager.repository.SettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    @Autowired
    private SettingsRepository settingsRepository;

    public Settings getSettings() {
        return settingsRepository.findById(1L)
                .orElseGet(() -> {
                    Settings defaultSettings = new Settings();
                    return settingsRepository.save(defaultSettings);
                });
    }

    public Settings updateSettings(Settings settings) {
        settings.setId(1L); // Ensure we always update the same record
        return settingsRepository.save(settings);
    }
}
