package com.insurance.request;

import lombok.Data;

@Data
public class ChangePasswordRequest {
	
	private String newPassword;
	
	private String confirmPassword;
	private String currentPassword;

}
