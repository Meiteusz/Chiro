import axios from "axios";
import { jwtDecode } from 'jwt-decode';

import { getCookie } from "@/data/cookies";
import cookiesKeys from "@/data/keys";

//const BASE_URL = process.env.REACT_APP_BASE_URL || `https://localhost:7170/api/v1`;
const BASE_URL = "http://159.203.158.248:8080/api/v1";
const TIME_OUT = 10000;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = getCookie(cookiesKeys.token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  error => {
    console.log(error);
    //var a = getCookie(cookiesKeys.token);
    //var isValidToken = jwtDecode(a);
    
    //window.location.href = "/auth";
    //return Promise.reject(error);
  }
);

const useGet = async (url, config = {}) => {
  return apiClient.get(url, config); 
};

const useDelete = (url, config = {}) => {
  return apiClient.delete(url, config);
};

const usePut = (url, data = {}, config = {}) => {
  return apiClient.put(url, data, config);
};

const usePost = (url, data = {}, config = {}) => {
  return apiClient.post(url, data, config);
};

export { useGet, useDelete, usePut, usePost };
