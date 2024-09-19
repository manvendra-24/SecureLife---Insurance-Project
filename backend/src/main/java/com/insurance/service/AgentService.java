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
import com.insurance.entities.Agent;
import com.insurance.entities.City;
import com.insurance.entities.Employee;
import com.insurance.entities.Role;
import com.insurance.entities.User;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.IAgentService;
import com.insurance.repository.AdminRepository;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.CityRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.RoleRepository;
import com.insurance.repository.UserRepository;
import com.insurance.request.AgentRegisterRequest;
import com.insurance.response.AgentResponse;
import com.insurance.security.JwtTokenProvider;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;
import com.insurance.util.UniqueIdGenerator;

@Service
public class AgentService implements IAgentService {
	private static final Logger logger = LoggerFactory.getLogger(AgentService.class);

	@Autowired
	Mappers mappers;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	@Autowired
	JwtTokenProvider jwtTokenProvider;
	
	@Autowired
	RoleRepository roleRepository;
	
	@Autowired
	AdminRepository adminRepository;
	
	@Autowired
	UserRepository userRepository;

	@Autowired
	CustomerRepository customerRepository;
	
	@Autowired
	AgentRepository agentRepository;
	
	@Autowired
	EmployeeRepository employeeRepository;
	
	@Autowired
	CityRepository cityRepository;
	
	@Autowired
	UniqueIdGenerator uniqueIdGenerator;
	@Autowired
	EmailService emailService;
	
		@Override
		public String registerAgent(String token, AgentRegisterRequest registerDto) {
			String username = jwtTokenProvider.getUsername(token);
			Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
			if(oUser.isEmpty()) {
				throw new UnauthorizedException("User is not available");
			}
			User user2 = oUser.get();
			
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
	        Optional<Role> oRole = roleRepository.findByName("ROLE_AGENT");
	        if(oRole.isEmpty()) {
	        	throw new ResourceNotFoundException("Role not found : ROLE_AGENT");
	        }
	        user.setRole(oRole.get());
	        user.setActive(true);
	        user.setCreatedAt(LocalDateTime.now());
	        user.setUpdatedAt(LocalDateTime.now());
	        

	        Agent agent = new Agent();
	        logger.info("Registration of agent");
	        agent.setAgentId(uniqueIdGenerator.generateUniqueId(Agent.class));
	        agent.setName(registerDto.getName());
	        agent.setPhoneNumber(registerDto.getPhoneNumber());
	        agent.setAddress(registerDto.getAddress());
	        Optional<City> oCity = cityRepository.findById(registerDto.getCity_id());
	        if(oCity.isEmpty()) {
	        	throw new ApiException("City is not available");
	        }
	        City city = oCity.get();
	        agent.setCity(city);
	        if(user2.getRole().getName().equalsIgnoreCase("ROLE_ADMIN")) {
	        	Admin admin = adminRepository.findByUser(user2);
				agent.setCreatedBy("Admin: "+ admin.getAdminId());
	        }
	        if(user2.getRole().getName().equalsIgnoreCase("ROLE_EMPLOYEE")) {
	        	Optional<Employee> employee = employeeRepository.findByUser(user2);
				agent.setCreatedBy("Employee: "+ employee.get().getEmployeeId());
	        }
	        userRepository.save(user);
	        agent.setUser(user);
	        agentRepository.save(agent);
	        String subject = "Welcome to SecureLife Insurance - Your Agent Account Has Been Created!";
	        String emailBody = "Dear " + registerDto.getName() + ",\n\n" +
	                           "Congratulations! Your agent account has been successfully created at SecureLife Insurance. " +
	                           "You are now part of our trusted network, helping clients secure their futures with our policies.\n\n" +
	                           "Best Regards,\n" +
	                           "SecureLife Insurance Team";
	        
	        
	        try {
	            emailService.sendEmail(user.getEmail(), subject, emailBody);
	        } catch (MailAuthenticationException exc) {
	            logger.error("Failed to send email to {}: {}", user.getEmail(), exc.getMessage());
	        } finally {
	            logger.info("Agent registered successfully with username: {}", registerDto.getUsername());
	        }
	        
	        return "Agent created successfully!";
		}
		
