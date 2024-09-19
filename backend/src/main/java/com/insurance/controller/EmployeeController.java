package com.insurance.controller;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.insurance.interfaces.IEmployeeService;
import com.insurance.request.EmployeeRegisterRequest;
import com.insurance.response.EmployeeResponse;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;


@RestController
@RequestMapping("/SecureLife.com")
public class EmployeeController {

	
	@Autowired
	IEmployeeService service;
	
    @PostMapping("/employee/register")
    @Operation(summary= "Add employee -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> register(@RequestBody EmployeeRegisterRequest registerDto){
        String response = service.registerEmployee(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/employee/{employee_id}")
    @Operation(summary= "Update employee -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateEmployee(@PathVariable String employee_id, @RequestBody EmployeeRegisterRequest employeeRequest) {
        String response = service.updateEmployee(employee_id, employeeRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
	
    @PutMapping("/employee/{employee_id}/delete")
    @Operation(summary= "Delete employee -- BY ADMIN")
    public ResponseEntity<String> deleteEmployee(@PathVariable String employee_id) {
        String response = service.deleteEmployee(employee_id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PutMapping("/employee/{employee_id}/active")
    @Operation(summary= "Activate employee -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> activateEmployee(@PathVariable String employee_id) {
        String response = service.activateEmployee(employee_id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
  	@GetMapping("/employees")
    @Operation(summary= "Get all employees -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
  	public ResponseEntity<PagedResponse<EmployeeResponse>> getAllEmployees(
  					@RequestParam (name="page", defaultValue="0") int page,
  					@RequestParam (name="size", defaultValue="5") int size,
  					@RequestParam (name = "sortBy", defaultValue="employeeId") String sortBy,
  					@RequestParam (name = "direction", defaultValue="asc") String direction,
  					@RequestParam (name = "searchQuery", defaultValue="") String searchQuery
  					){
  				
  		PagedResponse<EmployeeResponse> employeeResponses = service.getAllEmployees(page, size, sortBy, direction,searchQuery);
  		return new ResponseEntity<>(employeeResponses, HttpStatus.OK);
  	}
  	
  	 @GetMapping("employee/{employee_id}")
     @Operation(summary = "Get Employee by Id -- BY ADMIN")
     @PreAuthorize("hasRole('ADMIN')")
     public ResponseEntity<EmployeeResponse> getEmployeeById(@PathVariable String employee_id) {
         return new ResponseEntity<>(service.getEmployeeById(employee_id), HttpStatus.OK);
     }
	
	
}
