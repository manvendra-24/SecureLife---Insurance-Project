package com.insurance.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminTransactionRequest {
	
	
	@NotNull(message = "Policy account ID cannot be null")
    private String policyAccountId; 

    @NotNull(message = "Amount cannot be null")
    private Double amount;  

    @NotNull(message = "Stripe token cannot be null")
    private String stripeToken; 

    @NotNull(message = "transaction type cannot be null")
    private String transactionType;
}
