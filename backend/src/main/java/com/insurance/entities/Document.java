package com.insurance.entities;

import java.time.LocalDate;

import com.insurance.enums.DocumentType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Table(name = "documents")
@Data
public class Document {

    @Id
    private String documentId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "Document name is mandatory")
    private DocumentType documentName;

    @Column(nullable = false)
    @NotBlank(message = "Document type is mandatory")
    private String documentType;

    @Column(nullable = false)
    @NotBlank(message = "Document path is mandatory")
    private String documentPath; 

    @Column(nullable = false)
    @NotNull(message = "Upload date is mandatory")
    private LocalDate uploadDate;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = true)
    private Customer customer;
    
    @ManyToOne
    @JoinColumn(name = "claim_id", nullable = true)
    private Claim claim;

}