		@Override
		public PagedResponse<AgentResponse> getAllAgents(int page, int size, String sortBy, String direction, String searchQuery) {
		    Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) 
		                ? Sort.by(sortBy).descending() 
		                : Sort.by(sortBy).ascending();
		    PageRequest pageable = PageRequest.of(page, size, sort);
		    Page<Agent> page1 = agentRepository.findAllWithSearchQuery(searchQuery, pageable);
		    List<Agent> agents = page1.getContent();
		    List<AgentResponse> agentResponses = new ArrayList<>();
		    for (Agent agent : agents) {
		        AgentResponse agentResponse = mappers.agentToAgentResponse(agent);
		        agentResponses.add(agentResponse);
		    }
		    
		    return new PagedResponse<>(agentResponses, page1.getNumber(), page1.getSize(), page1.getTotalElements(), page1.getTotalPages(), page1.isLast());
		}
		
		@Override
		public String updateAgent(String agent_id, AgentRegisterRequest agentRequest) {
		    Optional<Agent> oAgent = agentRepository.findById(agent_id);
		    if (oAgent.isEmpty()) {
		        throw new ResourceNotFoundException("Agent not found");
		    }

		    Agent agent = oAgent.get();
		    logger.info("update of agent");
		    agent.setName(agentRequest.getName());
		    agent.setAddress(agentRequest.getAddress());
		    agent.setPhoneNumber(agentRequest.getPhoneNumber());
		    User user = agent.getUser();
		    user.setEmail(agentRequest.getEmail());
		    user.setUsername(agentRequest.getUsername());
		    user.setUpdatedAt(LocalDateTime.now());
		    
		    Optional<City> oCity = cityRepository.findById(agentRequest.getCity_id());
	        if(oCity.isEmpty()) {
	        	throw new ApiException("City is not available");
	        }
	        City city = oCity.get();
	        agent.setCity(city);
	        userRepository.save(user);
		    agent.setUser(user);
		    agentRepository.save(agent);

		    return "Agent updated";
		}

		@Override
		public String deleteAgent(String agent_id) {
		    Optional<Agent> oAgent = agentRepository.findById(agent_id);
		    if (oAgent.isEmpty()) {
		        throw new ResourceNotFoundException("Agent not found");
		    }
		    Agent agent = oAgent.get();
		    User user = agent.getUser();
		    logger.info("deactivating of agent");
		    if (!user.isActive()) {
		        throw new ApiException("User is already inactive");
		    }
		    user.setActive(false);
		    userRepository.save(user);
		    agentRepository.save(agent);
		    return "Agent successfully deleted";
		}

		@Override
		public String activateAgent(String agent_id) {
		    Optional<Agent> oAgent = agentRepository.findById(agent_id);
		    if (oAgent.isEmpty()) {
		        throw new ResourceNotFoundException("Agent not found");
		    }
		    Agent agent = oAgent.get();
		    User user = agent.getUser();
		    logger.info("activating of agent");
		    if (user.isActive()) {
		        throw new ApiException("User is already active");
		    }
		    user.setActive(true);
		    userRepository.save(user);
		    agentRepository.save(agent);
		    return "Agent successfully activated";
		}
		
		   @Override
	        public AgentResponse getAgentById(String agentId) {
	            Optional<Agent> agentOpt = agentRepository.findById(agentId);
	            if (agentOpt.isEmpty()) {
	                throw new ResourceNotFoundException("Agent not found with ID: " + agentId);
	            }
	            Agent agent = agentOpt.get();
	            return mappers.agentToAgentResponse(agent);
	        }

	
	
   
}
