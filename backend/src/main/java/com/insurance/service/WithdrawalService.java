package com.insurance.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.stereotype.Service;

import com.insurance.entities.Admin;
import com.insurance.entities.Agent;
import com.insurance.entities.Customer;
import com.insurance.entities.Policy;
import com.insurance.entities.User;
import com.insurance.entities.WithdrawalRequest;
import com.insurance.enums.PolicyStatus;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.IWithdrawalService;
import com.insurance.repository.AdminRepository;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.InsuranceSettingRepository;
import com.insurance.repository.PolicyRepository;
import com.insurance.repository.UserRepository;
import com.insurance.repository.WithdrawalRequestRepository;
import com.insurance.response.InsuranceSettingResponse;
import com.insurance.response.WithdrawalRequestDTO;
import com.insurance.security.JwtTokenProvider;
import com.insurance.util.PagedResponse;


@Service
public class WithdrawalService implements IWithdrawalService {

    private static final Logger logger = LoggerFactory.getLogger(WithdrawalService.class);

    @Autowired
    WithdrawalRequestRepository withdrawalRequestRepository;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    AdminRepository adminRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PolicyRepository policyRepository;

    @Autowired
    CustomerRepository customerRepository;
    
    @Autowired
    AgentRepository agentRepository;

    @Autowired
    EmailService emailService;
    
    @Autowired
    InsuranceSettingRepository insuranceSettingRepository;
    
    @Autowired
    AdminService adminService;
    
    @Override
    public void withdrawalRequest(String token, String policy_id) {
        logger.info("Processing withdrawal request for policy ID: {}", policy_id);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for " + username);
        }
        User user = oUser.get();
        Customer customer = customerRepository.findByUser(user);
        if (customer == null || !customer.getUser().isActive()) {
            throw new ApiException("Unauthorized withdrawal request");
        }

        Policy policy = policyRepository.findById(policy_id).orElse(null);
        if (policy == null) {
            throw new ResourceNotFoundException("Policy not found with PolicyId:" + policy_id);
        }

        WithdrawalRequest withdrawalRequest = new WithdrawalRequest();
        withdrawalRequest.setStatus("PENDING");
        withdrawalRequest.setCustomer(customer);
        withdrawalRequest.setPolicy(policy);
        withdrawalRequest.setRequestDate(LocalDateTime.now());
        withdrawalRequestRepository.save(withdrawalRequest);

