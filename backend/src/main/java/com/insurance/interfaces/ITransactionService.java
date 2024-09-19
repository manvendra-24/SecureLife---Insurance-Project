package com.insurance.interfaces;

import java.util.List;

import com.insurance.response.TransactionResponse;
import com.insurance.util.PagedResponse;

public interface ITransactionService {

	PagedResponse<TransactionResponse> getAllTransactions(int page, int size, String sortBy, String direction);

	List<TransactionResponse> transctionByPolicyId(String policyid);

}
