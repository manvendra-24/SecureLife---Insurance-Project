package com.insurance.interfaces;

import com.insurance.request.EmployeeRegisterRequest;
import com.insurance.response.EmployeeResponse;
import com.insurance.util.PagedResponse;

public interface IEmployeeService {

	String registerEmployee(EmployeeRegisterRequest registerDto);
	String updateEmployee(String employee_id, EmployeeRegisterRequest employeeRequest);
	String deleteEmployee(String employee_id);
	String activateEmployee(String employee_id);
	PagedResponse<EmployeeResponse> getAllEmployees(int page, int size, String sortBy, String direction, String searchQuery);
	EmployeeResponse getEmployeeById(String employee_id);

}
