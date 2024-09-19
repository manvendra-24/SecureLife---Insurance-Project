package com.insurance.entities;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Entity
@Data
@Table(name = "insurance_schemes")
public class InsuranceScheme {

    @Id
    private String insuranceSchemeId;

    @Column(nullable = false)
    @NotBlank(message = "Scheme name cannot be blank")
    private String name;

    @Min(value = 0, message = "New registration commission must be non-negative")
    private double newRegistrationCommission;

    @Min(value = 0, message = "Withdrawal Penalty must be non-negative")
    private double withdrawalPenalty;

    @Column(nullable = false)
    private boolean isActive;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "insurance_type_id", nullable = false)
    @NotNull(message = "Insurance type cannot be null")
    private InsuranceType insuranceType;

    @OneToOne(mappedBy = "insuranceScheme", cascade = CascadeType.ALL)
    private InsurancePlan insurancePlan;
}
