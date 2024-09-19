package com.insurance.response;

public class JWTAuthResponse {
	private String username;
	private String role;

	public JWTAuthResponse() {
		super();
	}

	

	


	public String getUsername() {
		return username;
	}



	public void setUsername(String username) {
		this.username = username;
	}



	public String getRole() {
		return role;
	}



	public void setRole(String role) {
		this.role = role;
	}

}

