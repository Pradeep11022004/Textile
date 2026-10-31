
package com.textilestore.textile_store.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.textilestore.textile_store.entity.CustomerReview;

@Repository
public interface CustomerReviewRepository
        extends JpaRepository<CustomerReview, Long> {

    // Get all reviews, newest first
    List<CustomerReview> findAllByOrderByCreatedAtDesc();

    // Get reviews submitted by a particular customer
    List<CustomerReview> findByUserId(Long userId);
}
