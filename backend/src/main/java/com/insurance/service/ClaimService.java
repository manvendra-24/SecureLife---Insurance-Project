package com.insurance.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.stereotype.Service;

import com.insurance.entities.Claim;
import com.insurance.entities.Customer;
import com.insurance.entities.Document;
import com.insurance.entities.Policy;
import com.insurance.entities.User;
import com.insurance.enums.ClaimStatus;
import com.insurance.enums.PolicyStatus;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IClaimService;
import com.insurance.repository.ClaimRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.DocumentRepository;
import com.insurance.repository.PolicyRepository;
import com.insurance.repository.UserRepository;
import com.insurance.request.ClaimRequest;
import com.insurance.response.ClaimResponse;
import com.insurance.response.DocumentResponse;
import com.insurance.response.InsuranceSettingResponse;
import com.insurance.security.JwtTokenProvider;

@Service
public class ClaimService implements IClaimService {

	
    private static final Logger logger = LoggerFactory.getLogger(WithdrawalService.class);

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    PolicyRepository policyRepository;

    @Autowired
    DocumentRepository documentRepository;

    @Autowired
    ClaimRepository claimRepository;
    
    @Autowired
    EmailService emailService;
    
    
    @Autowired
    AdminService adminService;

    @Override
    public String requestClaim(String token, ClaimRequest claimRequest, String policyId) {
        String username = jwtTokenProvider.getUsername(token);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new ResourceNotFoundException("User is not available");
        }
        User user = oUser.get();

        Customer customer = customerRepository.findByUser(user);
        if (customer == null) {
            throw new ApiException("Customer not found");
        }

        Policy policy = policyRepository.findById(policyId)
            .orElseThrow(() -> new ResourceNotFoundException("Policy not found"));

       
        Document document = documentRepository.findById(claimRequest.getDocumentId()).orElse(null);
        if (document==null) {
            throw new ResourceNotFoundException("No documents found with the provided IDs");
        }
        
        List<Document>documents=new ArrayList<>();
        documents.add(document);

        Claim claim = new Claim();
        claim.setPolicy(policy);
        claim.setExplanation(claimRequest.getExplanation());
        claim.setDocuments(documents);  
        claim.setStatus(ClaimStatus.PENDING);
        
        claimRepository.save(claim);

        return "Claim request sent successfully";
    }




    @Override
    public Page<ClaimResponse> getAllClaimsByCustomerId(String customerId, Pageable pageable) {
        Page<Claim> claims = claimRepository.findAllByCustomerId(customerId, pageable); 
        return claims.map(this::convertToClaimResponse); 
    }

    @Override
    public Page<ClaimResponse> getAllClaims(String searchQuery, Pageable pageable) {
        Page<Claim> claims = claimRepository.findAllWithSearchQuery(searchQuery, pageable);
        return claims.map(this::convertToClaimResponse); 
    }

    @Override
    public void approveClaim(Long claimId) {
        Claim claim = claimRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        claim.setStatus(ClaimStatus.APPROVED);
        claim.getPolicy().setStatus(PolicyStatus.CLAIMED);
        claimRepository.save(claim);

        InsuranceSettingResponse insuranceSetting = adminService.getLastInsuranceSetting();
        String subject = "SecureLife Insurance - Your Claim Request has been Approved";
        String emailBody = "Dear " + claim.getPolicy().getCustomer().getName() + ",\n\n" +
                "We are pleased to inform you that your Claim request has been successfully approved at SecureLife Insurance. " +
                "The requested funds " + (claim.getPolicy().getTotalInvestmentAmount()*(1 - insuranceSetting.getClaimDeduction()/100)) +
                "will be processed and transferred shortly.\n\n" +
                "Thank you for choosing SecureLife Insurance for your financial needs.\n\n" +
                "Best Regards,\n" +
                "SecureLife Insurance Team";

        
        try {
            emailService.sendEmail(claim.getPolicy().getCustomer().getUser().getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", claim.getPolicy().getCustomer().getUser().getEmail(), exc.getMessage());
        } finally {
            logger.info("Claim Request approved successfully with username: {}", claim.getPolicy().getCustomer().getName());
        }
    }

    @Override
    public void rejectClaim(Long claimId) {
        Claim claim = claimRepository.findById(claimId).orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
        claim.setStatus(ClaimStatus.REJECTED);
        claimRepository.save(claim);

        String subject = "SecureLife Insurance - Your Claim Request has been Rejected";
        String emailBody = "Dear " + claim.getPolicy().getCustomer().getName() + ",\n\n" +
                "We regret to inform you that your claim request has been rejected at SecureLife Insurance. " +
                "Please review the request details or contact our support team for more information.\n\n" +
                "We appreciate your understanding and look forward to assisting you further.\n\n" +
                "Best Regards,\n" +
                "SecureLife Insurance Team";

        
        try {
            emailService.sendEmail(claim.getPolicy().getCustomer().getUser().getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", claim.getPolicy().getCustomer().getUser().getEmail(), exc.getMessage());
        } finally {
            logger.info("Claim Rejected successfully with username: {}", claim.getPolicy().getCustomer().getName());
        }
    }

    private ClaimResponse convertToClaimResponse(Claim claim) {
        ClaimResponse response = new ClaimResponse();
        response.setClaimId(claim.getClaimId());
        response.setPolicyId(claim.getPolicy().getPolicyId());
        response.setExplanation(claim.getExplanation());
        response.setCustomerId(claim.getPolicy().getCustomer().getCustomerId());
        response.setStatus(claim.getStatus());
        return response;
    }


	@Override
	public List<DocumentResponse> getDocumentsByClaimId(Long claimId, String token) {
		Claim claim = claimRepository.findById(claimId)
	            .orElseThrow(() -> new ResourceNotFoundException("Claim not found"));
	        
	        List<Document> documents = documentRepository.findByClaim(claim);
	        List<DocumentResponse> documentResponses = new ArrayList<>();
	        for (Document document : documents) {
	            DocumentResponse documentResponse = new DocumentResponse();
	            documentResponse.setDocumentId(document.getDocumentId());
	            documentResponse.setDocumentName(document.getDocumentName());
	            documentResponse.setDocumentType(document.getDocumentType());
	            documentResponse.setUploadDate(document.getUploadDate());
	            documentResponses.add(documentResponse);
	        }
	        return documentResponses;
	        
	}
}
