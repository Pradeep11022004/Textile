
package com.textilestore.textile_store.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.textilestore.textile_store.dto.AddressRequest;
import com.textilestore.textile_store.dto.AddressResponse;
import com.textilestore.textile_store.entity.Address;
import com.textilestore.textile_store.entity.User;
import com.textilestore.textile_store.repository.AddressRepository;
import com.textilestore.textile_store.repository.UserRepository;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    public AddressService(
            AddressRepository addressRepository,
            UserRepository userRepository) {

        this.addressRepository = addressRepository;
        this.userRepository = userRepository;
    }

    // Add a new address
    @Transactional
    public AddressResponse addAddress(AddressRequest request) {

        validateAddress(request);

        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Address address = new Address();

        address.setUser(user);
        updateAddressFields(address, request);

        if (Boolean.TRUE.equals(request.getDefaultAddress())) {
            removeExistingDefault(user.getId());
            address.setDefaultAddress(true);
        }

        Address savedAddress = addressRepository.save(address);

        return convertToResponse(savedAddress);
    }

    // Get all addresses of a customer
    @Transactional(readOnly = true)
    public List<AddressResponse> getAddresses(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        return addressRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // Update an existing address
    @Transactional
    public AddressResponse updateAddress(
            Long addressId,
            Long userId,
            AddressRequest request) {

        validateAddress(request);

        if (userId == null) {
            throw new IllegalArgumentException("User ID is required");
        }

        Address address = addressRepository
                .findByIdAndUserId(addressId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Address not found"));

        updateAddressFields(address, request);

        if (Boolean.TRUE.equals(request.getDefaultAddress())) {
            removeExistingDefault(userId);
            address.setDefaultAddress(true);
        }

        Address updatedAddress = addressRepository.save(address);

        return convertToResponse(updatedAddress);
    }

    // Delete an address
    @Transactional
    public void deleteAddress(Long addressId, Long userId) {

        Address address = addressRepository
                .findByIdAndUserId(addressId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Address not found"));

        addressRepository.delete(address);
    }

    // Set an address as default
    @Transactional
    public AddressResponse setDefaultAddress(
            Long addressId,
            Long userId) {

        Address address = addressRepository
                .findByIdAndUserId(addressId, userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Address not found"));

        removeExistingDefault(userId);

        address.setDefaultAddress(true);

        Address savedAddress = addressRepository.save(address);

        return convertToResponse(savedAddress);
    }

    // Remove the previous default address
    private void removeExistingDefault(Long userId) {

        addressRepository.findByUserIdAndDefaultAddressTrue(userId)
                .ifPresent(address -> {
                    address.setDefaultAddress(false);
                    addressRepository.save(address);
                });
    }

    // Validate address information
    private void validateAddress(AddressRequest request) {

        if (request == null) {
            throw new IllegalArgumentException("Address data is required");
        }

        if (isBlank(request.getFullName())
                || isBlank(request.getPhone())
                || isBlank(request.getAddressLine())
                || isBlank(request.getCity())
                || isBlank(request.getState())
                || isBlank(request.getPincode())
                || isBlank(request.getAddressType())) {

            throw new IllegalArgumentException(
                    "All address fields are required");
        }

        if (!request.getPhone().matches("\\d{10}")) {
            throw new IllegalArgumentException(
                    "Phone number must contain exactly 10 digits");
        }

        if (!request.getPincode().matches("\\d{6}")) {
            throw new IllegalArgumentException(
                    "Pincode must contain exactly 6 digits");
        }

        if (!request.getAddressType().equals("HOME")
                && !request.getAddressType().equals("WORK")) {

            throw new IllegalArgumentException(
                    "Address type must be HOME or WORK");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    // Set address fields
    private void updateAddressFields(
            Address address,
            AddressRequest request) {

        address.setFullName(request.getFullName().trim());
        address.setPhone(request.getPhone().trim());
        address.setAddressLine(request.getAddressLine().trim());
        address.setCity(request.getCity().trim());
        address.setState(request.getState().trim());
        address.setPincode(request.getPincode().trim());
        address.setAddressType(request.getAddressType().trim().toUpperCase());
    }

    // Convert entity into response DTO
    private AddressResponse convertToResponse(Address address) {

        return new AddressResponse(
                address.getId(),
                address.getFullName(),
                address.getPhone(),
                address.getAddressLine(),
                address.getCity(),
                address.getState(),
                address.getPincode(),
                address.getAddressType(),
                address.isDefaultAddress()
        );
    }
}
