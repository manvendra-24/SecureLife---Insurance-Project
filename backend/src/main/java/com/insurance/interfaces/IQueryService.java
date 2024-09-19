package com.insurance.interfaces;

import com.insurance.request.CustomerQueryRequest;
import com.insurance.request.EmployeeQueryRequest;
import com.insurance.response.CustomerQueryResponse;
import com.insurance.util.PagedResponse;

public interface IQueryService {

	String addQuery(String token, CustomerQueryRequest queryRequest);

	String addResponseQuery(String token, EmployeeQueryRequest queryRequest,long id);

	PagedResponse<CustomerQueryResponse> getAllQueries(int page, int size, String sortBy, String direction,
			String searchquery);

}
