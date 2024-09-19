package com.insurance.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CityRequest {
    
    @NotBlank(message = "City name is mandatory")
    private String name;
    
    @NotNull(message = "State ID is mandatory")
    private String state_id;
}
