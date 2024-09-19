package com.insurance.interfaces;

import java.util.List;


import com.insurance.request.CityRequest;
import com.insurance.response.CityResponse;
import com.insurance.util.PagedResponse;

public interface ICityService {

	String createCity(CityRequest cityRequest);

	String updateCity(String id, CityRequest cityRequest);

	String deactivateCity(String id);

	CityResponse getCityById(String id);

	String activateCity(String id);

	PagedResponse<CityResponse> getPagedCities(int page, int size, String sortBy, String direction, String searchQuery);

	List<CityResponse> getAllCities();

}
