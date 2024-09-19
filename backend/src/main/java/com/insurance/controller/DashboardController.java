package com.insurance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.IDashboardService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com/dashboard")
public class DashboardController {

    @Autowired
    private IDashboardService service;

    @GetMapping("/total-admins")
    @Operation(summary = "Count Admin -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalAdmins() {
        long totalAdmins = service.getTotalAdmins();
        return ResponseEntity.ok(totalAdmins);
    }

    @GetMapping("/total-agents")
    @Operation(summary = "Count Agent -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalAgents() {
        long totalAgents = service.getTotalAgents();
        return ResponseEntity.ok(totalAgents);
    }

    @GetMapping("/total-customers")
    @Operation(summary = "Count Customer -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalCustomers() {
        long totalCustomers = service.getTotalCustomers();
        return ResponseEntity.ok(totalCustomers);
    }

    @GetMapping("/total-employees")
    @Operation(summary = "Count Employee -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalEmployees() {
        long totalEmployees = service.getTotalEmployees();
        return ResponseEntity.ok(totalEmployees);
    }
    
    @GetMapping("/total-commissions")
    @Operation(summary = "Total Earnings -- BY AGENT")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<Double> getMyEarning(HttpServletRequest request) {
    	String authorizationHeader = request.getHeader("Authorization");
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            Double totalEarnings = service.getMyCommissions(token);
            return ResponseEntity.ok(totalEarnings);
        }
        throw new UnauthorizedException("Token invalid or empty");
    }
    
    @GetMapping("/total-penalty")
    @Operation(summary = "Total Penalty -- BY AGENT")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<Double> getMyWithdrawals(HttpServletRequest request) {
    	String authorizationHeader = request.getHeader("Authorization");
        
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            Double totalEarnings = service.getMyWithdrawals(token);
            return ResponseEntity.ok(totalEarnings);
        }
        throw new UnauthorizedException("Token invalid or empty");
    }
    
    @GetMapping("/total-sold-policies")
    @Operation(summary = "Total Sold Policies -- BY AGENT")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<Long> getSoldPolicies(HttpServletRequest request) {
    	String authorizationHeader = request.getHeader("Authorization");
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            Long soldPolicies = service.getSoldPolicies(token);
            return ResponseEntity.ok(soldPolicies);
        }
        throw new UnauthorizedException("Token invalid or empty");
    }
    
    @GetMapping("/total-cancelled-policies")
    @Operation(summary = "Total Cancelled Policies -- BY AGENT")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<Long> getCancelledPolicies(HttpServletRequest request) {
    	String authorizationHeader = request.getHeader("Authorization");
        String token = "";
        
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
            Long cancelledPolicies = service.getCancelledPolicies(token);
            return ResponseEntity.ok(cancelledPolicies);
        }
        throw new UnauthorizedException("Token invalid or empty");
    }
    
    
    
    
    
}
