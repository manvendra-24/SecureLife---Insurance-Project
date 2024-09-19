package com.insurance.controller;


import com.insurance.request.OtpForgetPasswordRequest;
import com.insurance.service.EmailService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/SecureLife.com")
public class ForgetPasswordController {

	@Autowired
    private EmailService emailService;

    
    @PostMapping("/otp/send")
    @Operation(summary= "Send Otp -- For All")
    public ResponseEntity<String> requestOtp(@RequestBody OtpForgetPasswordRequest otpForgetPasswordRequest) {
        String response = emailService.sendOtpForForgetPassword(otpForgetPasswordRequest.getUsernameOrEmail());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

  
    @PostMapping("/otp/verify")
    @Operation(summary= "Verify Otp -- For All")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpForgetPasswordRequest otpForgetPasswordRequest) {
        String response = emailService.verifyOtp(otpForgetPasswordRequest.getOtp());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

   
    @PutMapping("/password/reset")
    @Operation(summary= "Reset password -- For All")
    public ResponseEntity<String> setNewPassword(@RequestBody OtpForgetPasswordRequest otpForgetPasswordRequest) {
        String response = emailService.setNewPassword(otpForgetPasswordRequest);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}


