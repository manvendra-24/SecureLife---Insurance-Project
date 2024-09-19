package com.insurance.controller;

import java.util.List;

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

import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.IAuthService;
import com.insurance.interfaces.ICityService;
import com.insurance.request.CityRequest;
import com.insurance.response.CityResponse;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com")
public class CityController {

  @Autowired
  ICityService service;
  
  @Autowired
	private IAuthService authService;
  
    @PostMapping("/cities")
    @Operation(summary = "Register City -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createCity(HttpServletRequest request,@RequestBody CityRequest cityRequest){
    	String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
            	String response = service.createCity(cityRequest);
                return new ResponseEntity<>(response,HttpStatus.CREATED);
            }
            throw new UnauthorizedException("Unauthorized User");
        }
        throw new UnauthorizedException("Token is invalid or empty");  
      
      
    }
    
    @PutMapping("/city/{id}")
    @Operation(summary = "Update City -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>updateCity(HttpServletRequest request,@PathVariable(name="id") String id,@RequestBody CityRequest cityRequest){
    	String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
            	return new ResponseEntity<String>(service.updateCity(id,cityRequest),HttpStatus.OK);
            }
            throw new UnauthorizedException("Unauthorized User");
        }
        throw new UnauthorizedException("Token is invalid or empty");  
    }
    
    //deactivate city
    @DeleteMapping("/city/{id}")
    @Operation(summary = "Deactivate city -- BY ADMIN")
    public ResponseEntity<String>deactivateCity(HttpServletRequest request,@PathVariable(name="id") String id){
      String authorizationHeader = request.getHeader("Authorization");
      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
          String token = authorizationHeader.substring(7);
          if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
              return new ResponseEntity<String>(service.deactivateCity(id),HttpStatus.OK);
          }
          throw new UnauthorizedException("Unauthorized User");
      }
      throw new UnauthorizedException("Token is invalid or empty"); 
    }
    
    @GetMapping("/city/{id}")
    @Operation(summary = "Get city by Id -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CityResponse>getCityById(HttpServletRequest request,@PathVariable(name="id") String id){
      String authorizationHeader = request.getHeader("Authorization");
      if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
          String token = authorizationHeader.substring(7);
          if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
              return new ResponseEntity<CityResponse>(service.getCityById(id),HttpStatus.OK);
          }
          throw new UnauthorizedException("Unauthorized User");
      }
      throw new UnauthorizedException("Token is invalid or empty"); 
    }
    
    //activate city
    @PutMapping("/city/{id}/activate")
    @Operation(summary = "Activate City -- BY ADMIN")
    public ResponseEntity<String>activateCity(HttpServletRequest request,@PathVariable(name="id") String id){
    	String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
            	return new ResponseEntity<String>(service.activateCity(id),HttpStatus.OK);
            }
            throw new UnauthorizedException("Unauthorized User");
        }
        throw new UnauthorizedException("Token is invalid or empty");
    }
    
    @GetMapping("/cities")
    @Operation(summary = "Get Paged Cities -- For ALL")
    public ResponseEntity<PagedResponse<CityResponse>> getPagedCities(
      @RequestParam(name = "page", defaultValue = "0") int page,
      @RequestParam(name = "size", defaultValue = "5") int size,
      @RequestParam(name = "sortBy", defaultValue = "cityId") String sortBy,
      @RequestParam(name = "direction", defaultValue = "asc") String direction,
      @RequestParam(name = "searchQuery", defaultValue = "") String searchQuery){

          return new ResponseEntity<PagedResponse<CityResponse>>(service.getPagedCities(page, size, sortBy, direction, searchQuery),HttpStatus.OK);
      
    }
    
    @GetMapping("/allcities")
    @Operation(summary = "Get all Cities -- For ALL")
    public ResponseEntity<List<CityResponse>> getAllCities(){
    	return new ResponseEntity<List<CityResponse>>(service.getAllCities(), HttpStatus.OK);
    }
}