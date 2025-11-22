package com.orderManagement.authService.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orderManagement.authService.entity.User;

public interface UserRepository extends JpaRepository<User,Long> {

	public Optional<User> findByUsername(String username);
}
