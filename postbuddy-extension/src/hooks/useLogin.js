import axios from "axios";
import React from "react";
import { BASEURL } from "../api/BASEURL";

export default function useLoginMutation() {
  const [isLoading, setIsLoading] = React.useState(false);
  const baseUrl = BASEURL;

  const makeRequest = async (url, data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}${url}`, data);
      
      console.log("Response :", response.data);

      const check = response.data.data;

      if (check.purpose === "login" || check.purpose === "register") {
        localStorage.setItem('purpose', check.purpose);
        localStorage.setItem('verified', check.isVerified);
        return check
      }

      return response?.data?.data;
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const resentOtp = async ({ email }) => makeRequest("/user/loginWithOtp", { email })

  const sendOtp = async ({ email }) => makeRequest("/user/loginWithOtp", { email });

  const verifyOtp = async ({ email, otp, fullName }) =>
    makeRequest("/user/verifyOtp", { email, code: otp, fullName });

  return { sendOtp, verifyOtp, resentOtp, isLoading };
}
