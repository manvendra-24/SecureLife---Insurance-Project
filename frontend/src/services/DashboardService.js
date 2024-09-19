import axios from 'axios';

const BASE_URL = 'http://localhost:8081/SecureLife.com'; 

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getTotalAdmins = async () => {
  try {
    const response = await api.get('/dashboard/total-admins');
    return response.data;
  } catch (error) {
    console.error('Error fetching total admins:', error);
    throw error;
  }
};

export const getTotalAgents = async () => {
  try {
    const response = await api.get('/dashboard/total-agents');
    return response.data;
  } catch (error) {
    console.error('Error fetching total agents:', error);
    throw error;
  }
};

export const getTotalCustomers = async () => {
  try {
    const response = await api.get('/dashboard/total-customers');
    return response.data;
  } catch (error) {
    console.error('Error fetching total customers:', error);
    throw error;
  }
};

export const getTotalEmployees = async () => {
  try {
    const response = await api.get('/dashboard/total-employees');
    return response.data;
  } catch (error) {
    console.error('Error fetching total employees:', error);
    throw error;
  }
};

export const getSoldPolicies = async () => {
  try {
    const response = await api.get('/dashboard/total-sold-policies');
    return response.data;
  } catch (error) {
    console.error('Error fetching sold policies:', error);
    throw error;
  }
};
export const getCancelledPolicies = async () => {
  try {
    const response = await api.get('/dashboard/total-cancelled-policies');
    return response.data;
  } catch (error) {
    console.error('Error fetching cancelled policies:', error);
    throw error;
  }
};

export const getCommission = async () => {
  try {
    const response = await api.get('/dashboard/total-commissions');
    return response.data;
  } catch (error) {
    console.error('Error fetching total commission:', error);
    throw error;
  }
};

export const getPenalty = async () => {
  try {
    const response = await api.get('/dashboard/total-penalty');
    return response.data;
  } catch (error) {
    console.error('Error fetching total penalty:', error);
    throw error;
  }
};




