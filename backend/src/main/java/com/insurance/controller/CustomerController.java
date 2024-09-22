package com.insurance.controller;

import java.nio.file.AccessDeniedException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.ICustomerService;
import com.insurance.request.CustomerRegisterRequest;
import com.insurance.response.CustomerResponse;
import com.insurance.response.CustomerResponseForUpdate;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;


@RestController
@RequestMapping("/SecureLife.com")
public class CustomerController {

  
  ICustomerService service;

  public CustomerController(ICustomerService service) {
	super();
	this.service =service;
}


  @PostMapping("/customer/register")
  @Operation(summary = "Register Customer -- BY All")
  public ResponseEntity<String> registerCustomer(HttpServletRequest request, @Valid @RequestBody CustomerRegisterRequest registerDto) {
      String authorizationHeader = request.getHeader("Authorization");
      String token = "";
      
      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
          token = authorizationHeader.substring(7);
      }
      
      String response = service.registerCustomer(token, registerDto);
      return new ResponseEntity<>(response, HttpStatus.CREATED);
  }

  
  @GetMapping("/customers")
  @Operation(summary = "Get all customers -- BY EMPLOYEE & ADMIN")
  @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
  public ResponseEntity<PagedResponse<CustomerResponse>> getAllCustomers(
          @RequestParam (name="page", defaultValue="0") int page,
          @RequestParam (name="size", defaultValue="5") int size,
          @RequestParam (name = "sortBy", defaultValue="customerId") String sortBy,
          @RequestParam (name = "direction", defaultValue="asc") String direction,
          @RequestParam (name = "searchQuery", defaultValue = "") String searchQuery
          ){
        
    PagedResponse<CustomerResponse> customersResponse = service.getAllCustomers(page, size, sortBy, direction,searchQuery);
    return new ResponseEntity<>(customersResponse, HttpStatus.OK);
  }
  
  @PutMapping("/customer/{id}/update")
  @Operation(summary = "Update customer -- BY EMPLOYEE & ADMIN")  
  @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
  public ResponseEntity<String> updateCustomer(@PathVariable("id") String id, @RequestBody CustomerRegisterRequest registerDto) {
      String response = service.updateCustomer(id, registerDto);
      return new ResponseEntity<>(response, HttpStatus.OK);
  }
  
  @PutMapping("/customer/{id}/delete")
  @Operation(summary = "Activate customer -- BY EMPLOYEE & ADMIN")
  @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
  public ResponseEntity<String> deactivateCustomer(@PathVariable("id") String id) {
      String response = service.deactivateCustomer(id);
      return new ResponseEntity<>(response, HttpStatus.OK);
  }
  
  @PutMapping("/customer/{id}/active")
  @Operation(summary = "Activate customer -- BY EMPLOYEE & ADMIN")
  @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
  public ResponseEntity<String> activateCustomer(@PathVariable("id") String id) {
      String response = service.activateCustomer(id);
      return new ResponseEntity<>(response, HttpStatus.OK);
  }
  @PutMapping("/customer/{id}/approve")
  @Operation(summary = "Approve customer -- BY EMPLOYEE")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public ResponseEntity<String>verifyCustomer(HttpServletRequest request,@PathVariable("id")String id) throws AccessDeniedException{
  	  String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String response = service.verifyCustomerapprove(token,id);
	       return new ResponseEntity<>(response,HttpStatus.OK);
        }
        else {
      	  throw new UnauthorizedException("User is unauthorized");
        }
  }
  
  @PutMapping("/customer/{id}/reject")
  @Operation(summary = "Reject customer -- BY EMPLOYEE")
  @PreAuthorize("hasRole('EMPLOYEE')")
  public ResponseEntity<String>verifyCustomerReject(HttpServletRequest request,@PathVariable("id")String id) throws AccessDeniedException{
  	  String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String response = service.verifyCustomerReject(token,id);
	       return new ResponseEntity<>(response,HttpStatus.OK);
        }
        else {
      	  throw new UnauthorizedException("User is unauthorized");
        }
  }
  
  @GetMapping("/mycustomers")
  @Operation(summary = "Get Customers for Agent-- BY AGENT")
  @PreAuthorize("hasRole('AGENT')")
  public ResponseEntity<PagedResponse<CustomerResponse>> getMyCustomersForAgent(
		  HttpServletRequest request,
          @RequestParam (name="page", defaultValue="0") int page,
          @RequestParam (name="size", defaultValue="5") int size,
          @RequestParam (name = "sortBy", defaultValue="customerId") String sortBy,
          @RequestParam (name = "direction", defaultValue="asc") String direction,
          @RequestParam (name = "searchQuery", defaultValue = "") String searchQuery
          ){
	  String authorizationHeader = request.getHeader("Authorization");
      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
          String token = authorizationHeader.substring(7);
          PagedResponse<CustomerResponse> customersResponse = service.getMyCustomersForAgent(token,page, size, sortBy, direction,searchQuery);
          return new ResponseEntity<>(customersResponse, HttpStatus.OK);
      }
      else {
    	  throw new UnauthorizedException("User is unauthorized");
      }
    
  }
  
  @GetMapping("/customers/{customer_id}")
  @Operation(summary = "Get  by Customer by ID -- For EMPLOYEE & ADMIN")
  @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
  public ResponseEntity<CustomerResponseForUpdate> getCustomerById(@PathVariable String customer_id) {
    CustomerResponseForUpdate response = service.getCustomerbyId(customer_id);
      return new ResponseEntity<>(response, HttpStatus.OK);
  }
  
  

  
}