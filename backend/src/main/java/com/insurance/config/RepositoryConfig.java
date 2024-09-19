package com.insurance.config;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;

import com.insurance.entities.Admin;
import com.insurance.entities.Agent;
import com.insurance.entities.City;
import com.insurance.entities.Customer;
import com.insurance.entities.Document;
import com.insurance.entities.Employee;
import com.insurance.entities.InsurancePlan;
import com.insurance.entities.InsuranceScheme;
import com.insurance.entities.InsuranceType;
import com.insurance.entities.Policy;
import com.insurance.entities.State;
import com.insurance.entities.Transaction;
import com.insurance.entities.User;
import com.insurance.repository.AdminRepository;
import com.insurance.repository.AgentRepository;
import com.insurance.repository.CityRepository;
import com.insurance.repository.CustomerRepository;
import com.insurance.repository.DocumentRepository;
import com.insurance.repository.EmployeeRepository;
import com.insurance.repository.InsurancePlanRepository;
import com.insurance.repository.InsuranceSchemeRepository;
import com.insurance.repository.InsuranceTypeRepository;
import com.insurance.repository.PolicyRepository;
import com.insurance.repository.StateRepository;
import com.insurance.repository.TransactionRepository;
import com.insurance.repository.UserRepository;

@Configuration
public class RepositoryConfig {

    public Map<Class<?>, JpaRepository<?, String>> repositories(UserRepository userRepository, 
                                                              CustomerRepository customerRepository, 
                                                              AdminRepository adminRepository,
                                                              EmployeeRepository employeeRepository,
                                                              AgentRepository agentRepository,
                                                              CityRepository cityRepository,
                                                              StateRepository stateRepository,
                                                              InsurancePlanRepository insurancePlanRepository,
    														  InsuranceTypeRepository insuranceTypeRepository,
    														  InsuranceSchemeRepository insuranceSchemeRepository,
    														  DocumentRepository documentRepository,
    														  PolicyRepository policyRepository,
    														  TransactionRepository transactionRepository){
    	
        return Stream.of(
                Map.entry(User.class, userRepository),
                Map.entry(Customer.class, customerRepository),
                Map.entry(Admin.class, adminRepository),
                Map.entry(Employee.class, employeeRepository),
                Map.entry(Agent.class, agentRepository),
                Map.entry(City.class, cityRepository),
                Map.entry(State.class, stateRepository),
                Map.entry(InsurancePlan.class, insurancePlanRepository),
                Map.entry(InsuranceType.class, insuranceTypeRepository),
                Map.entry(InsuranceScheme.class, insuranceSchemeRepository),
                Map.entry(Document.class, documentRepository),
                Map.entry(Policy.class, policyRepository),
                Map.entry(Transaction.class, transactionRepository)
        ).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
