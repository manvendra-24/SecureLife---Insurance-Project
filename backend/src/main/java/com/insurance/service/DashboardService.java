package com.insurance.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.insurance.entities.Agent;
import com.insurance.entities.Policy;
import com.insurance.entities.User;
import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.IDashboardService;
import com.insurance.repository.AdminRepository;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.PolicyRepository;
import com.insurance.repository.UserRepository;
import com.insurance.repository.WithdrawalRequestRepository;
import com.insurance.security.JwtTokenProvider;

@Service
public class DashboardService implements IDashboardService{

 @Autowired
 private AdminRepository adminRepository;

 @Autowired
 private AgentRepository agentRepository;

 @Autowired
 private CustomerRepository customerRepository;

 @Autowired
 private EmployeeRepository employeeRepository;
 
 @Autowired
 JwtTokenProvider jwtTokenProvider;
 
 @Autowired
 UserRepository userRepository;
 
 @Autowired
 WithdrawalRequestRepository withdrawalRequestRepository;

 
 @Autowired
 private PolicyRepository policyRepository;

 public long getTotalAdmins() {
     return adminRepository.count();
 }

 public long getTotalAgents() {
     return agentRepository.count();
 }

 public long getTotalCustomers() {
     return customerRepository.count();
 }

 public long getTotalEmployees() {
     return employeeRepository.count();
 }

@Override
public Double getMyCommissions(String token) {
	String username = jwtTokenProvider.getUsername(token);
    Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
    if (oUser.isEmpty()) {
        throw new UnauthorizedException("User is not available for token");
    }
    User user = oUser.get();
    
    Agent agent =agentRepository.findByUser(user);
    if(agent == null) {
    	throw new UnauthorizedException("User is not unauthorized");
    }
    
    Double totalCommissions = 0.0;
    List<Policy> policies = policyRepository.findByAgent(agent);
    
    for(Policy policy:policies) {
    	totalCommissions = totalCommissions + policy.getPlan().getInsuranceScheme().getNewRegistrationCommission();
    }

    return totalCommissions;
}

@Override
public Double getMyWithdrawals(String token) {
	String username = jwtTokenProvider.getUsername(token);
    Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
    if (oUser.isEmpty()) {
        throw new UnauthorizedException("User is not available for token");
    }
    User user = oUser.get();
    
    Agent agent =agentRepository.findByUser(user);
    if(agent == null) {
    	throw new UnauthorizedException("User is not unauthorized");
    }
    
    Double totalWithdrawals = 0.0;
    List<Policy> policies = policyRepository.findByAgent(agent);
    
    for(Policy policy:policies) {
    	totalWithdrawals = totalWithdrawals + policy.getPlan().getInsuranceScheme().getWithdrawalPenalty();
    }

    return totalWithdrawals;
}

@Override
public Long getCancelledPolicies(String token) {
	String username = jwtTokenProvider.getUsername(token);
    Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
    if (oUser.isEmpty()) {
        throw new UnauthorizedException("User is not available for token");
    }
    User user = oUser.get();
    
    Agent agent =agentRepository.findByUser(user);
    if(agent == null) {
    	throw new UnauthorizedException("User is not unauthorized");
    }
    Long count = withdrawalRequestRepository.countApprovedByAgent(agent);
	return count;
}

@Override
public Long getSoldPolicies(String token) {
	String username = jwtTokenProvider.getUsername(token);
    Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
    if (oUser.isEmpty()) {
        throw new UnauthorizedException("User is not available for token");
    }
    User user = oUser.get();
    
    Agent agent =agentRepository.findByUser(user);
    if(agent == null) {
    	throw new UnauthorizedException("User is not unauthorized");
    }
    List<Policy> policies = policyRepository.findByAgent(agent);
    Long size = (long) policies.size();
	return size;
}

}
