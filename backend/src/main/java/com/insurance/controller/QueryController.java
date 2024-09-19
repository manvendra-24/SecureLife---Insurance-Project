package com.insurance.controller;

import java.nio.file.AccessDeniedException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.interfaces.IQueryService;
import com.insurance.request.CustomerQueryRequest;
import com.insurance.request.EmployeeQueryRequest;
import com.insurance.response.CustomerQueryResponse;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com")
public class QueryController {
	
	@Autowired
	IQueryService service;
	
	//create query
	@PostMapping("/queries/ask")
    @Operation(summary = "Ask Query -- BY CUSTOMER")
	public ResponseEntity<String>addQuery(HttpServletRequest request,@RequestBody CustomerQueryRequest queryRequest) throws AccessDeniedException{
		 String authorizationHeader = request.getHeader("Authorization");
         if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
             String token = authorizationHeader.substring(7);
             String response = service.addQuery(token,queryRequest);
 	       return new ResponseEntity<>(response,HttpStatus.OK);
         }
         else {
       	  throw new AccessDeniedException("User is unauthorized");
         }
	}
         
         
       	//update response
         @PostMapping("/query/{id}/response")
         @Operation(summary = "Update Response for a query -- BY EMPLOYEE")
         public ResponseEntity<String>addResponseQuery(HttpServletRequest request,@RequestBody EmployeeQueryRequest queryRequest,@PathVariable("id")Long id) throws AccessDeniedException{
    		 String authorizationHeader = request.getHeader("Authorization");
             if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                 String token = authorizationHeader.substring(7);
                 String response = service.addResponseQuery(token,queryRequest,id);
     	       return new ResponseEntity<>(response,HttpStatus.OK);
             }
             else {
           	  throw new AccessDeniedException("User is unauthorized");
             }  
         
	}
	
         
       //getAllQueries
         @GetMapping("/queries")
         @Operation(summary = "Get all queries -- BY EMPLOYEE & CUSTOMER")
         @PreAuthorize("hasRole('EMPLOYEE') or hasRole('CUSTOMER')")
         public ResponseEntity<PagedResponse<CustomerQueryResponse>> getAllQueries(
                 @RequestParam(name = "page", defaultValue = "0") int page,
                 @RequestParam(name = "size", defaultValue = "10") int size,
                 @RequestParam(name = "sortBy", defaultValue = "queryId") String sortBy,
                 @RequestParam(name = "direction", defaultValue = "asc") String direction,
                 @RequestParam(name = "searchquery", defaultValue = "") String searchquery) {
             
             PagedResponse<CustomerQueryResponse> queryResponses = service.getAllQueries(page, size, sortBy, direction, searchquery);
             return new ResponseEntity<>(queryResponses, HttpStatus.OK);
         }
}
