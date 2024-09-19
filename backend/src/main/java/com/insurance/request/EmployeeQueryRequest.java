package com.insurance.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;


@Data
public class EmployeeQueryRequest {
	
	
	@NotNull(message="response cannot be null")
	private String response;

}
