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
import com.insurance.interfaces.IStateService;
import com.insurance.request.StateRequest;
import com.insurance.response.CityResponse;
import com.insurance.response.StateResponse;
import com.insurance.util.PagedResponse;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;


@RestController
@RequestMapping("/SecureLife.com")
public class StateController {

	@Autowired
	IStateService service;
  
  	@Autowired
	private IAuthService authService;
  
    @PostMapping("/states")
    @Operation(summary = "Register State -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> createState(HttpServletRequest request,@RequestBody StateRequest stateRequest){
    	String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
            	String response=service.createState(stateRequest);
                return new ResponseEntity<>(response, HttpStatus.CREATED);
            }
            throw new UnauthorizedException("Unauthorized User");
        }
        throw new UnauthorizedException("Token is invalid or empty");         
      
    }
    
    @PutMapping("/state/{id}/update")
    @Operation(summary = "Update state -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>updateState(HttpServletRequest request,@PathVariable("id")String id,@RequestBody  StateRequest stateRequest){
    	String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
            	String response = service.updateState(id,stateRequest);
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            throw new UnauthorizedException("Unauthorized User");
        }
        throw new UnauthorizedException("Token is invalid or empty");
      
    }
    
    //get state by id
    @GetMapping("/state/{id}")
    @Operation(summary = "Get state by id -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StateResponse> getStateById(HttpServletRequest request,@PathVariable("id") String id) {
    	String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
            	StateResponse stateResponse = service.getStateById(id);
                return new ResponseEntity<>(stateResponse, HttpStatus.OK);
            }
            throw new UnauthorizedException("Unauthorized User");
        }
        throw new UnauthorizedException("Token is invalid or empty");
        
    }
  
    @GetMapping("/states")
    @Operation(summary = "Get all states -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<StateResponse>> getPagedStates(
    		HttpServletRequest request,
    		@RequestParam(name = "page", defaultValue = "0") int page,
    		@RequestParam(name = "size", defaultValue = "5") int size,
    		@RequestParam(name = "sortBy", defaultValue = "stateId") String sortBy,
    		@RequestParam(name = "direction", defaultValue = "asc") String direction,
    		@RequestParam(name = "searchQuery", defaultValue = "") String searchQuery)  {
    	
    	String authorizationHeader = request.getHeader("Authorization");
    	if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
    	    String token = authorizationHeader.substring(7);
    	    if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
    	         return new ResponseEntity<PagedResponse<StateResponse>>(service.getPagedStates(page, size, sortBy, direction, searchQuery), HttpStatus.OK);
    	    }
    	    throw new UnauthorizedException("Unauthorized User");
    	}
    	throw new UnauthorizedException("Token is invalid or empty");
    }
    
    //deactivate state
    @DeleteMapping("/state/{id}/delete")
    @Operation(summary = "Deactivate state -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>deactivateState(HttpServletRequest request,@PathVariable(name="id") String id){
    	String authorizationHeader = request.getHeader("Authorization");
    	if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
    	    String token = authorizationHeader.substring(7);
    	    if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
    	    	return new ResponseEntity<String>(service.deactivateStateById(id),HttpStatus.OK);
    	    }
    	    throw new UnauthorizedException("Unauthorized User");
    	}
    	throw new UnauthorizedException("Token is invalid or empty");
    }
    
    @PutMapping("/state/{id}/active")
    @Operation(summary = "Activate State -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String>activateState(HttpServletRequest request,@PathVariable(name="id") String id){
    	System.out.println("Coming to activate state");
    	String authorizationHeader = request.getHeader("Authorization");
    	if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
    	    String token = authorizationHeader.substring(7);
    	    if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
    	    	return new ResponseEntity<String>(service.activateStateById(id),HttpStatus.OK);
    	    }
    	    throw new UnauthorizedException("Unauthorized User");
    	}
    	throw new UnauthorizedException("Token is invalid or empty");
    }
    
    @GetMapping("/state/{id}/cities")
    @Operation(summary = "Cities by state -- BY ADMIN")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PagedResponse<CityResponse>> getCitiesByState(
    		HttpServletRequest request,
    		@RequestParam(name = "page", defaultValue = "0") int page,
    		@RequestParam(name = "size", defaultValue = "5") int size,
    		@RequestParam(name = "sortBy", defaultValue = "stateId") String sortBy,
    		@RequestParam(name = "direction", defaultValue = "asc") String direction,
    		@RequestParam(name = "searchQuery", defaultValue = "") String searchQuery,
    		@PathVariable(name="id") String stateId)  {
    	
    	
    	String authorizationHeader = request.getHeader("Authorization");
    	if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
    	    String token = authorizationHeader.substring(7);
    	    if(authService.getRole(token).equalsIgnoreCase("ROLE_ADMIN")) {
    	         return new ResponseEntity<PagedResponse<CityResponse>>(service.getCitiesByStateId(page, size, sortBy, direction, searchQuery, stateId), HttpStatus.OK);
    	    }
    	    throw new UnauthorizedException("Unauthorized User");
    	}
    	throw new UnauthorizedException("Token is invalid or empty");
    }
    
    @GetMapping("/allstates")
    @Operation(summary = "Get all States -- For ALL")
    public ResponseEntity<List<StateResponse>> getAllCities(){
    	return new ResponseEntity<List<StateResponse>>(service.getAllStates(), HttpStatus.OK);
    }
    
    
    
}