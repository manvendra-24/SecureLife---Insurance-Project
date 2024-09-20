package com.insurance.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

import com.insurance.entities.Agent;
import com.insurance.entities.City;
import com.insurance.entities.Customer;
import com.insurance.entities.Employee;
import com.insurance.entities.Role;
import com.insurance.entities.User;
import com.insurance.enums.CreationStatus;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.ICustomerService;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.CityRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.RoleRepository;
import com.insurance.repository.UserRepository;
import com.insurance.request.CustomerRegisterRequest;
import com.insurance.response.CustomerResponse;
import com.insurance.response.CustomerResponseForUpdate;
import com.insurance.security.JwtTokenProvider;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;
import com.insurance.util.UniqueIdGenerator;

import jakarta.validation.Valid;


@Service
public class CustomerService implements ICustomerService {

    private static final Logger logger = LoggerFactory.getLogger(CustomerService.class);

   
    
    @Autowired
    Mappers mappers;
    @Autowired
    JwtTokenProvider jwtTokenProvider;
    @Autowired
    AgentRepository agentRepository;
    @Autowired
    UniqueIdGenerator uniqueIdGenerator;
    @Autowired
    EmployeeRepository employeeRepository;
    @Autowired
    EmailService emailService;
    
    @Autowired
    UserRepository userRepository;
    
    @Autowired
    RoleRepository roleRepository;
    
    @Autowired
    PasswordEncoder passwordEncoder;
    
    @Autowired
    CustomerRepository customerRepository;
    
    @Autowired
    CityRepository cityRepository;


