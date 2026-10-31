
package com.textilestore.textile_store.controller;

import java.util.Map;



import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public Map<String, Object> getUserById(
            @PathVariable Long id) {

        User user = userService.getUserById(id);

        return Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "role", user.getRole().name(),
                "enabled", user.isEnabled()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(
            @RequestBody User user) {

        User savedUser = userService.registerUser(user);

        Map<String, Object> response = Map.of(
                "message", "Registration successful",
                "id", savedUser.getId(),
                "name", savedUser.getName(),
                "email", savedUser.getEmail(),
                "role", savedUser.getRole().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }
}

