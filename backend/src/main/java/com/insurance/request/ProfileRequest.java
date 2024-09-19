package com.insurance.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class ProfileRequest {
	
	
	@NotBlank(message = "name cannot be blank")
	private String name;
	
    @Email
    private String email;
    
    @NotBlank(message="username cant be blank")
    private String username;
    
    @NotBlank
    private String address;
    
    @NotBlank
    private String phoneNumber;

}
