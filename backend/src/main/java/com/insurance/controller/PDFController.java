package com.insurance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.exceptions.ApiException;
import com.insurance.interfaces.IPDFService;
import com.insurance.security.JwtTokenProvider;
import com.itextpdf.text.DocumentException;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com")
public class PDFController {

	
	@Autowired
    private JwtTokenProvider jwtTokenProvider;
	
	
	@Autowired
	private IPDFService service;
	
	@GetMapping("/customers/report/download")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    @Operation(summary= "Download Customer report -- BY EMPLOYEE & ADMIN")
    public ResponseEntity<Resource> customerReport(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username = jwtTokenProvider.getUsername(token);
            try {
            	
				return service.customerReport(username);
			} catch (DocumentException e) {
				e.printStackTrace();
			}
        }
        throw new ApiException("User is unauthorized");
    }
	
	@GetMapping("/agents/report/download")
	@PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
	@Operation(summary= "Download Agent report -- BY EMPLOYEE & ADMIN")
	public ResponseEntity<Resource> agentReport(HttpServletRequest request) {
	    String authorizationHeader = request.getHeader("Authorization");
	    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	        String token = authorizationHeader.substring(7);
	        String username = jwtTokenProvider.getUsername(token);
	        try {
	            return service.agentReport(username);
	        } catch (DocumentException e) {
	            e.printStackTrace();
	        }
	    }
	    throw new ApiException("User is unauthorized");
	}
	
	@GetMapping("/transactions/report/download")
	@PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
	@Operation(summary = "Download Transaction report -- BY EMPLOYEE & ADMIN")
	public ResponseEntity<Resource> transactionReport(HttpServletRequest request) {
	    String authorizationHeader = request.getHeader("Authorization");
	    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	        String token = authorizationHeader.substring(7);
	        String username = jwtTokenProvider.getUsername(token);
	        try {
	            return service.transactionReport(username);
	        } catch (DocumentException e) {
	            e.printStackTrace();
	        }
	    }
	    throw new ApiException("User is unauthorized");
	}
	
	@GetMapping("/customers/{customerId}/policy-report/download")
	@PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
	@Operation(summary = "Download Customer's Policy Report -- BY EMPLOYEE & ADMIN")
	public ResponseEntity<Resource> policyReport(@PathVariable("customerId") String customerId, HttpServletRequest request) {
	    String authorizationHeader = request.getHeader("Authorization");
	    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	        String token = authorizationHeader.substring(7);
	        String username = jwtTokenProvider.getUsername(token);
	        try {
	            return service.policyReport(customerId, username);
	        } catch (DocumentException e) {
	            e.printStackTrace();
	        }
	    }
	    throw new ApiException("User is unauthorized");
	}
	
	@GetMapping("/agents/{agentId}/commission-report/download")
	@PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
	@Operation(summary = "Download Agent's Commission Report -- BY EMPLOYEE & ADMIN")
	public ResponseEntity<Resource> commissionReport(@PathVariable("agentId") String agentId, HttpServletRequest request) {
	    String authorizationHeader = request.getHeader("Authorization");
	    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	        String token = authorizationHeader.substring(7);
	        String username = jwtTokenProvider.getUsername(token);
	        try {
	            return service.commissionReport(agentId, username);
	        } catch (DocumentException e) {
	            e.printStackTrace();
	        }
	    }
	    throw new ApiException("User is unauthorized");
	}



	@GetMapping("/transaction/{transactionId}/receipt/download")
	@Operation(summary = "Download Receipt -- BY CUSTOMER")
	public ResponseEntity<Resource> downloadReceipt(@PathVariable("transactionId") String transactionId, HttpServletRequest request) {
	    String authorizationHeader = request.getHeader("Authorization");
	    if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	        String token = authorizationHeader.substring(7);
	        String username = jwtTokenProvider.getUsername(token);
	        try {
	            return service.downloadReceipt(transactionId, username);
	        } catch (DocumentException e) {
	            e.printStackTrace();
	        }
	    }
	    throw new ApiException("User is unauthorized");
	}

}
