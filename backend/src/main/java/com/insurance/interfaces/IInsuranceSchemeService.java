package com.insurance.interfaces;

import com.insurance.request.InsuranceSchemeRequest;
import com.insurance.response.InsuranceSchemeResponse;
import com.insurance.util.PagedResponse;

public interface IInsuranceSchemeService {

	String createInsuranceScheme(String typeId, InsuranceSchemeRequest schemeRequest);

	PagedResponse<InsuranceSchemeResponse> getAllInsuranceSchemes(int page, int size, String sortBy, String direction, String searchQuery);

	String updateInsuranceScheme(String id, InsuranceSchemeRequest schemeRequest);

	String activateInsuranceScheme(String id);

	String deleteInsuranceScheme(String id);

	PagedResponse<InsuranceSchemeResponse> getInsuranceSchemesByType(String typeId, int page, int size, String sortBy,
			String direction, String searchQuery);

	InsuranceSchemeResponse getInsuranceSchemeById(String id);

}
