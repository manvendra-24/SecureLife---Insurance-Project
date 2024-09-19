package com.insurance.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.insurance.entities.Customer;
import com.insurance.entities.CustomerQuery;
import com.insurance.entities.Employee;
import com.insurance.entities.User;
import com.insurance.enums.CreationStatus;
import com.insurance.exceptions.ApiException;
import com.insurance.exceptions.ResourceNotFoundException;
import com.insurance.exceptions.UnauthorizedException;
import com.insurance.interfaces.IQueryService;
import com.insurance.repository.CustomerQueryRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.UserRepository;
import com.insurance.request.CustomerQueryRequest;
import com.insurance.request.EmployeeQueryRequest;
import com.insurance.response.CustomerQueryResponse;
import com.insurance.security.JwtTokenProvider;
import com.insurance.util.Mappers;
import com.insurance.util.PagedResponse;


@Service
public class QueryService implements IQueryService {
	
	@Autowired
	Mappers mappers;
	@Autowired
	JwtTokenProvider jwtTokenProvider;
	@Autowired
	UserRepository userRepository;
	@Autowired
	EmployeeRepository employeeRepository;
	@Autowired
	CustomerRepository customerRepository;
	
	@Autowired
	CustomerQueryRepository customerQueryRepository;
	
	
	@Override
	public String addQuery(String token, CustomerQueryRequest queryRequest) {
		String username = jwtTokenProvider.getUsername(token);
        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
        if (oUser.isEmpty()) {
            throw new UnauthorizedException("User is not available for token");
        }
        User user = oUser.get();

        Customer  customer = customerRepository.findByUser(user);
        if(customer==null) {
        	throw new ApiException("Customer not found");
        }
        if(customer.getStatus()==CreationStatus.REJECTED) {
        	throw new ApiException("Sorry you cannot post query");
        	
        }

        CustomerQuery query=new CustomerQuery();
        query.setCustomer(customer);
        query.setMessage(queryRequest.getMessage());
        query.setSubject(queryRequest.getSubject());
        query.setStatus("pending");
        query.setSubmittedAt(LocalDateTime.now());
        customerQueryRepository.save(query);
		return "Query Submitted Succussfully";
	}


	@Override
	public String addResponseQuery(String token, EmployeeQueryRequest queryRequest,long id) {
		   String username = jwtTokenProvider.getUsername(token);
	        Optional<User> oUser = userRepository.findByUsernameOrEmail(username, username);
	        if (oUser.isEmpty()) {
	            throw new UnauthorizedException("User is not available for token");
	        }
	        User user = oUser.get();

	        Employee employee = employeeRepository.findByUser(user)
	                .orElseThrow(() -> new ApiException("Employee not found"));
	       
	        CustomerQuery query=customerQueryRepository.findById(id).orElse(null);
	        if(query!=null) {
	        query.setStatus("Responded");
	        query.setResponse(queryRequest.getResponse());
	        query.setEmployee(employee);
	        customerQueryRepository.save(query);
			return "Response Submitted Succussfully";
	        }
	        else {
	        	throw new ResourceNotFoundException("query not found with id: "+id);
	        }
	}

	@Override
	  public PagedResponse<CustomerQueryResponse> getAllQueries(int page, int size, String sortBy, String direction, String searchquery) {
	      Sort sort = direction.equalsIgnoreCase(Sort.Direction.DESC.name())
	              ? Sort.by(sortBy).descending()
	              : Sort.by(sortBy).ascending();
	      PageRequest pageable = PageRequest.of(page, size, sort);
	      
	      Page<CustomerQuery> page1;
	      if (searchquery != null && !searchquery.isEmpty()) {
	          page1 = customerQueryRepository.findAllWithSearchQuery(searchquery, pageable);
	      } else {
	          page1 = customerQueryRepository.findAll(pageable);
	      }

	      List<CustomerQueryResponse> queryResponses = page1.stream()
	          .map(query -> mappers.queryToCustomerQueryResponse(query))
	          .collect(Collectors.toList());

	      return new PagedResponse<>(queryResponses, page1.getNumber(), page1.getSize(), page1.getTotalElements(), page1.getTotalPages(), page1.isLast());
	  }

	
}
