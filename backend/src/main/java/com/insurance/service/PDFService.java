package com.insurance.service;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.insurance.entities.Admin;
import com.insurance.entities.Agent;
import com.insurance.entities.Customer;
import com.insurance.entities.Employee;
import com.insurance.entities.Policy;
import com.insurance.entities.Transaction;
import com.insurance.entities.User;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IPDFService;
import com.insurance.repository.AdminRepository;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.PolicyRepository;
import com.insurance.repository.TransactionRepository;
import com.insurance.repository.UserRepository;
import com.insurance.response.AgentResponse;
import com.insurance.response.CommissionResponse;
import com.insurance.response.CustomerResponse;
import com.insurance.response.ReceiptData;
import com.insurance.response.TransactionResponse;
import com.insurance.util.Mappers;
import com.insurance.util.PdfGenerator;
import com.itextpdf.text.DocumentException;


@Service
public class PDFService implements IPDFService{

	
	@Value("${file.report-dir}")
    private String REPORT_DIR;
	
	@Value("${file.upload-dir}")
	private String UPLOAD_DIR;
	
	
	private static final Logger logger = LoggerFactory.getLogger(QueryService.class);

	@Autowired
	UserRepository userRepository;
	
	@Autowired
	EmployeeRepository employeeRepository;
	
	@Autowired
	AgentRepository agentRepository;
	
	@Autowired
	CustomerRepository customerRepository;
	
	@Autowired
	AdminRepository adminRepository;
	
	@Autowired
	TransactionRepository transactionRepository;
	
	@Autowired
	PolicyRepository policyRepository;
	
	@Autowired
	Mappers mappers;
	
	@Autowired
	PdfGenerator pdfGenerator;
	
	
	@Override
	public ResponseEntity<Resource> customerReport(String username) throws DocumentException {
		Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            logger.warn("User not available for username: ", username);
            throw new ResourceNotFoundException("User is not available");
        }
        User user = oUser.get();	    
        String role = user.getRole().getName();
	    if(role.equalsIgnoreCase("ROLE_ADMIN")) {
		    Admin admin = adminRepository.findByUser(user);
	        logger.info("Admin: "+ admin.getAdminId() + "is trying to get customer report");

	    }
	    else if(role.equalsIgnoreCase("ROLE_EMPLOYEE")) {
		    Optional<Employee> employee = employeeRepository.findByUser(user);
	        logger.info("Employee: "+ employee.get().getEmployeeId() + "is trying to get customer report");

	    }
	    
	    List<Customer> customers = customerRepository.findAll();
	    List<CustomerResponse> customerResponses = new ArrayList<>();
	    for (Customer customer : customers) {
	        CustomerResponse customerResponse = mappers.customerToCustomerResponse(customer);
	        customerResponses.add(customerResponse);
	    }

	    String projectRoot = System.getProperty("user.dir");
	    String filePath = projectRoot + File.separator + REPORT_DIR;
	    
	    List<String> headers = Arrays.asList("Customer ID", "Name", "Username", "Email", "Active", "Status");

	    List<List<String>> data = new ArrayList<>();
	    for (CustomerResponse customer : customerResponses) {
	        List<String> row = new ArrayList<>();
	        row.add(customer.getCustomerId());
	        row.add(customer.getName());
	        row.add(customer.getUsername());
	        row.add(customer.getEmail());
	        row.add(String.valueOf(customer.isActive()));
	        row.add(customer.getStatus());
	        data.add(row);
	    }

	    String pdfFilePath;
		
		pdfFilePath = pdfGenerator.generatePdf("Customer Report", headers, data, filePath, "CustomerReport");

