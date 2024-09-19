package com.insurance.interfaces;

public interface IDashboardService {

	long getTotalAdmins();

	long getTotalAgents();

	long getTotalCustomers();

	long getTotalEmployees();
	
	Double getMyCommissions(String token);

	Double getMyWithdrawals(String token);

	Long getCancelledPolicies(String token);

	Long getSoldPolicies(String token);

}
