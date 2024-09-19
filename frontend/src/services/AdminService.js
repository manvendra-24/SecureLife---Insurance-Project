import axios from 'axios';
import { UnAuthorizedError, AlreadyExists, InternalServerError } from '../utils/errors/Error';


export const registerAdmin = async (adminData) => {
  const token = localStorage.getItem('token'); 
  if(!token){
    throw new UnAuthorizedError("Please login!")
  }
  try {
    const response = await axios.post(
      'http://localhost:8081/SecureLife.com/admin/register',
      adminData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
        const backendErrorMessage = error.response.data.message || 'Something went wrong!';
        throw new AlreadyExists(backendErrorMessage);
    } else {
        throw new Error('Network Error');
    }
}
};

export const getAllAdmins = async (params = {}, headers = {}) => {
    const token = localStorage.getItem('token');
    if(!token){
        throw new UnAuthorizedError("Please login!")
    }
    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/admins`, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error fetching the admins!", error);
        throw error;
    }
};


export const activateAdmin = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/admin/${id}/active`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error activating the admin!", error);
        throw error;
    }
};

export const deactivateAdmin = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/admin/${id}/delete`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error deactivating the admin!", error);
        throw error;
    }
};


export const registerAgent = async (agentData) => {
    const token = localStorage.getItem('token'); 
    if(!token){
      throw new UnAuthorizedError("Please login!")
    }
    try {
      const response = await axios.post(
        'http://localhost:8081/SecureLife.com/agents',
        agentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
          const backendErrorMessage = error.response.data.message || 'Something went wrong!';
          throw new AlreadyExists(backendErrorMessage);
      } else {
          throw new Error('Network Error');
      }
  }
  };
export const getAllAgents = async (params = {}, headers = {}) => {
    const token = localStorage.getItem('token');
    if(!token){
        throw new UnAuthorizedError("Please login!")
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/agents`, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error fetching the agents!", error);
        throw error;
    }
};


export const activateAgent = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/agent/${id}/active`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error activating the agent!", error);
        throw error;
    }
};

export const deactivateAgent = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/agent/${id}/deactivate`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error deactivating the agent!", error);
        throw error;
    }
};



export const registerEmployee = async (employeeData) => {
    const token = localStorage.getItem('token'); 
    if(!token){
      throw new UnAuthorizedError("Please login!")
    }
    try {
      const response = await axios.post(
        'http://localhost:8081/SecureLife.com/employee/register',
        employeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
          const backendErrorMessage = error.response.data.message || 'Something went wrong!';
          throw new AlreadyExists(backendErrorMessage);
      } else {
          throw new Error('Network Error');
      }
  }
  };
export const getAllEmployees = async (params = {}, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/employees`, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error fetching the employees!", error);
        throw error;
    }
};

export const activateEmployee = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/employee/${id}/active`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error activating the employee!", error);
        throw error;
    }
};

export const deactivateEmployee = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/employee/${id}/delete`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error deactivating the employee!", error);
        throw error;
    }
};


export const registerCustomer = async (customerData) => {
  const token = localStorage.getItem('token');
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.post(
      'http://localhost:8081/SecureLife.com/customer/register',
      customerData,
      {
        headers, 
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Network Error');
  }
};



export const getAllCustomers = async (params = {}, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/customers`, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error fetching the customers!", error);
        throw error;
    }
};

export const activateCustomer = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/customer/${id}/active`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error activating the customer!", error);
        throw error;
    }
};

export const deactivateCustomer = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/customer/${id}/delete`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error deactivating the customer!", error);
        throw error;
    }
};


export const addState = async (data, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.post(`http://localhost:8081/SecureLife.com/states`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error adding the state!", error);
        throw error;
    }
};
export const getAllStates = async (params = {}, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/states`, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error fetching the states!", error);
        throw error;
    }
};

export const getAllStatesList = async () => {
    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/allstates`, {
        });
        return response.data;
    } catch (error) {
        console.error("There was an error fetching the states!", error);
        throw error;
    }
};


export const getCitiesByState = async (stateId,params = {}, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/state/${stateId}/cities`, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error fetching the states!", error);
        throw error;
    }
};

export const activateState = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/state/${id}/active`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deactivateState = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.delete(`http://localhost:8081/SecureLife.com/state/${id}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error deactivating the state!", error);
        throw error;
    }
};

export const addCity = async (data, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }
    console.log(data);
    try {
        const response = await axios.post(`http://localhost:8081/SecureLife.com/cities`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error adding the city!", error);
        throw error;
    }
};

export const getAllCities = async (params = {}, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/cities`, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const activateCity = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/city/${id}/activate`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error activating the city!", error);
        throw error;
    }
};

