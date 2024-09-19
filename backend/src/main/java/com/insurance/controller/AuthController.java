package com.insurance.controller;

import org.slf4j.LoggerFactory;


import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.response.JWTAuthResponse;
import com.insurance.response.ProfileResponse;
import com.insurance.security.JwtTokenProvider;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

import com.insurance.request.LoginDto;
import com.insurance.request.ProfileRequest;
import com.insurance.request.ChangePasswordRequest;
import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.IAuthService;


@RestController
@RequestMapping("/SecureLife.com")
public class AuthController {

	@Autowired
	private IAuthService service;
	
	@Autowired
	JwtTokenProvider jwtTokenProvider;
    

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    // Build Login REST API
    @PostMapping("/login")
    @Operation(summary = "Login  -- For All")
    public ResponseEntity<JWTAuthResponse> login(@RequestBody LoginDto loginDto){
    	logger.info("A user is trying to login: " + loginDto.getUsernameOrEmail());
        String token = service.login(loginDto);
        String role = service.getRole(token);
        JWTAuthResponse jwtAuthResponse = new JWTAuthResponse();
        jwtAuthResponse.setUsername(loginDto.getUsernameOrEmail());
        jwtAuthResponse.setRole(role);
        return ResponseEntity.ok()
        	    .header(HttpHeaders.AUTHORIZATION, token)
        	    .body(jwtAuthResponse);

    }
    
    
    @PutMapping("/profile/update")
    @Operation(summary = "Profile update  -- For All")
    public ResponseEntity<String>updateProfile(HttpServletRequest request,@RequestBody ProfileRequest profileRequest){
       String authorizationHeader = request.getHeader("Authorization");
         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
             String token = authorizationHeader.substring(7);
             if(service.getRole(token) != null) {
                 String response = service.profileUpdate(token,profileRequest );
                 return new ResponseEntity<>(response, HttpStatus.OK);
             }
             throw new UnauthorizedException("Token is invalid or empty");
         }
         throw new UnauthorizedException("Token is invalid or empty");         
    }
    
    @GetMapping("/profile/view")
    @Operation(summary = "Get Profile  -- For All")
    public ResponseEntity<ProfileResponse> getProfile(HttpServletRequest request){
       String authorizationHeader = request.getHeader("Authorization");
         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
             String token = authorizationHeader.substring(7);
             if(service.getRole(token) != null) {
                 ProfileResponse response = service.getProfile(token);
                 return new ResponseEntity<>(response, HttpStatus.OK);
             }
             throw new UnauthorizedException("Token is invalid or empty");
         }
         throw new UnauthorizedException("Token is invalid or empty");
    }
    
    @PutMapping("/password/change")
    @Operation(summary = "Password change  -- For All")
    public ResponseEntity<String>changePassword(HttpServletRequest request,@RequestBody ChangePasswordRequest profileRequest){
       String authorizationHeader = request.getHeader("Authorization");
         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
           String token = authorizationHeader.substring(7);
           if(service.getRole(token) != null) {
        	   String response = service.changePassword(token,profileRequest );
        	   return new ResponseEntity<>(response, HttpStatus.OK);
           }
           throw new UnauthorizedException("Token is invalid or empty");
         }
         throw new UnauthorizedException("Token is invalid or empty");    
     }
    
    @GetMapping("/getUsername")
    @Operation(summary = "Get Username")
    public ResponseEntity<String> getUsername(HttpServletRequest request){
        String authorizationHeader = request.getHeader("Authorization");
          if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            if(service.getRole(token) != null) {
            	String username = service.getUsername(token);
         	   return new ResponseEntity<>(username, HttpStatus.OK);
            }
            throw new UnauthorizedException("Token is invalid or empty");
          }
          throw new UnauthorizedException("Token is invalid or empty");    
      }
   
}