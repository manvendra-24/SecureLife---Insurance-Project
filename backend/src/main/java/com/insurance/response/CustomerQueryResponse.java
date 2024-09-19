package com.insurance.response;

import java.time.LocalDateTime;


import lombok.Data;


@Data
public class CustomerQueryResponse {
	
	
	    private Long queryId;

	  
	    private String customerId;

	
	    private String subject;

	   
	    private String message;

	    private LocalDateTime submittedAt;

	    private String status;  
	    
	    private String response;
	 
	    private String employeeId;

}