        logger.info("Withdrawal request created for customer: {} and policy: {}", customer.getCustomerId(), policy_id);
    }

    public String approveWithdrawal(String token, long withdrawal_id) {
        logger.info("Approving withdrawal request with ID: {}", withdrawal_id);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for " + username);
        }
        User user = oUser.get();
        Admin admin = adminRepository.findByUser(user);
        if (admin == null || !admin.getUser().isActive()) {
            throw new ApiException("Unauthorized admin approval attempt by user: " + username);
        }

        Optional<WithdrawalRequest> oWithdrawalRequest = withdrawalRequestRepository.findById(withdrawal_id);
        if (oWithdrawalRequest.isEmpty()) {
            throw new ResourceNotFoundException("Withdrawal Request not found");
        }
        WithdrawalRequest withdrawalRequest = oWithdrawalRequest.get();
        withdrawalRequest.setStatus("APPROVED");
        withdrawalRequest.setAdmin(admin);
        withdrawalRequest.getPolicy().setStatus(PolicyStatus.CANCELLED);
        withdrawalRequestRepository.save(withdrawalRequest);
        
        

        InsuranceSettingResponse insuranceSetting = adminService.getLastInsuranceSetting();
        String subject = "Welcome to SecureLife Insurance - Your Withdrawal Request is Approved!";
        String emailBody = "Dear " + withdrawalRequest.getCustomer().getName() + ",\n\n" +
                "We are pleased to inform you that your withdrawal request has been successfully approved at SecureLife Insurance. " +
                "The requested funds " + (withdrawalRequest.getPolicy().getTotalAmountPaid()*(1  - insuranceSetting.getWithdrawalPenalty()/100)) +
                "will be processed and transferred shortly.\n\n" +
                "Thank you for choosing SecureLife Insurance for your financial needs.\n\n" +
                "Best Regards,\n" +
                "SecureLife Insurance Team";

        try {
            emailService.sendEmail(withdrawalRequest.getCustomer().getUser().getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
        } finally {
            logger.info("Withdrawal Approved successfully with username: {}", withdrawalRequest.getCustomer().getName());
        }
        logger.info("Withdrawal request ID: {} approved by admin: {}", withdrawal_id, admin.getAdminId());
        return "Withdrawal approved";
    }

    @Override
    public String rejectWithdrawal(String token, long withdrawal_id) {
        logger.info("Rejecting withdrawal request with ID: {}", withdrawal_id);
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new ResourceNotFoundException("User is not available for "+ username);
        }
        User user = oUser.get();
        Admin admin = adminRepository.findByUser(user);
        if (admin == null || !admin.getUser().isActive()) {
            throw new ApiException("Unauthorized admin rejection attempt by user: "+ username);
        }

        Optional<WithdrawalRequest> oWithdrawalRequest = withdrawalRequestRepository.findById(withdrawal_id);
        if (oWithdrawalRequest.isEmpty()) {
            throw new ResourceNotFoundException("Withdrawal Request not found");
        }

        WithdrawalRequest withdrawalRequest = oWithdrawalRequest.get();
        withdrawalRequest.setStatus("REJECTED");
        withdrawalRequest.setAdmin(admin);
        withdrawalRequestRepository.save(withdrawalRequest);
        String subject = "SecureLife Insurance - Your Withdrawal Request has been Rejected";
        String emailBody = "Dear " + withdrawalRequest.getCustomer().getName() + ",\n\n" +
                "We regret to inform you that your withdrawal request has been rejected at SecureLife Insurance. " +
                "Please review the request details or contact our support team for more information.\n\n" +
                "We appreciate your understanding and look forward to assisting you further.\n\n" +
                "Best Regards,\n" +
                "SecureLife Insurance Team"; 
        try {
            emailService.sendEmail(withdrawalRequest.getCustomer().getUser().getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
        } finally {
            logger.info("Withdrawal Rejected successfully with username: {}", withdrawalRequest.getCustomer().getName());
        }
        logger.info("Withdrawal request ID: {} rejected by admin: {}", withdrawal_id, admin.getAdminId());
        return "Withdrawal rejected";
    }

	@Override
	public PagedResponse<WithdrawalRequestDTO> getAllWithdrawalRequests(int page, int size, String sortBy,
			String direction, String searchQuery) {
		logger.info("Fetching all withdrawal requests with page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) 
                    ? Sort.by(sortBy).descending() 
                    : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        Page<WithdrawalRequest> page1 = withdrawalRequestRepository.findAllWithSearchQuery(searchQuery, pageable);
        List<WithdrawalRequest> requests = page1.getContent();
        List<WithdrawalRequestDTO> withdrawalResponses = new ArrayList<>();
        for (WithdrawalRequest request : requests) {
            WithdrawalRequestDTO withdrawalResponse = new WithdrawalRequestDTO();
            withdrawalResponse.setCustomerId(request.getCustomer().getCustomerId());
            withdrawalResponse.setWithdrawalRequestId(request.getWithdrawalRequestId());
            withdrawalResponse.setPolicyId(request.getPolicy().getPolicyId());
            withdrawalResponse.setRequestDate(request.getRequestDate());
            withdrawalResponse.setStatus(request.getStatus());
            withdrawalResponses.add(withdrawalResponse);
        }
        logger.info("Found {} withdrawal Requests", withdrawalResponses.size());
        return new PagedResponse<>(withdrawalResponses, page1.getNumber(), page1.getSize(), page1.getTotalElements(), page1.getTotalPages(), page1.isLast());	
     }

	@Override
	public PagedResponse<WithdrawalRequestDTO> getMyWithdrawals(String token, PageRequest pageRequest) {
	    String username = jwtTokenProvider.getUsername(token);
	    logger.info("Fetching withdrawal requests for agent: {}", username);

	    Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
	    if (oUser.isEmpty()) {
	        throw new UnauthorizedException("User is not available for the provided token.");
	    }

	    Agent agent = agentRepository.findByUser(oUser.get());
	    if (agent == null) {
	        throw new ApiException("Agent not found for user: " + username);
	    }

	    Page<WithdrawalRequest> withdrawals = withdrawalRequestRepository.findByAgent(agent, pageRequest);

	    List<WithdrawalRequestDTO> withdrawalResponses = withdrawals.getContent().stream().map(request -> {
	        WithdrawalRequestDTO withdrawalResponse = new WithdrawalRequestDTO();
	        withdrawalResponse.setCustomerId(request.getCustomer().getCustomerId());
	        withdrawalResponse.setWithdrawalRequestId(request.getWithdrawalRequestId());
	        withdrawalResponse.setPolicyId(request.getPolicy().getPolicyId());
	        withdrawalResponse.setRequestDate(request.getRequestDate());
	        withdrawalResponse.setStatus(request.getStatus());
	        withdrawalResponse.setWithdrawalPenalty(request.getPolicy().getPlan().getInsuranceScheme().getWithdrawalPenalty());
	        return withdrawalResponse;
	    }).collect(Collectors.toList());

	    return new PagedResponse<>(withdrawalResponses, withdrawals.getNumber(),
	                               withdrawals.getSize(), withdrawals.getTotalElements(), withdrawals.getTotalPages(), withdrawals.isLast());
	}


}
