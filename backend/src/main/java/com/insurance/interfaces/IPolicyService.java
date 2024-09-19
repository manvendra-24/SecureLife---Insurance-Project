package com.insurance.interfaces;

import com.insurance.request.PolicyRequest;
import com.insurance.response.CommissionResponse;
import com.insurance.response.PolicyResponse;
import com.insurance.util.PagedResponse;

import org.springframework.data.domain.Pageable;

public interface IPolicyService {

    String createPolicy(String token, PolicyRequest policyRequest);

    PagedResponse<PolicyResponse> getAllPolicies(String token,Pageable pageable);

    PagedResponse<PolicyResponse> getPoliciesByCustomerId(String token, String customerId, Pageable pageable);

    PagedResponse<PolicyResponse> getMyPolicies(String token, Pageable pageable);

	PagedResponse<CommissionResponse> getMyCommission(String token, Pageable pageable);

	PagedResponse<CommissionResponse> getCommissionByAgentId(String token, String agentId, Pageable pageable);

	PolicyResponse getPolicybyId(String policyid);
}
