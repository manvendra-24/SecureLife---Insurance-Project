package com.insurance.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.insurance.exceptions.ApiException;
import com.insurance.interfaces.IDocumentService;
import com.insurance.request.ClaimRequest;
import com.insurance.response.DocumentResponse;
import com.insurance.security.JwtTokenProvider;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/SecureLife.com")
public class DocumentController {

    @Autowired
    private IDocumentService service;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("document/upload")
    @Operation(summary= "Upload document -- BY CUSTOMER")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<String> uploadFile(HttpServletRequest request, @RequestParam("type") String documentType, @RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Please select a file to upload", HttpStatus.BAD_REQUEST);
        }

        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username = jwtTokenProvider.getUsername(token);
            try {
                String newFileName = service.uploadFile(documentType, file, username);
                return new ResponseEntity<>( newFileName, HttpStatus.OK);
            } catch (IOException e) {
                return new ResponseEntity<>("File upload failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            } catch (IllegalArgumentException e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
        throw new ApiException("User is unauthorized");
    }
    @PostMapping("policies/{policy_id}/claim/upload")
    @Operation(summary= "Upload Claim document -- BY CUSTOMER")
    public ResponseEntity<String> uploadClaimDocument(HttpServletRequest request,@PathVariable String policy_id, @RequestParam("file") MultipartFile file, ClaimRequest claimRequest) throws IOException {
        if (file.isEmpty()) {
            return new ResponseEntity<>("Please select a file to upload", HttpStatus.BAD_REQUEST);
        }

        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username = jwtTokenProvider.getUsername(token);
            try {
              String documentType = "CLAIM_DOCUMENT";
                String newFileName = service.uploadClaimFile(documentType, file,claimRequest,policy_id, username);
                return new ResponseEntity<>("File uploaded successfully: " + newFileName, HttpStatus.OK);
            } catch (IOException e) {
                return new ResponseEntity<>("File upload failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            } catch (IllegalArgumentException e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            }
        }
        throw new ApiException("User is unauthorized");
    }
    
    @GetMapping("/customer/{customer_id}/documents")
    @Operation(summary= "Get Document of a customer -- BY EMPLOYEE & ADMIN")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<List<DocumentResponse>> getDocuments(HttpServletRequest request, @PathVariable String customer_id) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username = jwtTokenProvider.getUsername(token);
            List<DocumentResponse> documents = service.getDocuments(customer_id, username);
            return new ResponseEntity<>(documents, HttpStatus.OK);
        }
        throw new ApiException("User is unauthorized");
    }
    

    @GetMapping("/document/{document_id}/download")
    @Operation(summary = "Download document -- BY EMPLOYEE & ADMIN")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadFile(HttpServletRequest request, @PathVariable String document_id) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username = jwtTokenProvider.getUsername(token);
            return service.downloadFile(username, document_id);
        }
        throw new ApiException("User is unauthorized");
    }


    
    
}
