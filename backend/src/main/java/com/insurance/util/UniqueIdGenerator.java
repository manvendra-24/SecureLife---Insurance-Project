package com.insurance.util;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

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

@Component
public class UniqueIdGenerator {

    private final Map<Class<?>, JpaRepository<?, String>> repositories = new ConcurrentHashMap<>();

    public UniqueIdGenerator(UserRepository userRepository, 
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
                             TransactionRepository transactionRepository) {

        repositories.put(User.class, userRepository);
        repositories.put(Customer.class, customerRepository);
        repositories.put(Admin.class, adminRepository);
        repositories.put(Employee.class, employeeRepository);
        repositories.put(Agent.class, agentRepository);
        repositories.put(City.class, cityRepository);
        repositories.put(State.class, stateRepository);
        repositories.put(InsurancePlan.class, insurancePlanRepository);
        repositories.put(InsuranceType.class, insuranceTypeRepository);
        repositories.put(InsuranceScheme.class, insuranceSchemeRepository);
        repositories.put(Document.class, documentRepository);
        repositories.put(Policy.class, policyRepository);
        repositories.put(Transaction.class, transactionRepository);
    }

    public <T> String generateUniqueId(Class<T> entityClass) {
        JpaRepository<?, String> repository = repositories.get(entityClass);
        if (repository == null) {
            throw new IllegalArgumentException("No repository found for entity class: " + entityClass.getName());
        }
        String prefix = getPrefix(entityClass);
        String lastId = findLastId(repository, prefix);
        return generateNextId(prefix, lastId);
    }

    private String getPrefix(Class<?> entityClass) {
        if (entityClass.equals(User.class)) {
            return "USER";
        } else if (entityClass.equals(Customer.class)) {
            return "CUST";
        } else if (entityClass.equals(Admin.class)) {
            return "ADMIN";
        } else if (entityClass.equals(Employee.class)) {
            return "EMP";
        } else if (entityClass.equals(Agent.class)) {
            return "AGENT";
        } else if (entityClass.equals(City.class)) {
            return "CITY";
        } else if (entityClass.equals(State.class)) {
            return "STATE";
        } else if (entityClass.equals(InsurancePlan.class)) {
            return "PLAN";
        } else if (entityClass.equals(InsuranceType.class)) {
            return "TYPE";
        } else if (entityClass.equals(InsuranceScheme.class)) {
            return "SCHEME";
        } else if (entityClass.equals(Document.class)) {
            return "DOC";
        } else if (entityClass.equals(Policy.class)) {
            return "POL";
        } else if (entityClass.equals(Transaction.class)) {
            return "TXN";
        } else {
            throw new IllegalArgumentException("Unknown entity class: " + entityClass.getName());
        }
    }

    private String findLastId(JpaRepository<?, String> repository, String prefix) {
        List<?> entities = repository.findAll();

        if (entities.isEmpty()) {
            return null; 
        }

        return entities.stream()
                .map(entity -> {
                    try {
                        String methodName = getMethodName(entity.getClass());
                        String customId = (String) entity.getClass().getMethod(methodName).invoke(entity);
                        return customId;
                    } catch (Exception e) {
                        throw new RuntimeException("Failed to get custom ID for entity: " + entity.getClass().getName(), e);
                    }
                })
                .filter(id -> id.startsWith(prefix))
                .max(String::compareTo)
                .orElse(null);
    }

    private String getMethodName(Class<?> entityClass) {
        if (entityClass.equals(User.class)) {
            return "getUserId";
        } else if (entityClass.equals(Customer.class)) {
            return "getCustomerId";
        } else if (entityClass.equals(Admin.class)) {
            return "getAdminId";
        } else if (entityClass.equals(Employee.class)) {
            return "getEmployeeId";
        } else if (entityClass.equals(Agent.class)) {
            return "getAgentId";
        } else if (entityClass.equals(City.class)) {
            return "getCityId";
        } else if (entityClass.equals(State.class)) {
            return "getStateId";
        } else if (entityClass.equals(InsurancePlan.class)) {
            return "getInsuranceId";
        } else if (entityClass.equals(InsuranceType.class)) {
            return "getInsuranceTypeId";
        } else if (entityClass.equals(InsuranceScheme.class)) {
            return "getInsuranceSchemeId";
        } else if (entityClass.equals(Document.class)) {
            return "getDocumentId";
        } else if (entityClass.equals(Policy.class)) {
            return "getPolicyId";
        } else if (entityClass.equals(Transaction.class)) {
            return "getTransactionId";
        } else {
            throw new IllegalArgumentException("Unknown entity class: " + entityClass.getName());
        }
    }

    private String generateNextId(String prefix, String lastId) {
        int initialValue;
        int numericPartLength;

        if (prefix.equals("ADMIN") || prefix.equals("STATE") || prefix.equals("TYPE")) {
            initialValue = 1;
            numericPartLength = 3;
        } else {
            initialValue = 10001;
            numericPartLength = 5;
        }

        if (lastId == null || lastId.isEmpty()) {
            return String.format(prefix + "%0" + numericPartLength + "d", initialValue);
        }

        int numericPart = Integer.parseInt(lastId.substring(prefix.length()));
        return String.format(prefix + "%0" + numericPartLength + "d", numericPart + 1);
    }
}

