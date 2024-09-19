package com.insurance.response;

import lombok.Data;

@Data
public class StateResponse {
   
    private String stateId;
    private String name;
    private boolean isActive;
}
