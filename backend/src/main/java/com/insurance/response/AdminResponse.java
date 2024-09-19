package com.insurance.response;

import lombok.Data;

@Data
public class AdminResponse {

	
	private String adminId;
	private String name;
	private String username;
	private String email;
	private boolean isActive;
	private String phoneNumber;
}
