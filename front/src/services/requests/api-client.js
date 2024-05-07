import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || `https://localhost:7170/api/v1`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const useGet = (url, config = {}) => {
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
