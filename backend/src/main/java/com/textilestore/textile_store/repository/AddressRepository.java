
package com.textilestore.textile_store.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.textilestore.textile_store.entity.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    // Get all addresses belonging to a customer
    List<Address> findByUserId(Long userId);

    // Get one address using address ID and customer ID
    Optional<Address> findByIdAndUserId(Long id, Long userId);

    // Get the default address of a customer
    Optional<Address> findByUserIdAndDefaultAddressTrue(Long userId);

}
