package com.insurance.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.insurance.entities.InsurancePlan;
import com.insurance.entities.InsuranceScheme;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IInsurancePlanService;
import com.insurance.repository.InsurancePlanRepository;
import com.insurance.repository.InsuranceSchemeRepository;
import com.insurance.request.InsurancePlanRequest;
import com.insurance.response.InsurancePlanResponse;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;
import com.insurance.util.UniqueIdGenerator;

@Service
public class InsurancePlanService implements IInsurancePlanService {

    private static final Logger logger = LoggerFactory.getLogger(InsurancePlanService.class);

    @Autowired
    InsurancePlanRepository insurancePlanRepository;

    @Autowired
    InsuranceSchemeRepository insuranceSchemeRepository;

    @Autowired
    UniqueIdGenerator uniqueIdGenerator;

    @Autowired
    Mappers mappers;

    @Override
    public String createInsurancePlan(String schemeId, InsurancePlanRequest planRequest) {
        logger.info("Creating new insurance plan for scheme ID: {}", schemeId);

        Optional<InsuranceScheme> oInsuranceScheme = insuranceSchemeRepository.findById(schemeId);
        if (oInsuranceScheme.isEmpty()) {
            throw new ResourceNotFoundException("Insurance Scheme not found");
        }
        
        InsurancePlan insurancePlan = mappers.insurancePlanRequestToInsurancePlan(planRequest, oInsuranceScheme.get());
        insurancePlan.setInsuranceId(uniqueIdGenerator.generateUniqueId(InsurancePlan.class));
        insurancePlanRepository.save(insurancePlan);

        logger.info("Insurance Plan created successfully with ID: {}", insurancePlan.getInsuranceId());
        return "Insurance Plan Created";
    }

    @Override
    public String updateInsurancePlan(String schemeId, InsurancePlanRequest planRequest) {
        logger.info("Updating insurance scheme with ID: {}", schemeId);

        Optional<InsuranceScheme> oInsuranceScheme = insuranceSchemeRepository.findById(schemeId);
        if (oInsuranceScheme.isEmpty()) {
            throw new ResourceNotFoundException("Insurance Scheme not found");
        }

        InsuranceScheme insuranceScheme = oInsuranceScheme.get();
        InsurancePlan insurancePlan = insuranceScheme.getInsurancePlan();
        
        insurancePlan.setMinimumPolicyTerm(planRequest.getMinimumPolicyTerm());
        insurancePlan.setMaximumPolicyTerm(planRequest.getMaximumPolicyTerm());
        insurancePlan.setMinimumAge(planRequest.getMinimumAge());
        insurancePlan.setMaximumAge(planRequest.getMaximumAge());
        insurancePlan.setMinimumInvestmentAmount(planRequest.getMinimumInvestmentAmount());
        insurancePlan.setMaximumInvestmentAmount(planRequest.getMaximumInvestmentAmount());
        insurancePlan.setProfitRatio(planRequest.getProfitRatio());
        insurancePlan.setActive(planRequest.isActive());

        // Save or update the InsurancePlan
        insurancePlanRepository.save(insurancePlan);

        logger.info("Insurance Plan updated/created successfully with ID: {}", schemeId);
        return "Insurance Plan Updated/Created";
    }



    @Override
    public String activateInsurancePlan(String id) {
        logger.info("Activating insurance plan with ID: {}", id);

        Optional<InsurancePlan> oInsurancePlan = insurancePlanRepository.findById(id);
        if (oInsurancePlan.isEmpty()) {
            throw new ResourceNotFoundException("Insurance Plan not found with PlanId: " + id);
        }

        InsurancePlan insurancePlan = oInsurancePlan.get();
        if (insurancePlan.isActive()) {
            throw new ApiException("Insurance Plan is already active with id" + id);
        }

        insurancePlan.setActive(true);
        insurancePlanRepository.save(insurancePlan);

        logger.info("Insurance Plan activated successfully with ID: {}", id);
        return "Insurance Plan Activated";
    }

    @Override
    public String deleteInsurancePlan(String id) {
        logger.info("Deactivating insurance plan with ID: {}", id);

        Optional<InsurancePlan> oInsurancePlan = insurancePlanRepository.findById(id);
        if (oInsurancePlan.isEmpty()) {
            throw new ResourceNotFoundException("Insurance Plan not found with id: "+id);
        }

        InsurancePlan insurancePlan = oInsurancePlan.get();
        if (!insurancePlan.isActive()) {
            throw new ApiException("Insurance Plan is already inactive");
        }

        insurancePlan.setActive(false);
        insurancePlanRepository.save(insurancePlan);

        logger.info("Insurance Plan deactivated successfully with ID: {}", id);
        return "Insurance Plan Deactivated";
    }

    @Override
    public PagedResponse<InsurancePlanResponse> getAllInsurancePlans(int page, int size, String sortBy, String direction, String searchQuery) {
        logger.info("Fetching all insurance plans with pagination - page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);

        Page<InsurancePlan> insurancePlanPage = insurancePlanRepository.findAll(pageable);
        List<InsurancePlanResponse> insurancePlanResponseList = insurancePlanPage.getContent().stream()
                .map(mappers::insurancePlanToInsurancePlanResponse).collect(Collectors.toList());

        logger.info("Fetched {} insurance plans", insurancePlanResponseList.size());
        return new PagedResponse<>(insurancePlanResponseList, insurancePlanPage.getNumber(), insurancePlanPage.getSize(),
                insurancePlanPage.getTotalElements(), insurancePlanPage.getTotalPages(), insurancePlanPage.isLast());
    }

	@Override
	public InsurancePlanResponse getInsurancePlan(String schemeId) {
		logger.info("Creating new insurance plan for scheme ID: {}", schemeId);

        Optional<InsuranceScheme> oInsuranceScheme = insuranceSchemeRepository.findById(schemeId);
        if (oInsuranceScheme.isEmpty()) {
            throw new ResourceNotFoundException("Insurance Scheme not found");
        }
        InsurancePlan insurancePlan = insurancePlanRepository.findByInsuranceScheme(oInsuranceScheme.get());
        if(insurancePlan == null) {
        	return null;
        }
        InsurancePlanResponse insurancePlanResponse = mappers.insurancePlanToInsurancePlanResponse(insurancePlan);
        return insurancePlanResponse;
	}
	
	@Override
    public PagedResponse<InsurancePlanResponse> getInsurancePlansBySchemeId(String schemeId, int page, int size, String sortBy, String direction, String searchQuery) {
        logger.info("Fetching insurance plans for schemeId: {}, page: {}, size: {}, sortBy: {}, direction: {}", schemeId, page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);

        Page<InsurancePlan> insurancePlanPage = insurancePlanRepository.findByInsuranceSchemeInsuranceSchemeId(schemeId, pageable);
        List<InsurancePlanResponse> insurancePlanResponseList = insurancePlanPage.getContent().stream()
                .map(mappers::insurancePlanToInsurancePlanResponse).collect(Collectors.toList());

        logger.info("Fetched {} insurance plans for schemeId: {}", insurancePlanResponseList.size(), schemeId);
        return new PagedResponse<>(insurancePlanResponseList, insurancePlanPage.getNumber(), insurancePlanPage.getSize(),
                insurancePlanPage.getTotalElements(), insurancePlanPage.getTotalPages(), insurancePlanPage.isLast());
    }
}
