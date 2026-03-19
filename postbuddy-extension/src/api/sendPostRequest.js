import axios from "axios";
import * as BASEURL from '../api/BASEURL.js'

export default async function sendPostRequest(postData, endPoint, token) {
  let response;
  const data = JSON.stringify(postData);

  await fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${token}`,
    },
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log('Response from API:', data.data);
      response = data;
    })
    .catch((error) => console.error("Error:", error));

  return response;
}

export async function botPostRequest(data, endPoint, token) {
  let response;
  await fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      response = result;
    })
    .catch((error) => console.error("Error:", error));
  return response;
}

export async function chatPostRequest(data, endPoint, token) {
  try {
    // Make the API request
    const response = await fetch(endPoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // Check if the response is ok
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    // Parse the response
    const responseData = await response.json();

    // Return successful response
    return {
      success: true,
      data: responseData,
      status: response.status,
    };
  } catch (error) {
    console.error("Error in chat post request:", error);

    // Return error response
    return {
      success: false,
      error: error || "An unknown error occurred",
      status: error.status || 500,
    };
  }
}

export async function recreatePostRequest(data, endPoint, token) {
  let response;
  await fetch(endPoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      response = data;
    })
    .catch((error) => console.error("Error:", error));
  return response;
}

export async function fixGrammar(body) {
  const { text, token } = body;
  const response = await axios.post(`${BASEURL.BASEURL}/comment/fixGrammar`, { text }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
}
