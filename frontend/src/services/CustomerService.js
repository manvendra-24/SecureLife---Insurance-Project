import axios from 'axios';
import { NotFoundError, UnAuthorized, ValidationError, InternalServerError } from '../utils/errors/Error';

const getToken = () => localStorage.getItem('token');

const handleErrors = (error) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 404) {
      throw new NotFoundError("Service not found");
    } else if (status === 401) {
      throw new UnAuthorized("Unauthorized access");
    } else if (status === 400) {
      throw new ValidationError("Invalid data provided");
    } else if (status === 500) {
      throw new InternalServerError("Internal server error");
    }
  }
  throw new ValidationError("An error occurred while processing your request");
};

export const submitCustomerQuery = async (queryDetails, headers = {}) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.post(
      'http://localhost:8081/SecureLife.com/queries/ask',
      queryDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          ...headers,
        },
      }
    );
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getAllQueries = async (page, size,searchquery) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get('http://localhost:8081/SecureLife.com/queries', {
      params: { page, size,searchquery},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const submitQueryResponse = async (queryId, responseBody) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.post(`http://localhost:8081/SecureLife.com/query/${queryId}/response`, responseBody, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getMyPolicies = async (params) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get('http://localhost:8081/SecureLife.com/mypolicies', {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const submitClaim = async (policyId, claimRequest) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.post(
      `http://localhost:8081/SecureLife.com/policies/${policyId}/claim`,
      claimRequest,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    handleErrors(error);
  }
};

export const uploadDocument = async (documentType, file) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);

    const response = await axios.post('http://localhost:8081/SecureLife.com/document/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    handleErrors(error);
  }
};

export const submitWithdrawalRequest = async (policyId) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.post(
      `http://localhost:8081/SecureLife.com/policy/${policyId}/withdrawal`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    handleErrors(error);
  }
};

export const getPolicyById = async (policyId) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/mypolicy/${policyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getTransactionsByPolicyId = async (policyId) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/transactions/${policyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const calculateTotalPaymentAmount = async (installmentAmount) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/calculate-total`, {
      params: { installmentAmount },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const processPayment = async (paymentRequestDto) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.put(
      'http://localhost:8081/SecureLife.com/process',
      paymentRequestDto,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const downloadReceipt = async (transactionId) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/transaction/${transactionId}/receipt/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `receipt_${transactionId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    handleErrors(error);
  }
};

export const getTransactionsWithParamsByPolicyId = async (policyId, params) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/transactions-with-params/${policyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getAllInsuranceTypes = async () => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get('http://localhost:8081/SecureLife.com/types', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getInsuranceSchemesByTypeId = async (typeId, page = 0, size = 5, sortBy = 'insuranceSchemeId', direction = 'asc', searchQuery = '') => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/type/${typeId}/schemes`, {
      params: { page, size, sortBy, direction, searchQuery },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const getInsurancePlanBySchemeId = async (schemeId) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.get(`http://localhost:8081/SecureLife.com/schemes/${schemeId}/plans`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};

export const registerPolicy = async (policyRequest) => {
  const token = getToken();
  if (!token) throw new UnAuthorized("User is not logged in");

  try {
    const response = await axios.post('http://localhost:8081/SecureLife.com/policies/register', policyRequest, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleErrors(error);
  }
};
