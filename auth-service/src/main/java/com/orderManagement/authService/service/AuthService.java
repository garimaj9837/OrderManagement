package com.orderManagement.authService.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orderManagement.authService.dto.LoginRequest;
import com.orderManagement.authService.dto.RegisterRequest;
import com.orderManagement.authService.entity.User;
import com.orderManagement.authService.jwt.JwtUtil;
import com.orderManagement.authService.repository.UserRepository;

@Service
public class AuthService {

	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Autowired
	UserRepository userRepo;
	
	@Autowired
	JwtUtil jwtUtil;
	
	public User registerUser(RegisterRequest req) {
		User user=new User();
		user.setUsername(req.username());
		user.setPassword(passwordEncoder.encode(req.password())); // store password in bcrypt encoded form //by adding random salt in password
		user.setRole("USER");
		return userRepo.save(user);
	}
	
	public String loginUser(LoginRequest req) {
		User user=userRepo.findByUsername(req.username())
				.orElseThrow(()->new RuntimeException("User not found!"));
		
		if(!passwordEncoder.matches(req.password(),user.getPassword())) {  //extract salt from hashed password, use same salt to hash provided password, if both password match then password is same.
			throw new RuntimeException("Invalid Password!");
		}
		//if username and password is correct then generate token
		return jwtUtil.generateToken(req.username());
	}
}
