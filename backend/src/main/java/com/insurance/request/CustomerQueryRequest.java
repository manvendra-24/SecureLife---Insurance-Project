package com.insurance.request;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;


@Data
public class CustomerQueryRequest {
	
	

	   	@NotBlank(message = "Subject is mandatory")
	    private String subject;

	    
	    @NotBlank(message = "Message is mandatory")
	    private String message;

	    

}
