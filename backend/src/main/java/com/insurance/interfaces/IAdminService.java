package com.insurance.interfaces;

import com.insurance.response.AdminResponse;
import com.insurance.response.InsuranceSettingResponse;
import com.insurance.response.TaxSettingResponse;
import com.insurance.request.AdminRegisterRequest;
import com.insurance.request.InsuranceSettingRequest;
import com.insurance.request.TaxSettingRequest;
import com.insurance.util.PagedResponse;

public interface IAdminService {

	
	String deleteAdmin(String admin_id);
	String activateAdmin(String admin_id);
	PagedResponse<AdminResponse> getAllAdmins(int page, int size, String sortBy, String direction, String searchQuery);
	String updateAdmin(String admin_id, AdminRegisterRequest adminRequest);
	String registerAdmin(AdminRegisterRequest registerDto);
	AdminResponse getAdminById(String admin_id);


	String createTaxSetting(TaxSettingRequest taxSettingRequest);
	TaxSettingResponse getLastTaxSetting();
	String createInsuranceSetting(InsuranceSettingRequest insuranceSettingRequestDto);
	InsuranceSettingResponse getLastInsuranceSetting();


}
