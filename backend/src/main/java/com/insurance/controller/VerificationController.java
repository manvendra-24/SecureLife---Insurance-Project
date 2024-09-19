package com.insurance.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.IAuthService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com")
public class VerificationController {

	@Autowired
	private IAuthService service;
    private static final Logger logger = LoggerFactory.getLogger(VerificationController.class);
    
    @GetMapping("/verify/admin")
    @Operation(summary = "Verify Admin  -- For All")
    public ResponseEntity<Boolean> verifyAdmin(HttpServletRequest request){
       String authorizationHeader = request.getHeader("Authorization");
         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
             String token = authorizationHeader.substring(7);
             String role = service.getRole(token);
             logger.info("Verification successful for user. Role is " + role);
             return new ResponseEntity<>(role.equalsIgnoreCase("ROLE_ADMIN"), HttpStatus.OK);
         }
         throw new UnauthorizedException("Token is invalid or empty");
    }
    
    @GetMapping("/verify/customer")
    @Operation(summary = "Verify Customer  -- For All")
    public ResponseEntity<Boolean> verifyCustomer(HttpServletRequest request){
       String authorizationHeader = request.getHeader("Authorization");
         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
             String token = authorizationHeader.substring(7);
             String role = service.getRole(token);
             logger.info("Verification successful for user. Role is " + role);
           return new ResponseEntity<>(role.equalsIgnoreCase("ROLE_CUSTOMER"), HttpStatus.OK);
         }
         throw new UnauthorizedException("Token is invalid or empty");  
    }
    
    @GetMapping("/verify/employee")
    @Operation(summary = "Verify Employee  -- For All")
    public ResponseEntity<Boolean> verifyEmployee(HttpServletRequest request){
       String authorizationHeader = request.getHeader("Authorization");
         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
             String token = authorizationHeader.substring(7);
             String role = service.getRole(token);
             logger.info("Verification successful for user. Role is " + role);
           return new ResponseEntity<>(role.equalsIgnoreCase("ROLE_EMPLOYEE"), HttpStatus.OK);
         }
         throw new UnauthorizedException("Token is invalid or empty");
    }
    
    
    @GetMapping("/verify/agent")
    @Operation(summary = "Verify Agent  -- For All")
    public ResponseEntity<Boolean> verifyAgent(HttpServletRequest request){
       String authorizationHeader = request.getHeader("Authorization");
         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
             String token = authorizationHeader.substring(7);
             String role = service.getRole(token);
             logger.info("Verification successful for user. Role is " + role);
           return new ResponseEntity<>(role.equalsIgnoreCase("ROLE_AGENT"), HttpStatus.OK);
         }
         throw new UnauthorizedException("Token is invalid or empty");
    }
}
