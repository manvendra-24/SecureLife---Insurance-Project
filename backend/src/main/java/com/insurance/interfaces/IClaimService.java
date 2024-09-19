package com.insurance.interfaces;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.insurance.request.ClaimRequest;
import com.insurance.response.ClaimResponse;
import com.insurance.response.DocumentResponse;

import java.util.List;

public interface IClaimService {

    String requestClaim(String token, ClaimRequest claimRequest, String policyId);

    List<DocumentResponse> getDocumentsByClaimId(Long claimId, String token);

    Page<ClaimResponse> getAllClaimsByCustomerId(String customerId, Pageable pageable);

    Page<ClaimResponse> getAllClaims(Pageable pageable);

    void approveClaim(Long claimId);

    void rejectClaim(Long claimId);

}
