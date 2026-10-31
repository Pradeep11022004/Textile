
package com.textilestore.textile_store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.dto.ReviewRequest;
import com.textilestore.textile_store.dto.ReviewResponse;
import com.textilestore.textile_store.entity.CustomerReview;
import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.repository.CustomerReviewRepository;
import com.textilestore.textile_store.repository.UserRepository;

@Service
public class CustomerReviewService {

    private final CustomerReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public CustomerReviewService(
            CustomerReviewRepository reviewRepository,
            UserRepository userRepository) {

        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    // Save a new customer review
    public ReviewResponse addReview(ReviewRequest request) {

        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        if (request.getRating() == null
                || request.getRating() < 1
                || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        if (request.getComment() == null
                || request.getComment().trim().isEmpty()) {
            throw new IllegalArgumentException("Review comment is required");
        }

        if (request.getComment().trim().length() > 1000) {
            throw new IllegalArgumentException("Review cannot exceed 1000 characters");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        CustomerReview review = new CustomerReview(
                user,
                request.getRating(),
                request.getComment().trim()
        );

        CustomerReview savedReview = reviewRepository.save(review);

        return convertToResponse(savedReview);
    }

    // Get all reviews
    @Transactional(readOnly = true)
    public List<ReviewResponse> getAllReviews() {

        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Convert entity into response DTO
    private ReviewResponse convertToResponse(CustomerReview review) {

        return new ReviewResponse(
                review.getId(),
                review.getUser().getName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
