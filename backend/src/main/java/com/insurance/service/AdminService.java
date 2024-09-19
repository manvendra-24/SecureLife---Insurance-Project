package com.insurance.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.insurance.entities.Admin;
import com.insurance.entities.InsuranceSetting;
import com.insurance.entities.Role;
import com.insurance.entities.TaxSetting;
import com.insurance.entities.User;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IAdminService;
import com.insurance.repository.AdminRepository;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.CityRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.InsurancePlanRepository;
import com.insurance.repository.InsuranceSchemeRepository;
import com.insurance.repository.InsuranceSettingRepository;
import com.insurance.repository.InsuranceTypeRepository;
import com.insurance.repository.RoleRepository;
import com.insurance.repository.StateRepository;
import com.insurance.repository.TaxSettingRepository;
import com.insurance.repository.TransactionRepository;
import com.insurance.repository.UserRepository;
import com.insurance.repository.WithdrawalRequestRepository;
import com.insurance.request.AdminRegisterRequest;
import com.insurance.request.InsuranceSettingRequest;
import com.insurance.request.TaxSettingRequest;
import com.insurance.response.AdminResponse;
import com.insurance.response.InsuranceSettingResponse;
import com.insurance.response.TaxSettingResponse;
import com.insurance.security.JwtTokenProvider;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;
import com.insurance.util.UniqueIdGenerator;


