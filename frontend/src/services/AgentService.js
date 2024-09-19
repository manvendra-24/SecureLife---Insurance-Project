import axios from 'axios';
import { UnAuthorizedError} from '../utils/errors/Error';

export const getMyClients = async ( params={},headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/mycustomers`, {
            params:params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error getting clients of agent!", error);
        throw error;
    }
};

export const getAllCitiesList = async () =>{
    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/allcities`, {
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error getting all cities!", error);
        throw error;
    }
}

export const getMyCommissions = async ( params={},headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/mycommissions`, {
            params:params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error getting commissions of agent!", error);
        throw error;
    }
};

export const getMyWithdrawals = async ( params={},headers = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new UnAuthorizedError("Please login!");
    }

    try {
        const response = await axios.get(`http://localhost:8081/SecureLife.com/mywithdrawals`, {
            params:params,
            headers: {
                Authorization: `Bearer ${token}`,
                ...headers
            }
        });
        return response.data; 
    } catch (error) {
        console.error("There was an error getting withdrawals of agent!", error);
        throw error;
    }
};


