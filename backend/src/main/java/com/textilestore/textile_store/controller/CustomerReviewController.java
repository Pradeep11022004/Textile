
package com.textilestore.textile_store.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.textilestore.textile_store.dto.ReviewRequest;
import com.textilestore.textile_store.dto.ReviewResponse;
import com.textilestore.textile_store.service.CustomerReviewService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerReviewController {

    private final CustomerReviewService reviewService;

    public CustomerReviewController(CustomerReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // Add a customer review
    @PostMapping
    public ResponseEntity<ReviewResponse> addReview(
            @RequestBody ReviewRequest request) {

        ReviewResponse response = reviewService.addReview(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all customer reviews
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {

        List<ReviewResponse> reviews = reviewService.getAllReviews();

        return ResponseEntity.ok(reviews);
    }
}
