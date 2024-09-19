package com.insurance.entities;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Entity
@Data
@Table(name = "tax_settings")
public class TaxSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long taxId;

    @Column(nullable = false)
    @Min(value = 0, message = "Tax percentage must be a positive value")
    private double taxPercentage;

    private LocalDateTime updatedAt=LocalDateTime.now();
}
