package com.insurance.entities;


import java.util.List;

import com.insurance.enums.ClaimStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;

@Entity
@Data
public class Claim {

		@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long claimId;

	    @ManyToOne
	    @JoinColumn(name = "policy_id", nullable = false)
	    private Policy policy;

	    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, orphanRemoval = true) 
	    private List<Document> documents;

	    @Column(nullable = false)
	    private String explanation;

	    @Enumerated(EnumType.STRING)
	    private ClaimStatus status = ClaimStatus.PENDING;

	    
	
}

