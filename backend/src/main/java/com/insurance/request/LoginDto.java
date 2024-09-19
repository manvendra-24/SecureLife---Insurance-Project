package com.insurance.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class LoginDto {
    
    @NotBlank(message = "Username or Email is mandatory")
    @Size(min = 4, max = 100, message = "Username or Email must be between 4 and 100 characters")
    private String usernameOrEmail;

    @NotBlank(message = "Password is mandatory")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    public LoginDto() {
        super();
    }

    public LoginDto(String usernameOrEmail, String password) {
        super();
        this.usernameOrEmail = usernameOrEmail;
        this.password = password;
    }

    public String getUsernameOrEmail() {
        return usernameOrEmail;
    }

    public void setUsernameOrEmail(String usernameOrEmail) {
        this.usernameOrEmail = usernameOrEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "LoginDto [usernameOrEmail=" + usernameOrEmail + ", password=" + password + "]";
    }
}
