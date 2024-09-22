package com.insurance.service;

import com.insurance.entities.*;
import com.insurance.enums.PolicyStatus;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IPaymentService;
import com.insurance.repository.*;
import com.insurance.request.*;
import com.insurance.response.InsuranceSettingResponse;
import com.insurance.security.JwtTokenProvider;
import com.insurance.util.UniqueIdGenerator;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.PaymentIntent;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class PaymentService implements IPaymentService {
	
	private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PolicyRepository policyRepository;

    @Autowired
    private TransactionRepository transactionRepository;


    @Autowired
    private TaxSettingRepository taxSettingRepository;

    @Autowired
    private UniqueIdGenerator uniqueIdGenerator;

    @Value("${stripe.apiKey}")
    private String stripeApiKey;

    private static final double MINIMUM_AMOUNT_IN_RUPEES = 40.00;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    AdminService adminService;

    @Override
    public String processPayment(String token, PaymentRequestDto paymentRequestDto) throws StripeException {
        String username = jwtTokenProvider.getUsername(token);
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        logger.info("User with id: "+ user.getUserId() + "trying to process a payment");
        Policy policy = policyRepository.findById(paymentRequestDto.getPolicyAccountId())
                .orElseThrow(() -> new ApiException("Policy not found"));

        if (paymentRequestDto.getAmount() == null || paymentRequestDto.getAmount() <= 0) {
            throw new ApiException("Invalid payment amount.");
        }

        Stripe.apiKey = stripeApiKey;

        Map<String, Object> params = new HashMap<>();
        params.put("amount", Math.round(paymentRequestDto.getAmount() * 100));
        params.put("currency", "inr");
        params.put("payment_method", paymentRequestDto.getStripePaymentMethodId());
        params.put("confirm", true); 

        PaymentIntent paymentIntent = PaymentIntent.create(params);
        Charge charge = paymentIntent.getCharges().getData().get(0);

        if ("succeeded".equals(charge.getStatus())) {
        	LocalDate today = LocalDate.now();
            Transaction transaction = new Transaction();
            transaction.setTransactionId(uniqueIdGenerator.generateUniqueId(Transaction.class));
            transaction.setPolicy(policy);
            transaction.setAmount(paymentRequestDto.getAmount());
            transaction.setDate(LocalDateTime.now());
            transaction.setStatus("SUCCESSFUL");
            if (today.isAfter(transaction.getPolicy().getEndDate())) {
                transaction.getPolicy().setStatus(PolicyStatus.EXPIRED);
                String subject = "Welcome to SecureLife Insurance - Your Insurance Term is completed!";
                String emailBody = "Dear " + transaction.getPolicy().getCustomer().getName() + ",\n\n" +
                        "We are pleased to inform you that your insurance term has been successfully completed at SecureLife Insurance. " +
                        "Your funds " + (transaction.getPolicy().getTotalInvestmentAmount()*transaction.getPolicy().getPlan().getProfitRatio()) +
                        "will be processed and transferred shortly.\n\n" +
                        "Thank you for choosing SecureLife Insurance for your financial needs.\n\n" +
                        "Best Regards,\n" +
                        "SecureLife Insurance Team";

                try {
                    emailService.sendEmail(transaction.getPolicy().getCustomer().getUser().getEmail(), subject, emailBody);
                } catch (MailAuthenticationException exc) {
                    logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
                } finally {
                    logger.info("Insurance term  successfully completed with username: {}", transaction.getPolicy().getCustomer().getName());
                }
            }

            transactionRepository.save(transaction);

            policy.setTotalAmountPaid(policy.getTotalAmountPaid() + policy.getInstallmentAmount());
            
            policy.setNextPaymentDate(calculateNextPaymentDate(policy));
            policyRepository.save(policy);

            return "Payment successful, Charge ID: " + charge.getId();
        } else {
            throw new ApiException("Payment failed with status: " + charge.getStatus());
        }
    }

    private LocalDate calculateNextPaymentDate(Policy policy) {
        LocalDate currentDate = policy.getNextPaymentDate();
        
        if (currentDate == null) {
            throw new ApiException("Current next payment date is missing for policy: " + policy.getPolicyId());
        }
        
        switch (policy.getPaymentInterval()) {
            case YEARLY:
                return currentDate.plusYears(1);
            case HALF_YEARLY:
                return currentDate.plusMonths(6);
            case QUARTERLY:
                return currentDate.plusMonths(3);
            default:
                throw new ApiException("Invalid payment interval for policy: " + policy.getPolicyId());
        }
    }

    @Override
    public double calculateTotalAmount(double installmentAmount, String policy_id) {
    	PageRequest pageable = PageRequest.of(0, 1);
        Page<TaxSetting> page = taxSettingRepository.findLatestTaxSetting(pageable);
        TaxSetting taxSetting = new TaxSetting();
        if (!page.isEmpty()) {
            taxSetting = page.getContent().get(0);
        }
        
        Optional<Policy> policy = policyRepository.findById(policy_id);
        if(policy.isEmpty()) {
        	throw new ResourceNotFoundException("Policy not found");
        }
        InsuranceSettingResponse insuranceSetting = adminService.getLastInsuranceSetting();
        LocalDate today = LocalDate.now();
        double taxPercentage = taxSetting.getTaxPercentage();
        double taxAmount = (installmentAmount * taxPercentage)/100;
        double penaltyAmount = (today.isAfter(policy.get().getNextPaymentDate())) 
        	    ? (installmentAmount * insuranceSetting.getLatePenalty()) / 100 
        	    : 0.0;
        double totalAmount = installmentAmount + taxAmount + penaltyAmount;
        logger.info("Calculated total amount: {}", totalAmount);

        if (totalAmount < MINIMUM_AMOUNT_IN_RUPEES) {
            throw new ApiException("The installment amount is below the minimum allowed");
        }
        double finalAmount = Math.round(totalAmount * 100.0) / 100.0;
        return finalAmount;
    }




}
