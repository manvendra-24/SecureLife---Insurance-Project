package com.insurance.response;

import lombok.Data;

@Data
public class AgentResponse {

  private String agentId;
  private String name;
  private String username;
  private String email;
  private boolean isActive;
  private String address;
  private String city_id;
  private String createdBy;
  private String phoneNumber;
}