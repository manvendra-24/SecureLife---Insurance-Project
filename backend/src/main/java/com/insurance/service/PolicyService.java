package com.insurance.service;

import com.insurance.entities.Agent;
import com.insurance.entities.Customer;
import com.insurance.entities.InsurancePlan;
import com.insurance.entities.Policy;
import com.insurance.entities.User;
import com.insurance.enums.CreationStatus;
import com.insurance.enums.PaymentInterval;
import com.insurance.enums.PolicyStatus;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.exceptions.UnauthorizedException;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.InsurancePlanRepository;
import com.insurance.repository.PolicyRepository;
import com.insurance.repository.UserRepository;
import com.insurance.request.PolicyRequest;
import com.insurance.response.CommissionResponse;
import com.insurance.response.PolicyResponse;
import com.insurance.security.JwtTokenProvider;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;
import com.insurance.util.UniqueIdGenerator;
import com.insurance.interfaces.IPolicyService;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PolicyService implements IPolicyService {

    private static final Logger logger = LoggerFactory.getLogger(PolicyService.class);
	
	@Autowired
	Mappers mappers;
	
	@Autowired
    private PolicyRepository policyRepository;

	@Autowired
	JwtTokenProvider jwtTokenProvider;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	CustomerRepository customerRepository;
	
	@Autowired
	UniqueIdGenerator uniqueIdGenerator;
	
	@Autowired
	AgentRepository agentRepository;

	@Autowired
	InsurancePlanRepository insurancePlanRepository;

    @Override
    public String createPolicy(String token, PolicyRequest policyRequest) {
        String username = jwtTokenProvider.getUsername(token);
        logger.info("Creating policy for user: {}", username);
        
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }
        User user = oUser.get();

        Customer customer = customerRepository.findByUser(user);
        if (customer == null) {
            throw new ApiException("Customer not found for "+ username);
        }
        if (customer.getStatus() == CreationStatus.REJECTED) {
            throw new ApiException("Sorry, you cannot create a policy");
        }
        
        InsurancePlan insurancePlan = insurancePlanRepository.findById(policyRequest.getPlan_id())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Insurance Plan ID"));
        if(!insurancePlan.isActive()) {
        	throw new ApiException("Insurance Plan is not active");
        }
        if (policyRequest.getPolicyTerm() < insurancePlan.getMinimumPolicyTerm() ||
                policyRequest.getPolicyTerm() > insurancePlan.getMaximumPolicyTerm()) {
                throw new IllegalArgumentException("Policy term is outside the allowed range for the selected plan.");
        }
        
        int customerAge = Period.between(customer.getDob(), LocalDate.now()).getYears();
        if(customer.getStatus() != CreationStatus.APPROVED) {
        	throw new ApiException("Customer is not verified");
        }
        if (customerAge < insurancePlan.getMinimumAge() || customerAge > insurancePlan.getMaximumAge()) {
            throw new ApiException("Age does not meet the requirements for the selected insurance plan.");
        }

        if (policyRequest.getTotalInvestmentAmount() < insurancePlan.getMinimumInvestmentAmount() ||
                policyRequest.getTotalInvestmentAmount() > insurancePlan.getMaximumInvestmentAmount()) {
                throw new IllegalArgumentException("Total investment amount is outside the allowed range for the selected plan.");
        }

        Policy policy = new Policy();
        policy.setPolicyId(uniqueIdGenerator.generateUniqueId(Policy.class));
        policy.setCustomer(customer);
        policy.setPlan(insurancePlanRepository.findById(policyRequest.getPlan_id())
            .orElseThrow(() -> new ResourceNotFoundException("Plan not found")));
        policy.setStartDate(LocalDate.now());
        policy.setPolicyTerm(policyRequest.getPolicyTerm());
        policy.setEndDate(policy.getStartDate().plusYears(policy.getPolicyTerm()));
        policy.setTotalInvestmentAmount(policyRequest.getTotalInvestmentAmount());
        policy.setPaymentInterval(PaymentInterval.valueOf(policyRequest.getPaymentInterval().toUpperCase()));
        policy.setInstallmentAmount(calculateInstallmentAmount(policyRequest));
        policy.setTotalAmountPaid(0.0);
        policy.setNextPaymentDate(policy.getStartDate());
        policy.setStatus(PolicyStatus.ACTIVE);

        if (policyRequest.getAgent_id() != null) {
            Agent agent = agentRepository.findById(policyRequest.getAgent_id())
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
            policy.setAgent(agent);
            logger.info("Policy assigned to agent: {}", agent.getAgentId());
        }

        policyRepository.save(policy);
        logger.info("Policy created successfully for customer: {}", customer.getCustomerId());

        return "Customer successfully registered for policy";
    }

    @Override
    public PagedResponse<PolicyResponse> getAllPolicies(String token, Pageable pageable) {
        String username = jwtTokenProvider.getUsername(token);
        logger.info("Fetching all policies for user: {}", username);
        
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }

        Page<Policy> policies = policyRepository.findAll(pageable);
        List<PolicyResponse> policyResponses = policies.getContent().stream()
            .map(mappers::convertToPolicyResponse)
            .collect(Collectors.toList());

        logger.info("Fetched {} policies", policies.getTotalElements());

        return new PagedResponse<>(policyResponses, policies.getNumber(), policies.getSize(), policies.getTotalElements(), policies.getTotalPages(), policies.isLast());
    }

    @Override
    public PagedResponse<PolicyResponse> getPoliciesByCustomerId(String token, String customerId, Pageable pageable) {
        String username = jwtTokenProvider.getUsername(token);
        logger.info("Fetching policies for customer: {} by user: {}", customerId, username);

        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }

        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isEmpty()) {
            throw new ResourceNotFoundException("Customer not found for customerId: " + customerId);
        }

        Page<Policy> policies = policyRepository.findByCustomer(customer.get(), pageable);
        List<PolicyResponse> policyResponses = policies.getContent().stream()
            .map(mappers::convertToPolicyResponse)
            .collect(Collectors.toList());

        logger.info("Fetched {} policies for customer: {}", policies.getTotalElements(), customerId);

        return new PagedResponse<>(policyResponses, policies.getNumber(), policies.getSize(), policies.getTotalElements(), policies.getTotalPages(), policies.isLast());
    }

    @Override
    public PagedResponse<PolicyResponse> getMyPolicies(String token, Pageable pageable) {
        String username = jwtTokenProvider.getUsername(token);
        logger.info("Fetching policies for logged-in user: {}", username);

        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }

        Customer customer = customerRepository.findByUser(oUser.get());
        if (customer == null) {
            throw new ApiException("Customer not found for " + username);
        }
        if (customer.getStatus() == CreationStatus.REJECTED) {
            throw new ApiException("Sorry, you cannot get your policies");
        }

        Page<Policy> policies = policyRepository.findByCustomer(customer, pageable);
        List<PolicyResponse> policyResponses = policies.getContent().stream()
            .map(mappers::convertToPolicyResponse)
            .collect(Collectors.toList());

        logger.info("Fetched {} policies for customer: {}", policies.getTotalElements(), customer.getCustomerId());

        return new PagedResponse<>(policyResponses, policies.getNumber(), policies.getSize(), policies.getTotalElements(), policies.getTotalPages(), policies.isLast());
    }

    private int calculateInstallmentAmount(PolicyRequest policyRequest) {
        int totalInvestmentAmount = policyRequest.getTotalInvestmentAmount();
        int policyTermInYears = policyRequest.getPolicyTerm();
        PaymentInterval paymentInterval = PaymentInterval.valueOf(policyRequest.getPaymentInterval().toUpperCase());


        int paymentsPerYear;
        switch (paymentInterval) {
            case YEARLY:
                paymentsPerYear = 1;
                break;
            case HALF_YEARLY:
                paymentsPerYear = 2;
                break;
            case QUARTERLY:
                paymentsPerYear = 4;
                break;
            default:
                logger.error("Invalid payment interval: {}", paymentInterval);
                throw new IllegalArgumentException("Invalid payment interval");
        }

        int totalPayments = policyTermInYears * paymentsPerYear;
        logger.info("Calculated {} installment payments for policy term: {} years", totalPayments, policyTermInYears);

        return totalInvestmentAmount / totalPayments;
    }

    @Override
    public PagedResponse<CommissionResponse> getMyCommission(String token, String searchQuery, Pageable pageable) {
        String username = jwtTokenProvider.getUsername(token);
        logger.info("Fetching commissions for agent: {}", username);

        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }

        Agent agent = agentRepository.findByUser(oUser.get());
        if (agent == null) {
            throw new ApiException("Agent not found for "+ username);
        }

        Page<Policy> policies = policyRepository.findByAgentWithSearchQuery(agent, searchQuery, pageable);
        List<CommissionResponse> commissionResponses = policies.getContent().stream()
            .map(mappers::convertToCommissionResponse)
            .collect(Collectors.toList());

        logger.info("Fetched {} commissions for agent: {}", policies.getTotalElements(), agent.getAgentId());

        return new PagedResponse<>(commissionResponses, policies.getNumber(), policies.getSize(), policies.getTotalElements(), policies.getTotalPages(), policies.isLast());
    }

    @Override
    public PagedResponse<CommissionResponse> getCommissionByAgentId(String token, String agentId, Pageable pageable) {
        String username = jwtTokenProvider.getUsername(token);
        logger.info("Fetching commissions for agent: {} by user: {}", agentId, username);

        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }

        Optional<Agent> agent = agentRepository.findById(agentId);
        if (agent.isEmpty()) {
            throw new ApiException("Agent not found with agentId: " + agentId);
        }

        Page<Policy> policies = policyRepository.findByAgent(agent.get(), pageable);
        List<CommissionResponse> commissionResponses = policies.getContent().stream()
            .map(mappers::convertToCommissionResponse)
            .collect(Collectors.toList());

        logger.info("Fetched {} commissions for agent: {}", policies.getTotalElements(), agentId);

        return new PagedResponse<>(commissionResponses, policies.getNumber(), policies.getSize(), policies.getTotalElements(), policies.getTotalPages(), policies.isLast());
    }
    
    @Override
    public PolicyResponse getPolicybyId(String policyid) {
      Policy policy = policyRepository.findById(policyid).orElse(null);
      if(policy!=null) {
        return mappers.convertToPolicyResponse(policy);
      }
      else {
        throw new ApiException("Policy not found");
      }
    }
}