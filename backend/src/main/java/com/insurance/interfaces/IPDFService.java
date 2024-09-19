package com.insurance.interfaces;

import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;

import com.itextpdf.text.DocumentException;

public interface IPDFService {

	ResponseEntity<Resource> customerReport(String username) throws DocumentException;

	ResponseEntity<Resource> agentReport(String username) throws DocumentException;

	ResponseEntity<Resource> transactionReport(String username) throws DocumentException;

	ResponseEntity<Resource> policyReport(String customerId, String username) throws DocumentException;

	ResponseEntity<Resource> commissionReport(String agentId, String username) throws DocumentException;

	ResponseEntity<Resource> downloadReceipt(String transactionId, String username) throws DocumentException;

}