    @Override
    public String registerCustomer(String token, @Valid CustomerRegisterRequest registerDto)  {
        logger.info("Starting customer registration for username: {}", registerDto.getUsername());
        User agentUser = null;

        if (!token.isEmpty()) {
            String username = jwtTokenProvider.getUsername(token);
            Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
            if (oUser.isPresent()) {
                agentUser = oUser.get();
            }
        }

        if (userRepository.existsByUsername(registerDto.getUsername())) {
            throw new ApiException("Username already exists!" + registerDto.getUsername());
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            throw new ApiException("Email already exists!" + registerDto.getEmail());
        }

        User user = new User();
        user.setUserId(uniqueIdGenerator.generateUniqueId(User.class));
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        Optional<Role> oRole = roleRepository.findByName("ROLE_CUSTOMER");
        if (oRole.isEmpty()) {
            throw new ResourceNotFoundException("Role not found for ROLE_CUSTOMER");
        }
        user.setRole(oRole.get());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Customer customer = new Customer();
        customer.setCustomerId(uniqueIdGenerator.generateUniqueId(Customer.class));
        customer.setName(registerDto.getName());
        customer.setBankAccountDetails(registerDto.getBankAccountDetails());
        customer.setAddress(registerDto.getAddress());

        if (agentUser != null) {
            Agent agent = agentRepository.findByUser(agentUser);
            if (agent != null && agent.getUser().isActive()) {
                customer.setAgent(agent);
            }
        }

        City city = cityRepository.findById(registerDto.getCityId())
                .orElseThrow(() -> new ResourceNotFoundException("City not found"));
        customer.setCity(city);
        customer.setPhoneNumber(registerDto.getPhoneNumber());

        LocalDate dob = LocalDate.parse(registerDto.getDob(), DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        customer.setDob(dob);

        userRepository.save(user);
        customer.setUser(user);
        customerRepository.save(customer);

        String subject = "SecureLife Insurance - Your Account Has Been Created!";
        String emailBody = "Dear " + customer.getUser().getUsername() + ",\n\n" +
                "Your account with SecureLife Insurance has been created, but it is not yet approved. " +
                "Please upload the required documents for verification to complete the process.\n\n" +
                "Once your documents are verified, you'll be able to explore and choose the best insurance policies to safeguard your future.\n\n" +
                "Best Regards,\nSecureLife Insurance Team";

        try {
            emailService.sendEmail(user.getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
        }

        logger.info("Customer registered successfully with ID: {}", customer.getCustomerId());
        return "Customer created successfully!";
    }


    @Override
    public PagedResponse<CustomerResponse> getAllCustomers(int page, int size, String sortBy, String direction, String searchQuery) {
        logger.info("Fetching all customers with pagination - page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        Page<Customer> page1 = customerRepository.findAllWithSearchQuery(searchQuery,pageable);
        List<Customer> customers = page1.getContent();
        List<CustomerResponse> customerResponses = new ArrayList<>();
        for (Customer customer : customers) {
            CustomerResponse customerResponse = mappers.customerToCustomerResponse(customer);
            customerResponses.add(customerResponse);
        }

        logger.info("Fetched {} customers", customerResponses.size());
        return new PagedResponse<>(customerResponses, page1.getNumber(), page1.getSize(), page1.getTotalElements(), page1.getTotalPages(), page1.isLast());
    }

    public String updateCustomer(String id, @Valid CustomerRegisterRequest registerDto) {
        logger.info("Updating customer with ID: {}", id);

        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        User user = existingCustomer.getUser();

        if (registerDto.getUsername() != null && !registerDto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(registerDto.getUsername())) {
                throw new ApiException("Username already exists!" + registerDto.getUsername());
            }
            user.setUsername(registerDto.getUsername());
        }

        if (registerDto.getEmail() != null && !registerDto.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(registerDto.getEmail())) {
                logger.warn("Email already exists: {}", registerDto.getEmail());
                throw new ApiException("Email already exists!");
            }
            user.setEmail(registerDto.getEmail());
        }

        if (registerDto.getPassword() != null && !registerDto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        }

        user.setUpdatedAt(LocalDateTime.now());
        String subject = "Your Account update completed  Successfully ";
        String emailBody = "Dear " + registerDto.getUsername() + ", your account has been successfully opened. Before choosing a policy, please wait for the verification email.";
        try {
        	emailService.sendEmail(user.getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
        } finally {
            logger.info("Customer updated successfully");
        }
        userRepository.save(user);

        if (registerDto.getAddress() != null) {
            existingCustomer.setAddress(registerDto.getAddress());
        }

        if (registerDto.getName() != null) {
            existingCustomer.setName(registerDto.getName());
        }

        if (registerDto.getBankAccountDetails() != null) {
            existingCustomer.setBankAccountDetails(registerDto.getBankAccountDetails());
        }

        if (registerDto.getPhoneNumber() != null) {
            existingCustomer.setPhoneNumber(registerDto.getPhoneNumber());
        }

        if (registerDto.getDob() != null) {
            String dateStr = registerDto.getDob();
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            LocalDate date = LocalDate.parse(dateStr, formatter);
            existingCustomer.setDob(date);
        }

        if (registerDto.getCityId() != null) {
            City city = cityRepository.findById(registerDto.getCityId())
                    .orElseThrow(() -> new ResourceNotFoundException("City not found"));
            existingCustomer.setCity(city);
        }

        customerRepository.save(existingCustomer);
        logger.info("Customer updated successfully with ID: {}", id);
        return "Customer updated successfully!";
    }

    @Override
    public String deactivateCustomer(String id) {
        logger.info("Deactivating customer with ID: {}", id);

        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        User user = existingCustomer.getUser();

        if (user.isActive()) {
            user.setActive(false);
            userRepository.save(user);
            logger.info("Customer deactivated successfully with ID: {}", id);
            return "Customer deactivated successfully!";
        } else {
            logger.warn("Customer is already deactivated with ID: {}", id);
            return "Customer is already deactivated.";
        }
    }

    @Override
    public String activateCustomer(String id) {
        logger.info("Activating customer with ID: {}", id);

        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        User user = existingCustomer.getUser();

        if (!user.isActive()) {
            user.setActive(true);
            userRepository.save(user);
            logger.info("Customer activated successfully with ID: {}", id);
            return "Customer activated successfully!";
        } else {
            logger.warn("Customer is already active with ID: {}", id);
            return "Customer is already active.";
        }
    }
    
    @Override
    public String verifyCustomerapprove(String token, String id) {
        logger.info("Verifying customer approval for customer ID: {}", id);

        String username = jwtTokenProvider.getUsername(token);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }
        User user = oUser.get();

        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new ApiException("Employee not found"));

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ApiException("Customer not found"));

