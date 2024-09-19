package com.insurance.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.exceptions.ApiException;
import com.insurance.interfaces.IWithdrawalService;
import com.insurance.response.WithdrawalRequestDTO;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com")
public class WithdrawalController {

	
	
	@Autowired
	private IWithdrawalService service;
	
	
	//withdrawal request
	@PostMapping("/policy/{policy_id}/withdrawal")
	 @Operation(summary= "Request withdrawal -- BY CUSTOMER")
	public ResponseEntity<String> withdrawalRequest(HttpServletRequest request, @PathVariable("policy_id") String policy_id) {
	    	String authorizationHeader = request.getHeader("Authorization");
	      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	          String token = authorizationHeader.substring(7);
	          service.withdrawalRequest(token, policy_id);
	          return new ResponseEntity<>("Withdrawal request sent", HttpStatus.CREATED);
	      }
	      throw new ApiException("User is unauthorized");
	  }
	
	
		
	
	// Approve withdrawal
    @PostMapping("/withdrawals/{withdrawal_id}/approve")
    @Operation(summary= "Approve withdrawal -- BY ADMIN")
    public ResponseEntity<String> approveWithdrawal(HttpServletRequest request,@PathVariable long withdrawal_id) {
    	String authorizationHeader = request.getHeader("Authorization");
	      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	          String token = authorizationHeader.substring(7);
	          String response = service.approveWithdrawal(token, withdrawal_id);
	          return new ResponseEntity<>(response, HttpStatus.OK);
	      }
	      throw new ApiException("User is unauthorized");
    }
    
    // Reject withdrawal
    @PostMapping("/withdrawals/{withdrawal_id}/reject")
    @Operation(summary= "Reject withdrawal -- BY ADMIN")
    public ResponseEntity<String> rejectWithdrawal(HttpServletRequest request,@PathVariable long withdrawal_id) {
    	String authorizationHeader = request.getHeader("Authorization");
	      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
	          String token = authorizationHeader.substring(7);
	          String response = service.rejectWithdrawal(token, withdrawal_id);
	          return new ResponseEntity<>(response, HttpStatus.OK);
	      }
	      throw new ApiException("User is unauthorized");
    }
    
    @GetMapping("/withdrawals")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary="Get all withdrawal Requests")
    public ResponseEntity<PagedResponse<WithdrawalRequestDTO>> getAllWithdrawalRequests(
    		@RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "withdrawalRequestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction,
            @RequestParam(name = "searchQuery", defaultValue="") String searchQuery){
    	PagedResponse<WithdrawalRequestDTO> withdrawalResponses = service.getAllWithdrawalRequests(page, size, sortBy, direction, searchQuery);
        return new ResponseEntity<>(withdrawalResponses, HttpStatus.OK);
    	
    }
    
    
    @GetMapping("/mywithdrawals")
    @PreAuthorize("hasRole('AGENT')")
    @Operation(summary="Get agents withdrawals")
    public ResponseEntity<PagedResponse<WithdrawalRequestDTO>> getMyWithdrawals(
            HttpServletRequest request,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "withdrawalRequestId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction) {

        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            PagedResponse<WithdrawalRequestDTO> withdrawalResponses = service.getMyWithdrawals(token, PageRequest.of(page, size, Sort.by(Sort.Direction.fromString(direction), sortBy)));
            return new ResponseEntity<>(withdrawalResponses, HttpStatus.OK);
        }
        throw new ApiException("User is unauthorized");
    }

    
    
    
    
    
	
}