export const deactivateCity = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.delete(`http://localhost:8081/SecureLife.com/city/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        throw new InternalServerError(error.response.data.message);
    }
};


export const createInsuranceSetting = async (data) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.post('http://localhost:8081/SecureLife.com/insurance-setting', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating insurance setting');
    }
  };

  export const createTaxSetting = async (data) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.post('http://localhost:8081/SecureLife.com/tax-setting', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error creating tax setting');
    }
  };

export const getLastTaxSetting = async () => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }
    const response = await axios.get('https://localhost:8081/SecureLife.com/tax-setting', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching last tax setting:', error);
    throw error; 
  }
};

export const getLastInsuranceSetting = async () => {
  try {
    const token = localStorage.getItem('token'); 
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }
    const response = await axios.get('http://localhost:8081/SecureLife.com/insurance-setting', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching last insurance setting:', error);
    throw error;
  }
};

export const getAllWithdrawalRequests = async () => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
          throw new UnAuthorizedError("Please login!");
      }
      const response = await axios.get('http://localhost:8081/SecureLife.com/withdrawals', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Withdrawal Requests:', error);
      throw error;
    }
  };


  export const approveWithdrawal = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.post(`http://localhost:8081/SecureLife.com/withdrawals/${id}/approve`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error approving the withdrawal!", error);
        throw error;
    }
};

export const denyWithdrawal = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.post(`http://localhost:8081/SecureLife.com/withdrawals/${id}/reject`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error rejecting the withdrawal!", error);
        throw error;
    }
};

export const approveClaim = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/claims/${id}/approve`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error approving the withdrawal!", error);
        throw error;
    }
};

export const denyClaim = async (id, headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.put(`http://localhost:8081/SecureLife.com/claims/${id}/reject`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
        console.error("There was an error rejecting the withdrawal!", error);
        throw error;
    }
};


export const getAllClaims = async () =>{
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.get('http://localhost:8081/SecureLife.com/claims', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching Claim Requests:', error);
        throw error;
      }
}

export const getAllTypes = async (params={},headers={}) =>{
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.get('http://localhost:8081/SecureLife.com/types', {
            params:params,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching insurance types:', error);
        throw error;
      }
}

export const activateType = async (typeId) =>{
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.put(`http://localhost:8081/SecureLife.com/type/${typeId}/active`, null,{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error activating insurance types:', error);
        throw error;
      }
}

export const deactivateType = async (typeId) =>{
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.delete(`http://localhost:8081/SecureLife.com/type/${typeId}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error deactivating insurance types:', error);
        throw error;
      }
}

export const addInsuranceType = async (insuranceType) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new UnAuthorizedError("Please login!");
      }
  
      const response = await axios.post('http://localhost:8081/SecureLife.com/type', insuranceType, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error adding insurance type:', error);
      throw error; 
    }
  };

  export const getSchemesByType = async (typeId, params) =>{
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.get(`http://localhost:8081/SecureLife.com/type/${typeId}/schemes`, {
            params:params,
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching Schemes by insurance types:', error);
        throw error;
      }
}

export const activateScheme = async (schemeId) =>{
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.put(`http://localhost:8081/SecureLife.com/scheme/${schemeId}/activate`, null,{
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error activating Insurance Scheme:', error);
        throw error;
      }
}

export const deactivateScheme = async (schemeId) =>{
    try {
        const token = localStorage.getItem('token'); 
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.delete(`http://localhost:8081/SecureLife.com/scheme/${schemeId}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error deactivating insurance schemes:', error);
        throw error;
      }
}

export const addInsuranceScheme = async (typeId, insuranceScheme) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new UnAuthorizedError("Please login!");
      }
  
      const response = await axios.post(`http://localhost:8081/SecureLife.com/type/${typeId}/schemes`, insuranceScheme, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error adding insurance scheme:', error);
      throw error; 
    }
  };


  export const viewInsuranceSetting = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.get('http://localhost:8081/SecureLife.com/insurance-setting', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching insurance setting');
    }
  };

  export const viewTaxSetting = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new UnAuthorizedError("Please login!");
        }
        const response = await axios.get('http://localhost:8081/SecureLife.com/tax-setting', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error fetching tax setting');
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

  export const viewClaimDocuments = async (claimId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/claims/${claimId}/documents`, {
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


  export const viewPlanByScheme = async (schemeId) =>{
    try {
      const token = localStorage.getItem('token');
      if (!token) {
          throw new UnAuthorizedError("Please login!");
      }
      const response = await axios.get(`http://localhost:8081/SecureLife.com/scheme/${schemeId}/plan`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching plan by scheme');
  }
  };

  export const updatePlanByScheme = async (schemeId, planData) =>{
    try {
      const token = localStorage.getItem('token');
      if (!token) {
          throw new UnAuthorizedError("Please login!");
      }
      const response = await axios.put(`http://localhost:8081/SecureLife.com/scheme/${schemeId}/plan`, planData ,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching plan by scheme');
  }
  }

  export const createPlanByScheme = async (schemeId, planData) =>{
    try {
      const token = localStorage.getItem('token');
      if (!token) {
          throw new UnAuthorizedError("Please login!");
      }
      const response = await axios.post(`http://localhost:8081/SecureLife.com/scheme/${schemeId}/plan`, planData ,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error fetching plan by scheme');
  }
  }


  export const downloadPolicyReport = async (customerId) => {
    try {
      const response = await axios.get(`http://localhost:8081/SecureLife.com/customers/${customerId}/policy-report/download`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        responseType: 'blob',  
      });
  
     
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
  
      
      const contentDisposition = response.headers['content-disposition'];
      let fileName = "Report" + customerId;  
  
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