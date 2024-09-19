package com.insurance.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.entities.Claim;
import com.insurance.entities.Customer;
import com.insurance.entities.Document;
import com.insurance.enums.DocumentType;

public interface DocumentRepository extends JpaRepository<Document, String>{

	Document findByCustomerAndDocumentName(Customer customer, DocumentType documentTypeEnum);

	List<Document> findByCustomer(Customer customer);

	List<Document> findByClaim(Claim claim);

}
