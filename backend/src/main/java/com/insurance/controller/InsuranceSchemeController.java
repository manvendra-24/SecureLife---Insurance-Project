package com.insurance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.insurance.interfaces.IInsuranceSchemeService;
import com.insurance.request.InsuranceSchemeRequest;
import com.insurance.response.InsuranceSchemeResponse;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;


@RestController
@RequestMapping("/SecureLife.com")
public class InsuranceSchemeController {

	
	@Autowired
	IInsuranceSchemeService service;
	
    @GetMapping("/schemes")
    @Operation(summary= "Get all Insurance Schemes -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER')")
    public ResponseEntity<PagedResponse<InsuranceSchemeResponse>> getAllInsuranceSchemes(
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "5") int size,
      @RequestParam(name = "sortBy", defaultValue = "insuranceSchemeId") String sortBy,
      @RequestParam(name = "direction", defaultValue = "asc") String direction,
      @RequestParam(name = "searchQuery", defaultValue = "") String searchQuery){

    	
      return new ResponseEntity<PagedResponse<InsuranceSchemeResponse>>(service.getAllInsuranceSchemes(page, size, sortBy, direction, searchQuery),HttpStatus.OK);
    }
    
    @PostMapping("/type/{typeId}/schemes")
    @Operation(summary= "Create Insurance Scheme -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createInsuranceSchemes(@PathVariable String typeId, @RequestBody InsuranceSchemeRequest schemeRequest){
        String response = service.createInsuranceScheme(typeId, schemeRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/scheme/{id}/update")
    @Operation(summary= "Update Insurance Scheme -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateInsuranceSchemes(@PathVariable String id,@RequestBody InsuranceSchemeRequest schemeRequest){
        String response = service.updateInsuranceScheme(id,schemeRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PutMapping("/scheme/{id}/activate")
    @Operation(summary= "Activate Insurance Scheme -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activateInsuranceSchemes(@PathVariable String id){
        String response = service.activateInsuranceScheme(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @DeleteMapping("/scheme/{id}/delete")
    @Operation(summary= "Delete Insurance Scheme -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteInsuranceSchemes(@PathVariable String id){
        String response = service.deleteInsuranceScheme(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    
    @GetMapping("/type/{typeId}/schemes")
    @Operation(summary= "Get Insurance Schemes of Type -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN') or hasRole('CUSTOMER')")
    public ResponseEntity<PagedResponse<InsuranceSchemeResponse>> getInsuranceSchemesByType(
    		@PathVariable String typeId,
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "5") int size,
      @RequestParam(name = "sortBy", defaultValue = "insuranceSchemeId") String sortBy,
      @RequestParam(name = "direction", defaultValue = "asc") String direction,
    	@RequestParam(name="searchQuery", defaultValue ="") String searchQuery){
    	
      return new ResponseEntity<PagedResponse<InsuranceSchemeResponse>>(service.getInsuranceSchemesByType(typeId, page, size, sortBy, direction, searchQuery),HttpStatus.OK);
    }
    
    @GetMapping("/scheme/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<InsuranceSchemeResponse>getInsuranceSchemeById(@PathVariable("id") String id ){
      InsuranceSchemeResponse response =service.getInsuranceSchemeById(id);
      return new ResponseEntity<InsuranceSchemeResponse>(response, HttpStatus.OK);
      
    }
}
