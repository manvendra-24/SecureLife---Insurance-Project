package com.insurance.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PaymentRequestDto {

    @NotNull(message = "Policy account ID cannot be null")
    private String policyAccountId;  // Policy account ID (String type)

    @NotNull(message = "Amount cannot be null")
    private Double amount;  // Amount in rupees (Double type)

    @NotNull(message = "Stripe token cannot be null")
    private String  stripePaymentMethodId;;  // Stripe token received from Stripe.js
}