@Service
public class AdminService implements IAdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    Mappers mappers;
    
    @Autowired
    PasswordEncoder passwordEncoder;
    
    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
	EmailService emailService;
    
    @Autowired
    AdminRepository adminRepository;
    
    @Autowired
    InsuranceTypeRepository insuranceTypeRepository;
    
    @Autowired
    InsurancePlanRepository insurancePlanRepository;
    
    @Autowired
    RoleRepository roleRepository;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    CustomerRepository customerRepository;
    
    @Autowired
    EmployeeRepository employeeRepository;
    
    @Autowired
    AgentRepository agentRepository;
    
    @Autowired
    StateRepository stateRepository;
    
    @Autowired
    CityRepository cityRepository;
    
    @Autowired
    WithdrawalRequestRepository withdrawalRequestRepository;
    
    @Autowired
    TransactionRepository transactionRepository;

    @Autowired
    TaxSettingRepository taxSettingRepository;
    
    @Autowired
    InsuranceSchemeRepository insuranceSchemeRepository;
    
    @Autowired
    UniqueIdGenerator uniqueIdGenerator;

    @Autowired
    InsuranceSettingRepository insuranceSettingRepository;

    
    @Override
    public String registerAdmin(AdminRegisterRequest registerDto) {
        logger.info("Registering new admin with username: {}", registerDto.getUsername());
        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new ApiException("Username already exists!");
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new ApiException("Email already exists!");
        }
      
        User user = new User();
        user.setUserId(uniqueIdGenerator.generateUniqueId(User.class));
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        Optional<Role> oRole = roleRepository.findByName("ROLE_ADMIN");
        if (oRole.isEmpty()) {
            throw new ApiException("Role not found : ROLE_ADMIN");
        }
      
        user.setRole(oRole.get());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        Admin admin = new Admin();
        logger.info("Saving new admin details for username: {}", registerDto.getUsername());
        admin.setAdminId(uniqueIdGenerator.generateUniqueId(Admin.class));
        admin.setName(registerDto.getName());
        admin.setUser(user);
        admin.setPhoneNumber(registerDto.getPhoneNumber());
        adminRepository.save(admin);

        String subject = "Welcome to SecureLife Insurance - Your Admin Account Has Been Created!";
        String emailBody = "Dear " + registerDto.getName() + ",\n\n" +
                           "Congratulations! Your admin account has been successfully created at SecureLife Insurance. " +
                           "You are now a part of our trusted administrative team overseeing important aspects of the company.\n\n" +
                           "Best Regards,\n" +
                           "SecureLife Insurance Team";

        try {
            emailService.sendEmail(user.getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
        } finally {
            logger.info("Admin registered successfully with username: {}", registerDto.getUsername());
        }

        return "Admin registered successfully!";


        
    }
 

    @Override
    public PagedResponse<AdminResponse> getAllAdmins(int page, int size, String sortBy, String direction, String searchQuery) {
        logger.info("Fetching all admins with page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);
        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) 
                    ? Sort.by(sortBy).descending() 
                    : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        Page<Admin> page1 = adminRepository.findAllWithSearchQuery(searchQuery, pageable);
        List<Admin> admins = page1.getContent();
        List<AdminResponse> adminResponses = new ArrayList<>();
        for (Admin admin : admins) {
            AdminResponse adminResponse = mappers.adminToAdminResponse(admin);
            adminResponses.add(adminResponse);
        }
        logger.info("Found {} admins", admins.size());
        return new PagedResponse<>(adminResponses, page1.getNumber(), page1.getSize(), page1.getTotalElements(), page1.getTotalPages(), page1.isLast());
    }

    @Override
    public String updateAdmin(String admin_id, AdminRegisterRequest adminRequest) {
        logger.info("Updating admin with id: {}", admin_id);
        Optional<Admin> oAdmin = adminRepository.findById(admin_id);
        if (oAdmin.isEmpty()) {
            throw new ResourceNotFoundException("Admin not found with id: " + admin_id);
        }
        Admin admin = oAdmin.get();
        admin.setName(adminRequest.getName());
        admin.setPhoneNumber(adminRequest.getPhoneNumber());
        User user = admin.getUser();
        user.setEmail(adminRequest.getEmail());
        user.setUsername(adminRequest.getUsername());
        user.setPassword(passwordEncoder.encode(adminRequest.getPassword()));
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
        admin.setUser(user);
        adminRepository.save(admin);
        logger.info("Admin with id {} updated successfully", admin_id);
        return "Admin updated";
    }

    @Override
    public String deleteAdmin(String admin_id) {
        logger.info("Deleting admin with id: {}", admin_id);
        Optional<Admin> oAdmin = adminRepository.findById(admin_id);
        if (oAdmin.isEmpty()) {
            throw new ResourceNotFoundException("Admin with id " + admin_id + " not found");
        }
        Admin admin = oAdmin.get();
        User user = admin.getUser();
        if (!user.isActive()) {
            throw new ApiException("Admin with id " + admin_id  +" is already inactive");
        }
        user.setActive(false);
        userRepository.save(user);
        adminRepository.save(admin);
        logger.info("Admin with id {} deleted successfully", admin_id);
        return "Admin successfully deleted";
    }

    @Override
    public String activateAdmin(String admin_id) {
        logger.info("Activating admin with id: {}", admin_id);
        Optional<Admin> oAdmin = adminRepository.findById(admin_id);
        if (oAdmin.isEmpty()) {
            throw new ResourceNotFoundException("Admin with id "+ admin_id +" not found");
        }
        Admin admin = oAdmin.get();
        User user = admin.getUser();
        if (user.isActive()) {
            throw new ApiException("Admin with id " + admin_id + " is already active ");
        }
        user.setActive(true);
        userRepository.save(user);
        adminRepository.save(admin);
        logger.info("Admin with id {} activated successfully", admin_id);
        return "Admin successfully activated";
    }
    
    @Override
    public AdminResponse getAdminById(String admin_id) {
        logger.info("Fetching admin with id: {}", admin_id);
        Optional<Admin> admin = adminRepository.findById(admin_id);
        if (admin.isEmpty()) {
            throw new ResourceNotFoundException("Admin not found with id: " + admin_id);
        }
        AdminResponse adminResponse = mappers.adminToAdminResponse(admin.get());
        logger.info("Successfully fetched admin with id: {}", admin_id);
        
        return adminResponse;
    }
    
    
    
    
    
    
    @Override
    public String createTaxSetting(TaxSettingRequest taxSettingRequest) {
        logger.info("Creating tax setting with percentage: {}", taxSettingRequest.getTaxPercentage());
        TaxSetting taxSetting = new TaxSetting();
        taxSetting.setTaxPercentage(taxSettingRequest.getTaxPercentage());
        taxSettingRepository.save(taxSetting);
        logger.info("Tax setting created successfully");
        return "Tax Setting created";
    }

    @Override
    public TaxSettingResponse getLastTaxSetting() {
        logger.info("Getting Latest Tax Setting");
        PageRequest pageable = PageRequest.of(0, 1);
        Page<TaxSetting> page = taxSettingRepository.findLatestTaxSetting(pageable);
        if (!page.isEmpty()) {
            TaxSetting latestTaxSetting = page.getContent().get(0);
            TaxSettingResponse taxSettingResponse = new TaxSettingResponse();
            taxSettingResponse.setTaxPercentage(latestTaxSetting.getTaxPercentage());
            return taxSettingResponse;
        }
        return null;
    }

    
    @Override
    public String createInsuranceSetting(InsuranceSettingRequest insuranceSettingRequestDto) {
        logger.info("Creating insurance setting with claim deduction: {}", insuranceSettingRequestDto.getClaimDeduction());
        InsuranceSetting insuranceSetting = new InsuranceSetting();
        insuranceSetting.setClaimDeduction(insuranceSettingRequestDto.getClaimDeduction());
        insuranceSetting.setWithdrawalPenalty(insuranceSettingRequestDto.getWithdrawalPenalty());
        insuranceSetting.setLatePenalty(insuranceSettingRequestDto.getLatePenalty());
        insuranceSettingRepository.save(insuranceSetting);
        logger.info("Insurance setting updated successfully");
        return "Insurance Setting updated";
    }
    @Override
    public InsuranceSettingResponse getLastInsuranceSetting() {
        logger.info("Getting Latest Insurance Setting");
        PageRequest pageable = PageRequest.of(0, 1);
        Page<InsuranceSetting> page = insuranceSettingRepository.findLatestInsuranceSetting(pageable);
        if (!page.isEmpty()) {
            InsuranceSetting latestInsuranceSetting = page.getContent().get(0);
            InsuranceSettingResponse insuranceSettingResponse = new InsuranceSettingResponse();
            insuranceSettingResponse.setClaimDeduction(latestInsuranceSetting.getClaimDeduction());
            insuranceSettingResponse.setWithdrawalPenalty(latestInsuranceSetting.getWithdrawalPenalty());
            insuranceSettingResponse.setLatePenalty(latestInsuranceSetting.getLatePenalty());
            return insuranceSettingResponse;
        }
        return null;
    }



	
}
