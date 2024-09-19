package com.insurance.response;

import lombok.Data;

@Data
public class InsuranceSettingResponse {

	private double claimDeduction;
	private double withdrawalPenalty;
	private double latePenalty;
}
