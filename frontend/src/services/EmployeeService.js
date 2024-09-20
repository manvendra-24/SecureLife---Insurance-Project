import axios from 'axios';
import { UnAuthorized, InvalidCredentialError, InternalServerError } from '../utils/errors/Error';

export const addAgent = async (agentDetails) => {
  if (!localStorage.getItem('token')) {
    throw new Error("User is not logged in");
  }

  const token = localStorage.getItem('token');

  try {
    const response = await axios.post('http://localhost:8081/SecureLife.com/agents', agentDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error("User is unauthorized");
    }
    throw error;
  }
};

export const getAllAgents = async (params) => {
  const response = await axios.get('http://localhost:8081/SecureLife.com/agents', {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};
export const updateAgent = async (agentId, agentDetails, headers = {}) => {
  if (!localStorage.getItem('token')) {
    throw new UnAuthorized("User is not logged in");
  }

  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`http://localhost:8081/SecureLife.com/agent/${agentId}`, agentDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating agent profile:', error);
    throw error;
  }
};

export const toggleAgentStatus = async (agentId, isActive) => {
  if (!localStorage.getItem('token')) {
    throw new UnAuthorized("User is not logged in");
  }

  const token = localStorage.getItem('token');
  const endpoint = isActive
    ? `http://localhost:8081/SecureLife.com/agent/${agentId}/active` 
    : `http://localhost:8081/SecureLife.com/agent/${agentId}/deactivate`;  

  try {
    const response = await axios.put(endpoint, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling agent status:', error);
    throw error;
  }
};





export const getAllCustomers = async (params) => {
  const response = await axios.get('http://localhost:8081/SecureLife.com/customers', {
    params,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};


export const getCustomerDocuments = async (customerId) => {
  const token = localStorage.getItem('token');
  try {
      const response = await axios.get(`http://localhost:8081/SecureLife.com/customer/${customerId}/documents`, {
          headers: {
              Authorization: `Bearer ${token}`,
          }
      });
      return response.data; 
  } catch (error) {
      console.error('Error fetching customer documents:', error);
      throw error;
  }
};

export const downloadDocument = async (documentId, documentNameFromUI) => {
  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/document/${documentId}/download`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      responseType: 'blob',  
    });

   
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    
    const contentDisposition = response.headers['content-disposition'];
    let fileName = documentNameFromUI;  

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
      if (fileNameMatch && fileNameMatch.length > 1) {
        fileName = fileNameMatch[1];
      }
    }

    
    const contentType = response.headers['content-type'];
    if (!fileName.includes('.')) {
      if (contentType.includes('jpeg') || contentType.includes('jpg')) {
        fileName += '.jpeg';
      } else if (contentType.includes('pdf')) {
        fileName += '.pdf';
      } else if (contentType.includes('png')) {
        fileName += '.png';
      } else if (contentType.includes('application/msword')) {
        fileName += '.doc';
      } else if (contentType.includes('application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
        fileName += '.docx';
      }
    }

  
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading document:', error);
  }
};


export const approveCustomer = async (customerId) => {
  try {
    const response = await axios.put(`http://localhost:8081/SecureLife.com/customer/${customerId}/approve`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error approving customer:', error);
    throw error;
  }
};


export const rejectCustomer = async (customerId) => {
  try {
    const response = await axios.put(`http://localhost:8081/SecureLife.com/customer/${customerId}/reject`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error rejecting customer:', error);
    throw error;
  }
};
export const updateCustomer = async (customerId, customerDetails, headers = {}) => {
  if (!localStorage.getItem('token')) {
    throw new Error("User is not logged in");
  }

  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`http://localhost:8081/SecureLife.com/customer/${customerId}/update`, customerDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        ...headers
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating customer profile:', error);
    throw error;
  }
};

export const toggleCustomerStatus = async (customerId, isActive) => {
  if (!localStorage.getItem('token')) {
    throw new Error("User is not logged in");
  }

  const token = localStorage.getItem('token');
  const endpoint = isActive
    ? `http://localhost:8081/SecureLife.com/customer/${customerId}/active`  
    : `http://localhost:8081/SecureLife.com/customer/${customerId}/delete`; 

  try {
    const response = await axios.put(endpoint, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling customer status:', error);
    throw error;
  }
};
export const getCustomerById = async (customerId) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/customers/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching customer details:', error);
    throw error;
  }
};
export const getCommissionByAgentId = async (agentId, params) => {
  const token = localStorage.getItem('token');  
  const response = await axios.get(`http://localhost:8081/SecureLife.com/agent/${agentId}/commissions`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;  
};
export const getPoliciesByCustomerId = async (customerId, params) => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`http://localhost:8081/SecureLife.com/customer/${customerId}/policies`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};