package com.insurance.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.insurance.entities.City;
import com.insurance.entities.State;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.interfaces.IStateService;
import com.insurance.repository.CityRepository;
import com.insurance.repository.StateRepository;
import com.insurance.request.StateRequest;
import com.insurance.response.CityResponse;
import com.insurance.response.StateResponse;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;
import com.insurance.util.UniqueIdGenerator;

@Service
public class StateService implements IStateService {

    private static final Logger logger = LoggerFactory.getLogger(StateService.class);

    @Autowired
    Mappers mappers;

    @Autowired
    StateRepository stateRepository;
    
    @Autowired
    CityRepository cityRepository;

    @Autowired
    UniqueIdGenerator uniqueIdGenerator;

    @Override
    public String createState(StateRequest stateRequest) {
        logger.info("Creating new state with name: {}", stateRequest.getName());
        State state = mappers.stateRequestToState(stateRequest);
        state.setStateId(uniqueIdGenerator.generateUniqueId(State.class));
        stateRepository.save(state);
        logger.info("State created successfully with ID: {}", state.getStateId());
        return "State Added Successfully";
    }

    @Override
    public StateResponse getStateById(String id) {
        logger.info("Fetching state with ID: {}", id);

        State state = stateRepository.findById(id).orElse(null);
        if (state != null) {
            StateResponse stateResponse = mappers.stateToStateResponse(state);
            logger.info("State found with ID: {}", id);
            return stateResponse;
        }

        logger.warn("State not found with ID: {}", id);
        return null;
    }

    @Override
    public PagedResponse<StateResponse> getPagedStates(int page, int size, String sortBy, String direction, String searchQuery) {
        logger.info("Fetching all states with pagination - page: {}, size: {}, sortBy: {}, direction: {}", page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();
        PageRequest pageable = PageRequest.of(page, size, sort);

        Page<State> statePage = stateRepository.findAllWithSearchQuery(searchQuery, pageable);
        List<StateResponse> stateResponse = statePage.getContent().stream()
                .map(state -> mappers.stateToStateResponse(state)).collect(Collectors.toList());

        logger.info("Fetched {} states", stateResponse.size());
        return new PagedResponse<>(stateResponse, statePage.getNumber(), statePage.getSize(),
                statePage.getTotalElements(), statePage.getTotalPages(), statePage.isLast());
    }

    @Override
    public String deactivateStateById(String id) {
        logger.info("Deactivating state with ID: {}", id);
        State state = stateRepository.findById(id).orElse(null);
        if (state != null) {
            if (state.isActive()) {
            	List<City> cities = state.getCities();
            	for(City city:cities) {
            		if(city.isActive()) {
            			throw new ApiException("State cannot be inactive because it has active cities.");
            		}
            	}
                state.setActive(false);
                stateRepository.save(state);
                logger.info("State deactivated successfully with ID: {}", id);
            } else {
                throw new ApiException("State is already inactive with id: " + id);
            }
        } else {
            throw new ResourceNotFoundException("State Not Found with id: " + id);
        }
        return "State deactivated successfully";
    }

    @Override
    public String activateStateById(String id) {
        logger.info("Activating state with ID: {}", id);
        State state = stateRepository.findById(id).orElse(null);
        if (state != null) {
            if (!state.isActive()) {
            	List<City> cities = state.getCities();
            	for(City city:cities) {
            		city.setActive(true);
            	}
                state.setActive(true);
                stateRepository.save(state);
                logger.info("State activated successfully with ID: {}", id);
            } else {
                throw new ApiException("State is already active with id: " + id);
            }
        } else {
            throw new ResourceNotFoundException("State Not Found with ID: " +   id);
        }
        return "State activated successfully";
    }

    @Override
    public String updateState(String id, StateRequest stateRequest) {
        logger.info("Updating state with ID: {}", id);
        State state = stateRepository.findById(id).orElse(null);
        if (state != null) {
            if (!state.isActive()) {
                throw new ApiException("State is inactive with id: " + id);
            }
            state.setName(stateRequest.getName());
            stateRepository.save(state);
            logger.info("State updated successfully with ID: {}", id);
        } else {
            throw new ResourceNotFoundException("State Not Found with Id: " + id);
        }
        return "State successfully updated";
    }
    
    @Override
    public PagedResponse<CityResponse> getCitiesByStateId(int page, int size, String sortBy, String direction, String searchQuery, String stateId) {
        logger.info("Fetching all cities with state {} with pagination - page: {}, size: {}, sortBy: {}, direction: {}", stateId, page, size, sortBy, direction);

        Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name()) ? Sort.by(sortBy).descending()
                : Sort.by(sortBy).ascending();

        Optional<State> state = stateRepository.findById(stateId);
        if (state.isEmpty()) {
            throw new ResourceNotFoundException("State not found");
        }

        List<City> allCities = state.get().getCities();

        List<City> filteredCities = allCities.stream()
                .filter(city -> city.getCityId().toLowerCase().contains(searchQuery.toLowerCase()) ||
                                city.getName().toLowerCase().contains(searchQuery.toLowerCase()) ||
                                city.getState().getName().toLowerCase().contains(searchQuery.toLowerCase()))
                .sorted((city1, city2) -> {
                    int compare = 0;
                    if ("cityId".equalsIgnoreCase(sortBy)) {
                        compare = city1.getCityId().compareTo(city2.getCityId());
                    } else if ("name".equalsIgnoreCase(sortBy)) {
                        compare = city1.getName().compareTo(city2.getName());
                    }
                    return "DESC".equalsIgnoreCase(direction) ? -compare : compare;
                })
                .collect(Collectors.toList());

        int start = Math.min((int) PageRequest.of(page, size, sort).getOffset(), filteredCities.size());
        int end = Math.min(start + size, filteredCities.size());
        List<City> pagedCities = filteredCities.subList(start, end);

        Page<City> citiesPage = new PageImpl<>(pagedCities, PageRequest.of(page, size, sort), filteredCities.size());

        List<CityResponse> citiesResponse = citiesPage.getContent().stream()
                .map(city -> mappers.cityToCityResponse(city))
                .collect(Collectors.toList());

        logger.info("Fetched {} cities", citiesResponse.size());
        return new PagedResponse<>(citiesResponse, citiesPage.getNumber(), citiesPage.getSize(),
                citiesPage.getTotalElements(), citiesPage.getTotalPages(), citiesPage.isLast());
    }

	@Override
	public List<StateResponse> getAllStates() {
		List<State> states = stateRepository.findAll();
		List<StateResponse> stateResponses = new ArrayList<>();
		for(State state:states) {
			StateResponse stateResponse = mappers.stateToStateResponse(state);
			stateResponses.add(stateResponse);
		}
		return stateResponses;
	}


	
}
