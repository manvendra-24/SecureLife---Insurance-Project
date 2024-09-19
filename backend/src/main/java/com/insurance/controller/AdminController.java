package com.insurance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.insurance.interfaces.IAdminService;
import com.insurance.request.AdminRegisterRequest;
import com.insurance.request.InsuranceSettingRequest;
import com.insurance.request.TaxSettingRequest;
import com.insurance.response.AdminResponse;
import com.insurance.response.InsuranceSettingResponse;
import com.insurance.response.TaxSettingResponse;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/SecureLife.com")
public class AdminController {

	@Autowired
    IAdminService service;  
    
    @PostMapping("/admin/register")
    @Operation(summary = "Register Admin -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> register(@Valid @RequestBody AdminRegisterRequest registerDto){
        String response = service.registerAdmin(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @PutMapping("/admin/{admin_id}")
    @Operation(summary = "Update admin -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updateAdmin(@PathVariable String admin_id,@Valid @RequestBody AdminRegisterRequest adminRequest) {
        String response = service.updateAdmin(admin_id, adminRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/admin/{admin_id}/delete")
    @Operation(summary = "Delete admin -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteAdmin(@PathVariable String admin_id) {
        String response = service.deleteAdmin(admin_id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/admin/{admin_id}/active")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Activate admin -- BY ADMIN")
    public ResponseEntity<String> activateAdmin(@PathVariable String admin_id) {
        String response = service.activateAdmin(admin_id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/admins")
    @Operation(summary = "Get all admins -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<AdminResponse>> getAllAdmins(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size,
            @RequestParam(name = "sortBy", defaultValue = "adminId") String sortBy,
            @RequestParam(name = "direction", defaultValue = "asc") String direction,
            @RequestParam(name = "searchQuery", defaultValue="") String searchQuery
    ) {
        PagedResponse<AdminResponse> adminResponses = service.getAllAdmins(page, size, sortBy, direction, searchQuery);
        return new ResponseEntity<>(adminResponses, HttpStatus.OK);
    }
    
    @GetMapping("/admin/{admin_id}")
    @Operation(summary = "Get Admin by Id -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminResponse> getAdminById(@PathVariable String admin_id){
    	return new ResponseEntity<>(service.getAdminById(admin_id), HttpStatus.OK);
    }

    
    

    
    
    
    
    
    
    
    
    
    @PostMapping("/tax-setting")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary= "Update Tax Settting -- BY ADMIN")
    public ResponseEntity<String> createTaxSetting(@RequestBody TaxSettingRequest taxSettingRequest) {
        return new ResponseEntity<>(service.createTaxSetting(taxSettingRequest), HttpStatus.CREATED);
    }
    
    @PostMapping("/insurance-setting")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary= "Update insurance setting -- BY ADMIN")
    public ResponseEntity<String> createInsuranceSetting(@RequestBody InsuranceSettingRequest insuranceSettingRequestDto){
      return new ResponseEntity<String>(service.createInsuranceSetting(insuranceSettingRequestDto),HttpStatus.CREATED);
    }
    
    @GetMapping("/tax-setting")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary="Get Last Tax Setting -- BY ADMIN")
    public ResponseEntity<TaxSettingResponse> getLastTaxSetting(){
    	return new ResponseEntity<>(service.getLastTaxSetting(), HttpStatus.OK);
    }
    
    @GetMapping("/insurance-setting")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary="Get Last Insurance Setting -- BY ADMIN")
    public ResponseEntity<InsuranceSettingResponse> getLastInsuranceSetting(){
    	return new ResponseEntity<>(service.getLastInsuranceSetting(), HttpStatus.OK);
    }
    
    
}
