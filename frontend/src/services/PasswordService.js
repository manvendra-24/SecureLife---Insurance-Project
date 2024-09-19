import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/SecureLife.com';
const PasswordService = {
  requestOtp: async (usernameOrEmail) => {
    console.log(usernameOrEmail);
     
    try {
      const response = await axios.post(`${API_BASE_URL}/otp/send`, { usernameOrEmail });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message ||'Error sending OTP');
    }
  },

  verifyOtp: async (otp) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/otp/verify`, { otp });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error verifying OTP');
    }
  },

  setNewPassword: async (usernameOrEmail,newPassword,confirmPassword) => {

    try {
      const response = await axios.put(`${API_BASE_URL}/password/reset`,{usernameOrEmail,newPassword,confirmPassword});
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error resetting password');
    }
  }
};

export default PasswordService;