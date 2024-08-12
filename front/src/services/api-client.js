import axios from "axios";
import { getCookie } from "@/data/cookies";
import cookiesKeys from "@/data/keys";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || `https://localhost:7170/api/v1`;

const apiClient = axios.create({
  baseURL: BASE_URL,
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
  (error) => {
    window.location.href = "/auth";
    return Promise.reject(error);
  }
);

const useGet = (url, config = {}) => {
  try {
    return apiClient.get(url, config);
  } catch (error) {
    console.log(error);    
  }
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
