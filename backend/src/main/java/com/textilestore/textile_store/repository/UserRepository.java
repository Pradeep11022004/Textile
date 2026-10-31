
package com.textilestore.textile_store.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.textilestore.textile_store.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);
}
