package com.insurance.interfaces;

import com.insurance.request.LoginDto;
import com.insurance.request.ProfileRequest;
import com.insurance.response.ProfileResponse;
import com.insurance.request.ChangePasswordRequest;

public interface IAuthService {
    String login(LoginDto loginDto);


	String getRole(String token);

	String profileUpdate(String token, ProfileRequest profileRequest);
	

	String changePassword(String token, ChangePasswordRequest profileRequest);

	ProfileResponse getProfile(String token);


	String getUsername(String token);

}
