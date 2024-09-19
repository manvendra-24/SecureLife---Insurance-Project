package com.insurance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.interfaces.ITransactionService;
import com.insurance.response.TransactionResponse;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/SecureLife.com")
public class TransactionController {

	@Autowired
    ITransactionService service;
	
    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary= "Get all transaction -- BY ADMIN")
    public ResponseEntity<PagedResponse<TransactionResponse>> getAllTransactions(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "transactionId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction
    ) {
        PagedResponse<TransactionResponse> transactionResponses = service.getAllTransactions(page, size, sortBy, direction);
        return new ResponseEntity<>(transactionResponses, HttpStatus.OK);
    }
    
    @GetMapping("/transactions/{policyid}")
    @PreAuthorize("hasRole('CUSTOMER')")
    @Operation(summary= "Get all transaction by policy id")
    public ResponseEntity<List<TransactionResponse>>getTransctionByPolicyId(@PathVariable("policyid") String policyid){
    	return new ResponseEntity<List<TransactionResponse>>(service.transctionByPolicyId(policyid),HttpStatus.OK);
    }
    
    
}

