import axios from "axios";
import React from "react";
import { BASEURL } from "../api/BASEURL";

export default function usePlanQuery() {
  const [isLoading, setIsLoading] = React.useState(false);
  const baseUrl = BASEURL;

  const getToken = () => {
    return localStorage.getItem("token");
  };  

  // Function to make the request with token in the header
  const makeRequest = async (url) => {
    setIsLoading(true);
    try {
      const token = getToken(); // Retrieve the token
      const response = await axios.get(`${baseUrl}${url}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      console.log("Response :", response.data.data);
      return response?.data?.data;
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const credsCount = async () => makeRequest("/comment/count");

  return { credsCount, isLoading };
}
