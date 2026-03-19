import axios from 'axios';

/**
 * Function to make a GET request
 * @param {string} url - The URL to send the GET request to
 * @param {Object} config - Axios configuration (headers, params, etc.)
 * @returns {Promise<Object>} - Axios response
 */
export const axiosGet = async (url, config = {}) => {
  return await axios.get(url, config);
};

/**
 * Function to make a POST request
 * @param {string} url - The URL to send the POST request to
 * @param {Object|string|FormData} data - Data payload for the POST request
 * @param {Object} config - Axios configuration (headers, params, etc.)
 * @returns {Promise<Object>} - Axios response
 */
export const axiosPost = async (url, data, config = {}) => {
  return await axios.post(url, data, config);
};

/**
 * Function to make a PUT request
 * @param {string} url - The URL to send the PUT request to
 * @param {Object} data - Data payload for the PUT request
 * @param {Object} config - Axios configuration (headers, params, etc.)
 * @returns {Promise<Object>} - Axios response
 */
export const axiosPut = async (url, data, config = {}) => {
  return await axios.put(url, data, config);
};

/**
 * Function to make a PATCH request
 * @param {string} url - The URL to send the PATCH request to
 * @param {Object} data - Data payload for the PATCH request
 * @param {Object} config - Axios configuration (headers, params, etc.)
 * @returns {Promise<Object>} - Axios response
 */
export const axiosPatch = async (url, data, config = {}) => {
  return await axios.patch(url, data, config);
};

/**
 * Function to make a DELETE request
 * @param {string} url - The URL to send the DELETE request to
 * @param {Object} config - Axios configuration (headers, params, etc.)
 * @returns {Promise<Object>} - Axios response
 */
export const axiosDelete = async (url, config = {}) => {
  return await axios.delete(url, config);
};
