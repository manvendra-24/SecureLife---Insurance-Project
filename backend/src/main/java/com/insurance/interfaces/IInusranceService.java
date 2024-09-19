package com.insurance.interfaces;

import com.insurance.request.InsuranceTypeRequest;
import com.insurance.response.InsuranceTypeResponse;
import com.insurance.util.PagedResponse;

public interface IInusranceService {

	String createInsuranceType(InsuranceTypeRequest typeRequest);

	String updateInsuranceType(InsuranceTypeRequest typeRequest, String id);

	String deactivatingType(String id);

	String activatingType(String id);

	PagedResponse<InsuranceTypeResponse> getAllTypes(int page, int size, String sortBy, String direction,String searchQuery);

}
