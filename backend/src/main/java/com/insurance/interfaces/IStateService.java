package com.insurance.interfaces;

import java.util.List;

import com.insurance.request.StateRequest;
import com.insurance.response.CityResponse;
import com.insurance.response.StateResponse;
import com.insurance.util.PagedResponse;

public interface IStateService {

	String createState(StateRequest stateRequest);
	String updateState(String id, StateRequest stateRequest);
	StateResponse getStateById(String id);
	PagedResponse<StateResponse> getPagedStates(int page, int size, String sortBy, String direction, String searchQuery);
	String deactivateStateById(String id);
	String activateStateById(String id);
	PagedResponse<CityResponse> getCitiesByStateId(int page, int size, String sortBy, String direction, String searchQuery, String id);
	List<StateResponse> getAllStates();
	

}
