package com.insurance.controller;

import com.insurance.interfaces.IPaymentService;
import com.insurance.request.PaymentRequestDto;

import com.stripe.exception.StripeException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com")
@CrossOrigin(origins="http://localhost:3000")
public class PaymentController {

    @Autowired
    private IPaymentService paymentService;

    @PutMapping("/process")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<String> processPayment(HttpServletRequest request, @RequestBody PaymentRequestDto paymentRequestDto) throws AccessDeniedException, StripeException {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7); 
            String response = paymentService.processPayment(token, paymentRequestDto); 
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            throw new AccessDeniedException("User is unauthorized");
        }
    }
    
    
    @GetMapping("policy/{policy_id}/calculate-total")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Double> calculateTotalAmount(@RequestParam double installmentAmount,@PathVariable String policy_id) {
        double totalAmount = paymentService.calculateTotalAmount(installmentAmount, policy_id);
        System.out.println("Total Amount Sent: " + totalAmount);
        return new ResponseEntity<>(totalAmount, HttpStatus.OK);
    }

    
}
