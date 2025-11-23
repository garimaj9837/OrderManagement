package com.orderManagement.authService.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orderManagement.authService.dto.LoginRequest;
import com.orderManagement.authService.dto.RegisterRequest;
import com.orderManagement.authService.service.AuthService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
	
	@Autowired
	AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<String> registerUser(@RequestBody RegisterRequest req) {
		authService.registerUser(req);
		return ResponseEntity.ok("User Registered Successfully");
	}
	
	@PostMapping("/login")
	public ResponseEntity<String> loginUser(@RequestBody LoginRequest req) {
		return ResponseEntity.ok(authService.loginUser(req));
	}

}
