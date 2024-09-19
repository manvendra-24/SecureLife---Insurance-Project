package com.insurance.entities;

import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
@Table(name = "states")
public class State {

    @Id
    private String stateId;

    @Column(nullable = false)
    @NotBlank(message = "State name cannot be blank")
    private String name;
    
    @Column(nullable = false)
    private boolean isActive;
    
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "state")
    @JsonManagedReference
    private List<City> cities;
}
