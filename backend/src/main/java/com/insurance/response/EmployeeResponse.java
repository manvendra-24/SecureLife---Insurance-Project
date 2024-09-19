package com.insurance.response;

import lombok.Data;

@Data
public class EmployeeResponse {
	private String employeeId;
	private String name;
	private String username;
	private String email;
	private boolean isActive;
}
