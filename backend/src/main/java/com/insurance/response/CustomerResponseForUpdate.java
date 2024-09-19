package com.insurance.response;

import java.time.LocalDate;
import lombok.Data;

@Data
public class CustomerResponseForUpdate {
    private String customerId;
    private String name;
    private String username;
    private String phoneNumber;
    private String verifiedby;
    private String agent;
    private String dob;  
    private String address;
    private String city_id;

   

   

    public void setDob(LocalDate dob) {
        this.dob = dob != null ? dob.toString() : null;  
    }
}
