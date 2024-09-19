package com.insurance.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

@Data
@Entity
@Table(name = "cities")
public class City {

    @Id
    private String cityId;

    @Column(nullable = false)
    @NotBlank(message = "city cannot be null")
    private String name;

    @Column(nullable = false)
    private boolean isActive;
   
    @ManyToOne
    @JoinColumn(name = "state_id", nullable = false)
    @JsonBackReference 
    @NotNull(message="state cannot be null")
    private State state;
}
