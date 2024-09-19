package com.insurance.controller;

import java.nio.file.AccessDeniedException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.insurance.exceptions.ApiException;
import com.insurance.interfaces.IClaimService;
import com.insurance.request.ClaimRequest;
import com.insurance.response.ClaimResponse;
import com.insurance.response.DocumentResponse;
import com.insurance.security.JwtTokenProvider;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com")
public class ClaimController {

    @Autowired
    IClaimService service;

    
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/policies/{policyid}/claim")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Claim request done by customer")
    public ResponseEntity<String> register(HttpServletRequest request, @PathVariable("policyid") String policyid, @RequestBody ClaimRequest claimRequest) throws AccessDeniedException {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String response = service.requestClaim(token, claimRequest, policyid);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }
        throw new AccessDeniedException("User is unauthorized");
    }

    @GetMapping("/claims/{claimId}/documents")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get documents by Claim ID")
    public ResponseEntity<List<DocumentResponse>> getDocumentsByClaimId(@PathVariable Long claimId, HttpServletRequest request) {
    	String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username = jwtTokenProvider.getUsername(token);
            List<DocumentResponse> documents = service.getDocumentsByClaimId(claimId, username);
            return new ResponseEntity<>(documents, HttpStatus.OK);
        }
        throw new ApiException("User is unauthorized");
    }

    @GetMapping("/customers/{customerId}/claims")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary = "Get all claims by Customer ID")
    public ResponseEntity<Page<ClaimResponse>> getAllClaimsByCustomerId(@PathVariable String customerId,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size,
                                                      @RequestParam(defaultValue = "claimId") String sortBy,
                                                      @RequestParam(defaultValue = "asc") String direction) {
        return new ResponseEntity<>(service.getAllClaimsByCustomerId(customerId, PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy))), HttpStatus.OK);
    }

    @GetMapping("/claims")
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    @Operation(summary = "Get all claims with pagination and sorting")
    public ResponseEntity<Page<ClaimResponse>> getAllClaims(@RequestParam(defaultValue = "0") int page,
                                          @RequestParam(defaultValue = "10") int size,
                                          @RequestParam(defaultValue = "claimId") String sortBy,
                                          @RequestParam(defaultValue = "asc") String direction) {
        return new ResponseEntity<>(service.getAllClaims(PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy))), HttpStatus.OK);
    }

    @PutMapping("/claims/{claimId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Approve a claim")
    public ResponseEntity<String> approveClaim(@PathVariable Long claimId) {
        service.approveClaim(claimId);
        return new ResponseEntity<>("Claim approved successfully", HttpStatus.OK);
    }

    @PutMapping("/claims/{claimId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Reject a claim")
    public ResponseEntity<String> rejectClaim(@PathVariable Long claimId) {
        service.rejectClaim(claimId);
        return new ResponseEntity<>("Claim rejected successfully", HttpStatus.OK);
    }
}
