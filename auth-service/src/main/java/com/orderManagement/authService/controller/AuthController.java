package com.orderManagement.authService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orderManagement.authService.dto.LoginRequest;
import com.orderManagement.authService.dto.RegisterRequest;
import com.orderManagement.authService.entity.User;
import com.orderManagement.authService.jwt.JwtUtil;
import com.orderManagement.authService.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
	
	@Autowired
	AuthService authService;
	
	@Autowired
	JwtUtil jwtUtil;

	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody RegisterRequest req) {
		authService.registerUser(req);
		return ResponseEntity.ok("User Registered Successfully");
	}
	
	@PostMapping("/login")
	public ResponseEntity<String> loginUser(@RequestBody LoginRequest req) {
		return ResponseEntity.ok(authService.loginUser(req));
	}
	
	@GetMapping("/user/{username}")
	public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
		User user = authService.getUserByUsername(username);
		// Don't return password
		user.setPassword(null);
		return ResponseEntity.ok(user);
	}
	
	@GetMapping("/users")
	public ResponseEntity<java.util.List<User>> getAllUsers() {
		java.util.List<User> users = authService.getAllUsers();
		// Don't return passwords
		users.forEach(user -> user.setPassword(null));
		return ResponseEntity.ok(users);
	}

}
