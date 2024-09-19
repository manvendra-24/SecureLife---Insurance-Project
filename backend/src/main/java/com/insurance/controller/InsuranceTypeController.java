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

import com.insurance.interfaces.IInusranceService;
import com.insurance.request.InsuranceTypeRequest;
import com.insurance.response.InsuranceTypeResponse;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;


@RestController
@RequestMapping("/SecureLife.com")
public class InsuranceTypeController {

  
  @Autowired
  IInusranceService service;
  
  	//create insurance type
    @PostMapping("/type")
    @Operation(summary= "Create Insurance Type -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createInsuranceType(@RequestBody InsuranceTypeRequest typeRequest){
        String response = service.createInsuranceType(typeRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    //update insurance type
    @PutMapping("/type/{id}/update")
    @Operation(summary= "update Insurance Type -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>updateInsuranceType( @PathVariable(name="id")String id,@RequestBody InsuranceTypeRequest typeRequest ){
      String response= service.updateInsuranceType(typeRequest,id);
        return new ResponseEntity<>(response, HttpStatus.OK);
 
    }
    
    //delete insurance type
    @DeleteMapping("/type/{id}/delete")
    @Operation(summary= "Deactivate Insurance Type -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>deactivatingInsuranceType(@PathVariable(name="id")String id){
      String response=service.deactivatingType(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
      
    }
    
    //activate insurance type
    @PutMapping("/type/{id}/active")
    @Operation(summary= "Activate Insurance Type -- For ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>activatingInsuranceType(@PathVariable(name="id")String id){
      String response=service.activatingType(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
      
    }
    
    //get all insurance types
    @GetMapping("/types")
    @Operation(summary= "Get all Insurance Types -- For ADMIN")
    public ResponseEntity<PagedResponse<InsuranceTypeResponse>> getAllTypes(
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "5") int size,
      @RequestParam(name = "sortBy", defaultValue = "insuranceTypeId") String sortBy,
      @RequestParam(name = "direction", defaultValue = "asc") String direction,
    	@RequestParam(name = "searchQuery", defaultValue = "") String searchQuery) {
      return new ResponseEntity<PagedResponse<InsuranceTypeResponse>>(
        service.getAllTypes(page, size, sortBy, direction, searchQuery), HttpStatus.OK);
      
    }
}