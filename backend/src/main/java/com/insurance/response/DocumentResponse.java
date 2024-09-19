package com.insurance.response;

import java.time.LocalDate;

import com.insurance.enums.DocumentType;

import lombok.Data;


@Data
public class DocumentResponse {

    private String documentId;

    
    private DocumentType documentName;

    private String documentType;

    private LocalDate uploadDate;

}
