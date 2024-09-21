import axios from 'axios';
import {UnAuthorizedError, ValidationError, InternalServerError, NotFoundError} from '../utils/errors/Error';

const handleErrors = (error) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 404) {
      throw new NotFoundError(error.response.data.message);
    }else if (status === 401) {
      throw new UnAuthorizedError("Unauthorized access");
    }else if (status === 500) {
      throw new InternalServerError("Internal Server Error");
    }
  }
  throw new ValidationError(error?.response?.data?.message);
};

export const verifyAdmin = async (headers = {}) => {
    if(!localStorage.getItem('token')){
        throw new UnAuthorizedError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/verify/admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
      handleErrors(error);
    }
};

export const verifyCustomer = async (headers = {}) => {
    if (!localStorage.getItem('token')) {
        throw new UnAuthorizedError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/verify/customer`, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
      handleErrors(error);
    }
};


export const verifyAgent = async (headers = {}) => {
    if (!localStorage.getItem('token')) {
        throw new UnAuthorizedError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/verify/agent`, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
      handleErrors(error);

    }
};


export const verifyEmployee = async (headers = {}) => {
    if (!localStorage.getItem('token')) {
        throw new UnAuthorizedError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/verify/employee`, {
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data;
    } catch (error) {
      handleErrors(error);
    }
};


export const loginService = async (usernameOrEmail, password) => {
    try {
      const response = await axios.post(`http://localhost:8081/SecureLife.com/login`, { usernameOrEmail, password }, {
        headers: { 'Content-Type': 'application/json' }
      });
      const token = response.headers['authorization'];

    if (token) {
      localStorage.setItem('token', token);
    }
    const data = response.data;
    data.username = usernameOrEmail;
      return data;
    } catch (error) {
      if (error.response.status === 400 && error.response.data.message === "BadCredentialsException") {
        throw new ValidationError("Invalid Credentials");
      }else if (error.response.status === 400 && error.response.data.message === "InternalAuthenticationServiceException") {
        throw new ValidationError("User not found");
      } else if(error.response.status === 401){
        throw new ValidationError("User not found");
      }
      throw new ValidationError("Internal Server Error");
    }
  };

  export const getProfile = async () => {
    if (!localStorage.getItem('token')) {
        throw new UnAuthorizedError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8081/SecureLife.com/profile/view', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      handleErrors(error);
    }
  };
  export const updateProfile = async (data) => {
    if (!localStorage.getItem('token')) {
        throw new UnAuthorizedError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:8081/SecureLife.com/profile/update', data,{
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      handleErrors(error);
    }
  };



  export const getUsername = async () =>{
    if (!localStorage.getItem('token')) {
        throw new UnAuthorizedError("User is not logged in");
    }
    const token = localStorage.getItem('token');
    try{
        const response = await axios.get('http://localhost:8081/SecureLife.com/getUsername', {
            headers: {Authorization:`Bearer ${token}`}
        });
        return response.data;
    } catch(error){
      handleErrors(error);
    }
  };



export const changePassword = async (token, changePasswordRequest) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.put('http://localhost:8081/SecureLife.com/password/change', changePasswordRequest, config);
    return response.data; 
  } catch (error) {
    handleErrors(error);
  }
  };



  