	    File file = new File(pdfFilePath);
	    if (file.exists()) {
	        Resource resource = new FileSystemResource(file);
	        return ResponseEntity.ok()
	                .contentType(MediaType.APPLICATION_PDF)
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
	                .body(resource);
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(null);
	    }
	}

	
	
	@Override
	public ResponseEntity<Resource> agentReport(String username) throws DocumentException {
		Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            logger.warn("User not available for username: ", username);
            throw new ResourceNotFoundException("User is not available");
        }
        User user = oUser.get();	    
        String role = user.getRole().getName();
	    if(role.equalsIgnoreCase("ROLE_ADMIN")) {
		    Admin admin = adminRepository.findByUser(user);
	        logger.info("Admin: "+ admin.getAdminId() + "is trying to get agent report");

	    }
	    else if(role.equalsIgnoreCase("ROLE_EMPLOYEE")) {
		    Optional<Employee> employee = employeeRepository.findByUser(user);
	        logger.info("Employee: "+ employee.get().getEmployeeId() + "is trying to get agent report");

	    }
	    List<Agent> agents = agentRepository.findAll();
	    List<AgentResponse> agentResponses = new ArrayList<>();
	    for (Agent agent : agents) {
	        AgentResponse agentResponse = mappers.agentToAgentResponse(agent);
	        agentResponses.add(agentResponse);
	    }

	    String projectRoot = System.getProperty("user.dir");
	    String filePath = projectRoot + File.separator + REPORT_DIR;

	    List<String> headers = Arrays.asList("Agent ID", "Name", "Username", "Email", "Active");

	    List<List<String>> data = new ArrayList<>();
	    for (AgentResponse agent : agentResponses) {
	        List<String> row = new ArrayList<>();
	        row.add(agent.getAgentId());
	        row.add(agent.getName());
	        row.add(agent.getUsername());
	        row.add(agent.getEmail());
	        row.add(String.valueOf(agent.isActive()));
	        data.add(row);
	    }

	    String pdfFilePath = pdfGenerator.generatePdf("Agent Report", headers, data, filePath, "AgentReport");

	    File file = new File(pdfFilePath);
	    if (file.exists()) {
	        Resource resource = new FileSystemResource(file);
	        return ResponseEntity.ok()
	                .contentType(MediaType.APPLICATION_PDF)
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
	                .body(resource);
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
	    }
	}
	
	@Override
	public ResponseEntity<Resource> transactionReport(String username) throws DocumentException {
		Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            logger.warn("User not available for username: ", username);
            throw new ResourceNotFoundException("User is not available");
        }
        User user = oUser.get();	    
        String role = user.getRole().getName();
	    if(role.equalsIgnoreCase("ROLE_ADMIN")) {
		    Admin admin = adminRepository.findByUser(user);
	        logger.info("Admin: "+ admin.getAdminId() + "is trying to get transaction report");

	    }
	    else if(role.equalsIgnoreCase("ROLE_EMPLOYEE")) {
		    Optional<Employee> employee = employeeRepository.findByUser(user);
	        logger.info("Employee: "+ employee.get().getEmployeeId() + "is trying to get transaction report");

	    }
	    List<Transaction> transactions = transactionRepository.findAll();
	    List<TransactionResponse> transactionResponses = new ArrayList<>();
	    for (Transaction transaction : transactions) {
	        TransactionResponse transactionResponse = mappers.transactionToTransactionResponse(transaction);
	        transactionResponses.add(transactionResponse);
	    }

	    String projectRoot = System.getProperty("user.dir");
	    String filePath = projectRoot + File.separator + REPORT_DIR;
	    
	    List<String> headers = Arrays.asList("Transaction ID", "Policy ID", "Transaction Type", "Amount", "Date", "Status");

	    List<List<String>> data = new ArrayList<>();
	    for (TransactionResponse transaction : transactionResponses) {
	        List<String> row = new ArrayList<>();
	        row.add(transaction.getTransactionId());
	        row.add(transaction.getPolicyId());
	        row.add(transaction.getTransactionType());
	        row.add(String.valueOf(transaction.getAmount()));
	        row.add(transaction.getDate().toString());
	        row.add(transaction.getStatus());
	        data.add(row);
	    }

	    String pdfFilePath = pdfGenerator.generatePdf("Transaction Report", headers, data, filePath, "TransactionReport");

	    File file = new File(pdfFilePath);
	    if (file.exists()) {
	        Resource resource = new FileSystemResource(file);
	        return ResponseEntity.ok()
	                .contentType(MediaType.APPLICATION_PDF)
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
	                .body(resource);
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(null);
	    }
	}

	
	@Override
	public ResponseEntity<Resource> policyReport(String customerId, String username) throws DocumentException {
		Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            logger.warn("User not available for username: ", username);
            throw new ResourceNotFoundException("User is not available");
        }
        User user = oUser.get();	    
        String role = user.getRole().getName();
	    if(role.equalsIgnoreCase("ROLE_ADMIN")) {
		    Admin admin = adminRepository.findByUser(user);
	        logger.info("Admin: "+ admin.getAdminId() + "is trying to get customer's policy report");

	    }
	    else if(role.equalsIgnoreCase("ROLE_EMPLOYEE")) {
		    Optional<Employee> employee = employeeRepository.findByUser(user);
	        logger.info("Employee: "+ employee.get().getEmployeeId() + "is trying to get customer's policy report");

	    }
	    Customer customer = customerRepository.findById(customerId).orElse(null);
	    if(customer == null) {
	    	throw new ResourceNotFoundException("Customer not found");
	    }
	    List<Policy> policies = policyRepository.findByCustomer(customer);
	   

	    String projectRoot = System.getProperty("user.dir");
	    String filePath = projectRoot + File.separator + REPORT_DIR;
	    
	    List<String> headers = Arrays.asList("Policy ID", "Plan ID", "Start Date", "End Date", "Policy Term", "Total Investment Amount", "Payment Interval", "Installment Amount", "Total Amount Paid", "Next Payment Date");

	    List<List<String>> data = new ArrayList<>();
	    for (Policy policy : policies) {
	        List<String> row = new ArrayList<>();
	        row.add(policy.getPolicyId());
	        row.add(policy.getStartDate().toString());
	        row.add(policy.getEndDate().toString());
	        row.add(String.valueOf(policy.getTotalInvestmentAmount()));
	        row.add(policy.getPaymentInterval().toString()); 
	        row.add(policy.getNextPaymentDate().toString());
	        data.add(row);
	    }


	    String pdfFilePath = pdfGenerator.generatePdf("Policy Report", headers, data, filePath, "PolicyReport");

	    File file = new File(pdfFilePath);
	    if (file.exists()) {
	        Resource resource = new FileSystemResource(file);
	        return ResponseEntity.ok()
	                .contentType(MediaType.APPLICATION_PDF)
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
	                .body(resource);
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(null);
	    }
	}

	
	@Override
	public ResponseEntity<Resource> commissionReport(String agentId, String username) throws DocumentException {
		Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            logger.warn("User not available for username: ", username);
            throw new ResourceNotFoundException("User is not available");
        }
        User user = oUser.get();	    
        String role = user.getRole().getName();
	    if(role.equalsIgnoreCase("ROLE_ADMIN")) {
		    Admin admin = adminRepository.findByUser(user);
	        logger.info("Admin: "+ admin.getAdminId() + "is trying to get agent's commission report");

	    }
	    else if(role.equalsIgnoreCase("ROLE_EMPLOYEE")) {
		    Optional<Employee> employee = employeeRepository.findByUser(user);
	        logger.info("Employee: "+ employee.get().getEmployeeId() + "is trying to get agent's commission report");

	    }
	    Agent agent = agentRepository.findById(agentId).orElse(null);
	    if (agent == null) {
	        throw new ResourceNotFoundException("Agent not found");
	    }
	    List<Policy> policies = policyRepository.findByAgent(agent);
	    List<CommissionResponse> commissionResponses = new ArrayList<>();
	    for (Policy policy : policies) {
	        CommissionResponse commissionResponse = mappers.convertToCommissionResponse(policy);
	        commissionResponses.add(commissionResponse);
	    }

	    String projectRoot = System.getProperty("user.dir");
	    String filePath = projectRoot + File.separator + REPORT_DIR;
	    
	    List<String> headers = Arrays.asList("Policy ID", "Plan ID", "Start Date", "End Date", "Policy Term", "Total Investment Amount", "Payment Interval", "Commission");

	    List<List<String>> data = new ArrayList<>();
	    for (CommissionResponse commission : commissionResponses) {
	        List<String> row = new ArrayList<>();
	        row.add(commission.getPolicyId());
	        row.add(commission.getPlan_id());
	        row.add(commission.getStartDate().toString());
	        row.add(commission.getEndDate().toString());
	        row.add(String.valueOf(commission.getPolicyTerm()));
	        row.add(String.valueOf(commission.getTotalInvestmentAmount()));
	        row.add(commission.getPaymentInterval().toString());
	        row.add(String.valueOf(commission.getCommission()));
	        data.add(row);
	    }

	    String pdfFilePath = pdfGenerator.generatePdf("Commission Report", headers, data, filePath, "CommissionReport");

	    File file = new File(pdfFilePath);
	    if (file.exists()) {
	        Resource resource = new FileSystemResource(file);
	        return ResponseEntity.ok()
	                .contentType(MediaType.APPLICATION_PDF)
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
	                .body(resource);
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(null);
	    }
	}
	
	@Override
	public ResponseEntity<Resource> downloadReceipt(String transactionId, String username) throws DocumentException {
		PdfGenerator pdfGenerator = new PdfGenerator();
		ReceiptData receiptData = new ReceiptData();
		Optional<Transaction> transaction = transactionRepository.findById(transactionId);
		if(transaction.isEmpty()) {
			throw new ResourceNotFoundException("No transaction there");
		}
		
		receiptData.setCustomerId(transaction.get().getPolicy().getCustomer().getCustomerId());
		receiptData.setAmount(transaction.get().getAmount());
		receiptData.setCustomerName(transaction.get().getPolicy().getCustomer().getName());
		receiptData.setDate(transaction.get().getDate().toString());
		receiptData.setDescription(transaction.get().getPolicy().getPolicyId() + " " + transaction.get().getPolicy().getPlan().getInsuranceScheme().getName());
		receiptData.setTransactionId(transactionId);
		String pdfFile = new String();
		try {
			pdfFile = pdfGenerator.generateReceiptPdf(UPLOAD_DIR, "Receipt" + transactionId, receiptData);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
		
		File file = new File(pdfFile);
	    if (file.exists()) {
	        Resource resource = new FileSystemResource(file);
	        return ResponseEntity.ok()
	                .contentType(MediaType.APPLICATION_PDF)
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
	                .body(resource);
	    } else {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                .body(null);
	    }
	}

	
	



	
	
}
