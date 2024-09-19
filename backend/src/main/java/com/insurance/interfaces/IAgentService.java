package com.insurance.interfaces;

import com.insurance.request.AgentRegisterRequest;
import com.insurance.response.AgentResponse;
import com.insurance.util.PagedResponse;

public interface IAgentService {

	String registerAgent(String token, AgentRegisterRequest registerDto);
	String updateAgent(String agent_id, AgentRegisterRequest agentRequest);
	String deleteAgent(String agent_id);
	String activateAgent(String agent_id);
	PagedResponse<AgentResponse> getAllAgents(int page, int size, String sortBy, String direction, String searchQuery);
	AgentResponse getAgentById(String agent_id);

    
}
