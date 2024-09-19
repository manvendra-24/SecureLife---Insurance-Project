package com.insurance.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class StateRequest {

    @NotBlank(message = "Name is mandatory")
    private String name;
}
