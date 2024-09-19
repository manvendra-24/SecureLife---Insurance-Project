package com.insurance.request;

import lombok.Data;

@Data
public class OtpForgetPasswordRequest {

	private String usernameOrEmail;
    private String otp;
    private String newPassword;
    private String confirmPassword;

    
}
