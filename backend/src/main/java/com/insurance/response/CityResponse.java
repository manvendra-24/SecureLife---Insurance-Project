package com.insurance.response;

import lombok.Data;

@Data
public class CityResponse {

    private String cityId;
    private String name;
    private String state;
    private boolean isActive;
   
}
