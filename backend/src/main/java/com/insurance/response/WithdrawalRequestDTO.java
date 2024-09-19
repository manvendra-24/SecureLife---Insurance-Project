package com.insurance.response;

import java.time.LocalDateTime;


import lombok.Data;

@Data
public class WithdrawalRequestDTO {

	
    private Long withdrawalRequestId;

    private String customerId;

    private String policyId;

    private LocalDateTime requestDate;

    private String status;
    
    private double withdrawalPenalty;

}
