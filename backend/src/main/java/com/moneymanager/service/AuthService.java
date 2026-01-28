package com.moneymanager.service;

import com.moneymanager.model.User;
import com.moneymanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User register(User user) throws Exception {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new Exception("Username already exists");
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new Exception("Email already exists");
        }
        return userRepository.save(user);
    }

    public User login(String username, String password) throws Exception {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            return userOpt.get();
        }
        throw new Exception("Invalid username or password");
    }

    public User updateCredentials(Long userId, String newUsername, String newPassword) throws Exception {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new Exception("User not found"));

        if (newUsername != null && !newUsername.isEmpty()) {
            Optional<User> existing = userRepository.findByUsername(newUsername);
            if (existing.isPresent() && !existing.get().getId().equals(userId)) {
                throw new Exception("Username already taken");
            }
            user.setUsername(newUsername);
        }

        if (newPassword != null && !newPassword.isEmpty()) {
            user.setPassword(newPassword);
        }

        return userRepository.save(user);
    }
}
