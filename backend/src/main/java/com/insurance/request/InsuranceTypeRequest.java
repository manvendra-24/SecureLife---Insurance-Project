package com.insurance.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InsuranceTypeRequest {

    @NotBlank(message = "Name is mandatory")
    private String name;

    private boolean active;
}
