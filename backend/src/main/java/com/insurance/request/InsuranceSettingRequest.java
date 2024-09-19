package com.insurance.request;


import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InsuranceSettingRequest {
	
    	@NotNull(message = "Claim Deduction can not be null")
		private double claimDeduction;

    	@NotNull(message = "Withdrawal Penalty can not be null")
		private double withdrawalPenalty;
    	
    	@NotNull(message = "Late Penalty can not be null")
		private double latePenalty;
}


