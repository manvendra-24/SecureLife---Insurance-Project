package com.insurance.interfaces;

import com.insurance.request.PaymentRequestDto;
import com.stripe.exception.StripeException;

public interface IPaymentService {

	String processPayment(String token, PaymentRequestDto paymentRequestDto) throws StripeException;

	double calculateTotalAmount(double installmentAmount, String policy_id);

}
