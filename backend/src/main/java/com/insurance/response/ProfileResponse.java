package com.insurance.response;

import lombok.Data;

@Data
public class ProfileResponse {
	
	
	private String name;
	private String password;
    private String email;
    private String role;
    private String username;
    private String address;
    private String phoneNumber;

}
