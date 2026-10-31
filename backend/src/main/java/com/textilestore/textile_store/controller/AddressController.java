
package com.textilestore.textile_store.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.textilestore.textile_store.dto.AddressRequest;
import com.textilestore.textile_store.dto.AddressResponse;
import com.textilestore.textile_store.service.AddressService;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "http://localhost:5173")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // Add a new address
    @PostMapping
    public ResponseEntity<AddressResponse> addAddress(
            @RequestBody AddressRequest request) {

        AddressResponse response = addressService.addAddress(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all addresses of a customer
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressResponse>> getAddresses(
            @PathVariable Long userId) {

        List<AddressResponse> addresses =
                addressService.getAddresses(userId);

        return ResponseEntity.ok(addresses);
    }

    // Update an existing address
    @PutMapping("/{addressId}/user/{userId}")
    public ResponseEntity<AddressResponse> updateAddress(
            @PathVariable Long addressId,
            @PathVariable Long userId,
            @RequestBody AddressRequest request) {

        AddressResponse response = addressService.updateAddress(
                addressId, userId, request);

        return ResponseEntity.ok(response);
    }

    // Delete an address
    @DeleteMapping("/{addressId}/user/{userId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Long addressId,
            @PathVariable Long userId) {

        addressService.deleteAddress(addressId, userId);

        return ResponseEntity.noContent().build();
    }

    // Set an address as default
    @PutMapping("/{addressId}/user/{userId}/default")
    public ResponseEntity<AddressResponse> setDefaultAddress(
            @PathVariable Long addressId,
            @PathVariable Long userId) {

        AddressResponse response =
                addressService.setDefaultAddress(addressId, userId);

        return ResponseEntity.ok(response);
    }
}
