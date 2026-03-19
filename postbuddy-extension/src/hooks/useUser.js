import axios from "axios";
import React from "react";
import { BASEURL } from "../api/BASEURL";

export default function useGetUser() {
  const [isLoading, setIsLoading] = React.useState(false);
  const baseUrl = BASEURL;

  const makeRequest = async (url) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.get(`${baseUrl}${url}`, { headers });
      console.log("User ==> ", response?.data?.data);

      return response?.data?.data;
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getUser = async () => makeRequest("/user");

  return { getUser, isLoading };
}
