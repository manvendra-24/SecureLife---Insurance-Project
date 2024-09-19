import axios from 'axios';
import {UnAuthorizedError, InvalidCredentialError, InternalServerError, NotFoundError} from '../utils/errors/Error';


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
        throw error;
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
        throw error;
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
        throw error;
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
        throw error;
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
        if(error.response && error.response.status === 400){
            throw new InvalidCredentialError("Invalid Credentials");
        }else if(error.response && error.response.status===404){
          throw new NotFoundError("User not found");
        }else {
            throw new InternalServerError("Internal Server Error");
        }
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
      throw error;
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
      throw error;
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
        throw error;
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
    throw new InternalServerError(error.response?.data?.message || 'Error changing password');  }
};



  

 