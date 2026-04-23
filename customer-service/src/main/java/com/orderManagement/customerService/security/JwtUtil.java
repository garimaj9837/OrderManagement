package com.orderManagement.customerService.security;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;

@Component
public class JwtUtil {

	@Value("${jwt.secret}")
    private String secret;
	
	public Long extractUserId(String token) {
	    String subject = Jwts.parser()
	            .setSigningKey(secret)
	            .parseClaimsJws(token)
	            .getBody()
	            .getSubject();

	    return Long.parseLong(subject); 
	}
}