        customer.setStatus(CreationStatus.APPROVED);
        customer.setVerifiedBy(employee);

        customerRepository.save(customer);
        String subject = "SecureLife Insurance - Your Account Has Been Approved!";
        String emailBody = "Dear " + customer.getUser().getUsername() + ",\n\n" +
                           "Congratulations! Your account with SecureLife Insurance has been approved. " +
                           "You are now ready to explore and choose the best insurance policies to safeguard your future.\n\n" +
                           "If you need assistance, please feel free to reach out to our customer support team.\n\n" +
                           "Thank you for choosing SecureLife Insurance.\n\n" +
                           "Best Regards,\n" +
                           "SecureLife Insurance Team";
        try {
            emailService.sendEmail(customer.getUser().getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
        } 
        logger.info("Customer approved successfully with ID: {}", id);
        return "Customer approved Successfully";
    }

    @Override
    public String verifyCustomerReject(String token, String id) {
        logger.info("Verifying customer rejection for customer ID: {}", id);

        String username = jwtTokenProvider.getUsername(token);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }
        User user = oUser.get();

        Employee employee = employeeRepository.findByUser(user)
                .orElseThrow(() -> new ApiException("Employee not found"));

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ApiException("Customer not found"));

        customer.setStatus(CreationStatus.REJECTED);
        customer.setVerifiedBy(employee);
       
        customerRepository.save(customer);
        
        String subject = "SecureLife Insurance - Account Verification Rejected";
        String emailBody = "Dear " + customer.getUser().getUsername() + ",\n\n" +
                           "We regret to inform you that your account verification with SecureLife Insurance has been rejected. " +
                           "Please review your details and submit the necessary corrections.\n\n" +
                           "If you have any questions, feel free to contact our customer support team for assistance.\n\n" +
                           "Thank you for your interest in SecureLife Insurance.\n\n" +
                           "Best Regards,\n" +
                           "SecureLife Insurance Team";


        try {
            emailService.sendEmail(customer.getUser().getEmail(), subject, emailBody);
        } catch (MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
        }       
        logger.info("Customer rejected successfully with ID: {}", id);
        return "Customer rejected!!";
    }

	@Override
	public PagedResponse<CustomerResponse> getMyCustomersForAgent(String token,int page, int size, String sortBy, String direction,
			String searchQuery) {
		
		String username = jwtTokenProvider.getUsername(token);
		Optional<User> user = userRepository.findByUsernameOrEmail(username, username);
		if(user.isEmpty()) {
			throw new UnauthorizedException("Unauthorized access");
		}
		Agent agent = agentRepository.findByUser(user.get());
		if(agent == null) {
			throw new UnauthorizedException("Unauthorized access");
		}
		logger.info("Fetching all customers with pagination - page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        Page<Customer> page1 = customerRepository.findByAgentWithSearchQuery(agent,searchQuery,pageable);
        List<Customer> customers = page1.getContent();
        List<CustomerResponse> customerResponses = new ArrayList<>();
        for (Customer customer : customers) {
            CustomerResponse customerResponse = mappers.customerToCustomerResponse(customer);
            customerResponses.add(customerResponse);
        }

        logger.info("Fetched {} customers", customerResponses.size());
        return new PagedResponse<>(customerResponses, page1.getNumber(), page1.getSize(), page1.getTotalElements(), page1.getTotalPages(), page1.isLast());
	}
    
	@Override
	  public CustomerResponseForUpdate getCustomerbyId(String customer_id) {
	     Optional<Customer> customerOpt = customerRepository.findById(customer_id);
	          if (customerOpt.isEmpty()) {
	              throw new ResourceNotFoundException("customer not found with ID: " + customer_id);
	          }
	          Customer customer = customerOpt.get();
	          return mappers.customerToCustomerResponseForUpdate(customer);
	 }
}




