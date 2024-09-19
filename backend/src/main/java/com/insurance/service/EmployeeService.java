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

import com.insurance.entities.Employee;
import com.insurance.entities.Role;
import com.insurance.entities.User;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IEmployeeService;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.RoleRepository;
import com.insurance.repository.UserRepository;
import com.insurance.request.EmployeeRegisterRequest;
import com.insurance.response.EmployeeResponse;
import com.insurance.security.JwtTokenProvider;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;
import com.insurance.util.UniqueIdGenerator;

@Service
public class EmployeeService implements IEmployeeService {

    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);

    @Autowired
    Mappers mappers;

    
    @Autowired
    EmailService emailService;
    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    CustomerRepository customerRepository;

    @Autowired
    EmployeeRepository employeeRepository;

    @Autowired
    UniqueIdGenerator uniqueIdGenerator;

    @Override
    public String registerEmployee(EmployeeRegisterRequest registerDto) {
        logger.info("Registering new employee with username: {}", registerDto.getUsername());

        if (userRepository.existsByUsername(registerDto.getUsername())) {
            logger.warn("Username already exists: {}", registerDto.getUsername());
            throw new ApiException("Username already exists!");
        }

        if (userRepository.existsByEmail(registerDto.getEmail())) {
            logger.warn("Email already exists: {}", registerDto.getEmail());
            throw new ApiException("Email already exists!");
        }

        User user = new User();
        user.setUserId(uniqueIdGenerator.generateUniqueId(User.class));
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        Optional<Role> oRole = roleRepository.findByName("Role_Employee");
        if (oRole.isEmpty()) {
            logger.error("Role not found for Role_Employee");
            throw new ResourceNotFoundException("Role not found");
        }
        user.setRole(oRole.get());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        Employee employee = new Employee();
        employee.setEmployeeId(uniqueIdGenerator.generateUniqueId(Employee.class));
        employee.setName(registerDto.getName());
        employee.setPhoneNumber(registerDto.getPhoneNumber());
        employee.setAddress(registerDto.getAddress());
        userRepository.save(user);
        employee.setUser(user);
        employeeRepository.save(employee);
        String subject = "Welcome to SecureLife Insurance - Your Employee Account Has Been Created!";
        String emailBody = "Dear " + registerDto.getName() + ",\n\n" +
                           "Congratulations! Your employee account has been successfully created at SecureLife Insurance. " +
                           "You are now part of a dedicated team that strives to provide exceptional service to our customers.\n\n" +
                           "Best Regards,\n" +
                           "SecureLife Insurance Team";
        try {
            emailService.sendEmail(user.getEmail(), subject, emailBody);
        } catch(MailAuthenticationException exc) {
            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
        } 

        logger.info("Employee created successfully with ID: {}", employee.getEmployeeId());
        return "Employee created successfully!";
    }

    @Override
    public String updateEmployee(String employee_id, EmployeeRegisterRequest employeeRequest) {
        logger.info("Updating employee with ID: {}", employee_id);

        Optional<Employee> oEmployee = employeeRepository.findById(employee_id);
        if (oEmployee.isEmpty()) {
            throw new ResourceNotFoundException("Employee not found with employee id: " + employee_id);
        }

        Employee employee = oEmployee.get();
        employee.setName(employeeRequest.getName());
        employee.setAddress(employeeRequest.getAddress());
        employee.setPhoneNumber(employeeRequest.getPhoneNumber());
        User user = employee.getUser();
        user.setEmail(employeeRequest.getEmail());
        user.setUsername(employeeRequest.getUsername());
        user.setPassword(passwordEncoder.encode(employeeRequest.getPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        employee.setUser(user);
        employeeRepository.save(employee);

        logger.info("Employee updated successfully with ID: {}", employee_id);
        return "Employee updated";
    }

    @Override
    public PagedResponse<EmployeeResponse> getAllEmployees(int page, int size, String sortBy, String direction, String searchQuery) {
        logger.info("Fetching all employees with pagination - page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())
                ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);
        Page<Employee> page1 = employeeRepository.findAllWithSearchQuery(searchQuery, pageable);
        List<Employee> employees = page1.getContent();
        List<EmployeeResponse> employeeResponses = new ArrayList<>();
        for (Employee employee : employees) {
            EmployeeResponse employeeResponse = mappers.employeeToEmployeeResponse(employee);
            employeeResponses.add(employeeResponse);
        }

        logger.info("Fetched {} employees", employeeResponses.size());
        return new PagedResponse<>(employeeResponses, page1.getNumber(), page1.getSize(), page1.getTotalElements(), page1.getTotalPages(), page1.isLast());
    }

    @Override
    public String deleteEmployee(String employee_id) {
        logger.info("Deleting employee with ID: {}", employee_id);

        Optional<Employee> oEmployee = employeeRepository.findById(employee_id);
        if (oEmployee.isEmpty()) {
            throw new ResourceNotFoundException("Employee not found with employeeId: "+employee_id);
        }
        Employee employee = oEmployee.get();
        User user = employee.getUser();
        if (!user.isActive()) {
            throw new ApiException("User is already inactive ");
        }
        user.setActive(false);
        userRepository.save(user);
        employeeRepository.save(employee);

        logger.info("Employee deactivated successfully with ID: {}", employee_id);
        return "Employee deleted successfully";
    }

    @Override
    public String activateEmployee(String employee_id) {
        logger.info("Activating employee with ID: {}", employee_id);

        Optional<Employee> oEmployee = employeeRepository.findById(employee_id);
        if (oEmployee.isEmpty()) {
            throw new ResourceNotFoundException("Employee not found");
        }
        Employee employee = oEmployee.get();
        User user = employee.getUser();
        if (user.isActive()) {
            throw new ApiException("User is already active");
        }
        user.setActive(true);
        userRepository.save(user);
        employeeRepository.save(employee);

        logger.info("Employee activated successfully with ID: {}", employee_id);
        return "Employee successfully activated";
    }

    @Override
    public EmployeeResponse getEmployeeById(String employee_id) {
        logger.info("Fetching employee with id: {}", employee_id);
        Optional<Employee> employee = employeeRepository.findById(employee_id);
        if (employee.isEmpty()) {
            throw new ResourceNotFoundException("Employee not found with id: " + employee_id);
        }
        EmployeeResponse employeeResponse = mappers.employeeToEmployeeResponse(employee.get());
        logger.info("Successfully fetched employee with id: {}", employee_id);

        return employeeResponse;
    }

   

	
}
