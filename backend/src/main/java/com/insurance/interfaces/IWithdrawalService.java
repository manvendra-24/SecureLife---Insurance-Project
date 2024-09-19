package com.insurance.interfaces;

import org.springframework.data.domain.PageRequest;

import com.insurance.response.WithdrawalRequestDTO;
import com.insurance.util.PagedResponse;

public interface IWithdrawalService {

	void withdrawalRequest(String token, String policy_id);

	String approveWithdrawal(String token, long withdrawal_id);

	String rejectWithdrawal(String token, long withdrawal_id);

	PagedResponse<WithdrawalRequestDTO> getAllWithdrawalRequests(int page, int size, String sortBy, String direction,
			String searchQuery);

	PagedResponse<WithdrawalRequestDTO> getMyWithdrawals(String token, PageRequest of);


}
