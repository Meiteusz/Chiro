import axios from "axios";

const BASE_URL =
  process.env.REACT_APP_BASE_URL || `http://localhost:5220/api/v1`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTk1Mzg0MTgsImlzcyI6ImRpc3BvQGdtYWlsLmNvbSIsImF1ZCI6ImRpc3BvQGdtYWlsLmNvbSJ9.lwdPf0Ek5qGpX-p2lRiTR9wUfijgL7cxBBDyrArRUv8`
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
