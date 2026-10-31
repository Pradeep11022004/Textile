
package com.textilestore.textile_store.service;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.entity.UserRole;
import com.textilestore.textile_store.repository.UserRepository;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
    	   this.userRepository = userRepository;
    	    this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException(
                    "User details are required");
        }

        if (user.getName() == null
                || user.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Name is required");
        }

        if (user.getEmail() == null
                || user.getEmail().isBlank()) {
            throw new IllegalArgumentException(
                    "Email is required");
        }

        if (user.getPassword() == null
                || user.getPassword().isBlank()) {
            throw new IllegalArgumentException(
                    "Password is required");
        }

        String email = user.getEmail().trim()
                .toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new IllegalArgumentException(
                    "Email is already registered");
        }

        user.setName(user.getName().trim());
        user.setEmail(email);

        // Public registration must never create an admin account.
        user.setRole(UserRole.CUSTOMER);
        user.setEnabled(true);

        // Password hashing will be added with Spring Security.
        // Never save plain-text passwords in a real application.

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found with ID: " + id));
    }

    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                    "Email is required");
        }

        String normalizedEmail = email.trim()
                .toLowerCase(Locale.ROOT);

        return userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found"));
    }

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
