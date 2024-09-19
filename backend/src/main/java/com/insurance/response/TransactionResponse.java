package com.insurance.response;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class TransactionResponse {

	
    private String transactionId;
    private String policyId;
    private String transactionType; 
    private Double amount;
    private LocalDateTime date;
    private String status;


}
