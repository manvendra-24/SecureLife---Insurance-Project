package com.insurance.entities;

import java.time.LocalDate;
import java.util.List;

import com.insurance.enums.CreationStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "customers")
@Data
public class Customer {

    @Id
    private String customerId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    @NotNull(message = "User is mandatory")
    private User user;

    @NotBlank(message = "Name is mandatory")
    private String name;

    @Column(nullable = false)
    @NotNull(message = "Date of birth is mandatory")
    private LocalDate dob;

    @NotBlank(message = "Address is mandatory")
    private String address;

    @NotBlank(message = "Phone number is mandatory")
    @Size(min = 10, message = "Phone number must be at least 10 digits")
    private String phoneNumber;

    @NotBlank(message = "Bank account details are mandatory")
    private String bankAccountDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CreationStatus status = CreationStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "agent_id", nullable = true)
    private Agent agent;

    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false)
    @NotNull(message = "City is mandatory")
    private City city;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    //@NotNull(message = "Employee who verified the customer is mandatory")
    private Employee verifiedBy;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents;

}
