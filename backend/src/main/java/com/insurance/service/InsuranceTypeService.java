package com.insurance.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.insurance.entities.InsuranceScheme;
import com.insurance.entities.InsuranceType;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IInusranceService;
import com.insurance.repository.InsuranceTypeRepository;
import com.insurance.request.InsuranceTypeRequest;
import com.insurance.response.InsuranceTypeResponse;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;
import com.insurance.util.UniqueIdGenerator;

@Service
public class InsuranceTypeService implements IInusranceService {

    private static final Logger logger = LoggerFactory.getLogger(InsuranceTypeService.class);

    @Autowired
    InsuranceTypeRepository insuranceTypeRepository;

    @Autowired
    Mappers mappers;

    @Autowired
    UniqueIdGenerator uniqueIdGenerator;

    @Override
    public String createInsuranceType(InsuranceTypeRequest typeRequest) {
        logger.info("Creating new insurance type with name: {}", typeRequest.getName());

        InsuranceType insuranceType = mappers.insuranceTypeRequestToInsuranceType(typeRequest);
        insuranceType.setInsuranceTypeId(uniqueIdGenerator.generateUniqueId(InsuranceType.class));
        insuranceTypeRepository.save(insuranceType);

        logger.info("Insurance Type created successfully with ID: {}", insuranceType.getInsuranceTypeId());
        return "Insurance Type Created";
    }

    @Override
    public String updateInsuranceType(InsuranceTypeRequest typeRequest, String id) {
        logger.info("Updating insurance type with ID: {}", id);

        InsuranceType insuranceType = insuranceTypeRepository.findById(id).orElse(null);
        if (insuranceType != null) {
            insuranceType.setActive(typeRequest.isActive());
            insuranceType.setName(typeRequest.getName());
            insuranceTypeRepository.save(insuranceType);

            logger.info("Insurance Type updated successfully with ID: {}", id);
        } else {
            throw new ResourceNotFoundException("Insurance Type not Found");
        }
        return "Updated Successfully";
    }

    @Override
    public String deactivatingType(String id) {
        logger.info("Deactivating insurance type with ID: {}", id);

        InsuranceType insuranceType = insuranceTypeRepository.findById(id).orElse(null);
        if (insuranceType != null) {
            if (insuranceType.isActive()) {
                insuranceType.setActive(false);
                for(InsuranceScheme scheme:insuranceType.getInsuranceSchemes()) {
                	scheme.setActive(false);
                	scheme.getInsurancePlan().setActive(false);
                }
                insuranceTypeRepository.save(insuranceType);

                logger.info("Insurance Type deactivated successfully with ID: {}", id);
            } else {
                throw new ApiException("Type is already inactive");
            }
        } else {
            throw new ResourceNotFoundException("Insurance Type Not Found");
        }
        return "Deactivated Successfully";
    }

    @Override
    public String activatingType(String id) {
        logger.info("Activating insurance type with ID: {}", id);

        InsuranceType insuranceType = insuranceTypeRepository.findById(id).orElse(null);
        if (insuranceType != null) {
            if (insuranceType.isActive()) {
                throw new ApiException("Type is already active");
            } else {
                insuranceType.setActive(true);
                for(InsuranceScheme scheme:insuranceType.getInsuranceSchemes()) {
                	scheme.setActive(true);
                	scheme.getInsurancePlan().setActive(true);
                }
                insuranceTypeRepository.save(insuranceType);

                logger.info("Insurance Type activated successfully with ID: {}", id);
            }
        } else {
            throw new ResourceNotFoundException("Insurance Type Not Found");
        }

        return "Activated Successfully";
    }

    @Override
    public PagedResponse<InsuranceTypeResponse> getAllTypes(int page, int size, String sortBy, String direction, String searchQuery) {
        logger.info("Fetching all insurance types with pagination - page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        Page<InsuranceType> TypePage = insuranceTypeRepository.findAllWithSearchQuery(searchQuery,pageable);
        List<InsuranceTypeResponse> insuranceTypeResponses = TypePage.getContent().stream()
                .map(type -> mappers.insuranceTypeToInsuranceTypeResponse(type))
                .collect(Collectors.toList());

        logger.info("Fetched {} insurance types", insuranceTypeResponses.size());
        return new PagedResponse<>(insuranceTypeResponses,
                TypePage.getNumber(),
                TypePage.getSize(),
                TypePage.getTotalElements(),
                TypePage.getTotalPages(),
                TypePage.isLast());
    }
}
