package com.insurance.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.insurance.entities.Claim;
import com.insurance.entities.Customer;
import com.insurance.entities.Document;
import com.insurance.entities.Employee;
import com.insurance.entities.Policy;
import com.insurance.entities.User;
import com.insurance.enums.DocumentType;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IDocumentService;
import com.insurance.repository.ClaimRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.DocumentRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.PolicyRepository;
import com.insurance.repository.UserRepository;
import com.insurance.request.ClaimRequest;
import com.insurance.response.DocumentResponse;
import com.insurance.util.UniqueIdGenerator;


@Service
public class DocumentService implements IDocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Value("${file.upload-dir}")
    private String UPLOAD_DIR;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private UniqueIdGenerator uniqueIdGenerator;
    @Autowired
    PolicyRepository policyRepository;
    @Autowired
    ClaimRepository claimRepository;

    @Override
    public String uploadFile(String documentType, MultipartFile file, String username) throws IOException {
        logger.info("Starting file upload for documentType: {} and username: {}", documentType, username);

        User user = userRepository.findByUsernameOrEmail(username, username)
                                  .orElseThrow(() -> new ResourceNotFoundException("User is not available"));
        Customer customer = customerRepository.findByUser(user);
        logger.info("Customer retrieved with ID: {}", customer.getCustomerId());

        String projectRoot = System.getProperty("user.dir");
        String uploadPath = projectRoot + File.separator + UPLOAD_DIR + customer.getCustomerId();
        File customerDir = new File(uploadPath);
        if (!customerDir.exists()) {
            customerDir.mkdirs();
            logger.info("Created directory for customer at: {}", uploadPath);
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        String newFileName = documentType + fileExtension;

        DocumentType documentTypeEnum;
        try {
            documentTypeEnum = DocumentType.valueOf(documentType.toUpperCase());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid document type: {}", documentType, e);
            throw new IllegalArgumentException("Invalid document type: " + documentType);
        }

        Document existingDocument = documentRepository.findByCustomerAndDocumentName(customer, documentTypeEnum);
        if (existingDocument != null) {
            File existingFile = new File(existingDocument.getDocumentPath());
            if (existingFile.exists() && !existingFile.delete()) {
                logger.error("Failed to delete existing file: {}", existingFile.getAbsolutePath());
                throw new IOException("Failed to delete the existing file");
            }
            documentRepository.delete(existingDocument);
            logger.info("Deleted existing document of type: {}", documentTypeEnum);
        }

        File dest = new File(customerDir, newFileName);
        file.transferTo(dest);
        logger.info("File saved at: {}", dest.getAbsolutePath());

        Document document = new Document();
        document.setDocumentId(uniqueIdGenerator.generateUniqueId(Document.class));
        document.setDocumentName(documentTypeEnum);
        document.setDocumentType(fileExtension);
        document.setUploadDate(LocalDate.now());
        document.setDocumentPath(dest.getAbsolutePath());
        document.setCustomer(customer);
        documentRepository.save(document);

        logger.info("Document uploaded successfully with ID: {}", document.getDocumentId());
        return document.getDocumentId();
    }

    @Override
    public List<DocumentResponse> getDocuments(String customer_id, String username) {
        logger.info("Fetching documents for customer ID: {} and username: {}", customer_id, username);

        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User is not available"));
		
        Employee employee = employeeRepository.findByUser(user).orElse(null);
        if (employee == null) {
            logger.error("Unauthorized access by user: {}", username);
            throw new ApiException("Unauthorized");
        }
		
        Optional<Customer> oCustomer = customerRepository.findById(customer_id);
        if (oCustomer.isEmpty()) {
            logger.error("Customer not found with ID: {}", customer_id);
            throw new ResourceNotFoundException("Customer not found");
        }
        logger.info("Customer found with ID: {}", customer_id);

        List<Document> documents = documentRepository.findByCustomer(oCustomer.get());
        List<DocumentResponse> documentResponses = new ArrayList<>();
        for (Document document : documents) {
            DocumentResponse documentResponse = new DocumentResponse();
            documentResponse.setDocumentId(document.getDocumentId());
            documentResponse.setDocumentName(document.getDocumentName());
            documentResponse.setDocumentType(document.getDocumentType());
            documentResponse.setUploadDate(document.getUploadDate());
            documentResponses.add(documentResponse);
        }
        logger.info("Fetched {} documents for customer ID: {}", documentResponses.size(), customer_id);
        return documentResponses;
    }

    @Override
    public ResponseEntity<Resource> downloadFile(String username, String document_id) {
        logger.info("Downloading file for document ID: {} and username: {}", document_id, username);

  

        Document document = documentRepository.findById(document_id)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found"));

        File file = new File(document.getDocumentPath());
        if (!file.exists()) {
            logger.error("File not found at path: {}", document.getDocumentPath());
            throw new ResourceNotFoundException("File not found on the server");
        }

        Resource resource = new FileSystemResource(file);

        String contentType = "application/octet-stream"; 
        try {
            contentType = Files.probeContentType(file.toPath());
            if (contentType == null) {
                if (document.getDocumentType().equalsIgnoreCase("pdf")) {
                    contentType = MediaType.APPLICATION_PDF_VALUE;
                } else if (document.getDocumentType().equalsIgnoreCase("jpeg") ||
                           document.getDocumentType().equalsIgnoreCase("jpg")) {
                    contentType = MediaType.IMAGE_JPEG_VALUE;
                } else if (document.getDocumentType().equalsIgnoreCase("png")) {
                    contentType = MediaType.IMAGE_PNG_VALUE;
                }
            }
            logger.info("Detected file content type: {}", contentType);
        } catch (IOException e) {
            logger.warn("Could not determine file content type, defaulting to application/octet-stream", e);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
    @Override
    public String uploadClaimFile(String documentType, MultipartFile file, ClaimRequest claimRequest,String policy_id, String username) throws IOException {
        logger.info("Starting file upload for documentType: {} and username: {}", documentType, username);

        User user = userRepository.findByUsernameOrEmail(username, username)
                                  .orElseThrow(() -> new ResourceNotFoundException("User is not available"));
        Customer customer = customerRepository.findByUser(user);
        logger.info("Customer retrieved with ID: {}", customer.getCustomerId());

        String projectRoot = System.getProperty("user.dir");
        String uploadPath = projectRoot + File.separator + UPLOAD_DIR + customer.getCustomerId();
        File customerDir = new File(uploadPath);
        if (!customerDir.exists()) {
            customerDir.mkdirs();
            logger.info("Created directory for customer at: {}", uploadPath);
        }

        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        String newFileName = documentType + fileExtension;

        DocumentType documentTypeEnum;
        try {
            documentTypeEnum = DocumentType.valueOf(documentType.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid document type: " + documentType);
        }

        Document existingDocument = documentRepository.findByCustomerAndDocumentName(customer, documentTypeEnum);
        if (existingDocument != null) {
            File existingFile = new File(existingDocument.getDocumentPath());
            if (existingFile.exists() && !existingFile.delete()) {
                throw new IOException("Failed to delete the existing file");
            }
            documentRepository.delete(existingDocument);
            logger.info("Deleted existing document of type: {}", documentTypeEnum);
        }

        File dest = new File(customerDir, newFileName);
        file.transferTo(dest);
        logger.info("File saved at: {}", dest.getAbsolutePath());

        Document document = new Document();
        document.setDocumentId(uniqueIdGenerator.generateUniqueId(Document.class));
        document.setDocumentName(documentTypeEnum);
        document.setDocumentType(fileExtension);
        document.setUploadDate(LocalDate.now());
        document.setDocumentPath(dest.getAbsolutePath());
        document.setCustomer(customer);
        documentRepository.save(document);
        
        Optional<Policy> policy = policyRepository.findById(policy_id);
        if(policy.isPresent()) {
          Claim claim = new Claim();
          List<Document> documents = new ArrayList<>();
          documents.add(document);
            claim.setDocuments(documents);
            claim.setExplanation(claimRequest.getExplanation());
            claim.setPolicy(policy.get());
            claimRepository.save(claim);
        }
        

        logger.info("Document uploaded successfully with ID: {}", document.getDocumentId());
        return newFileName;
    }
}
