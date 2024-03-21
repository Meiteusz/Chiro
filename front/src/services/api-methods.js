import { useState } from "react";
import { callApi } from "./api-service"
import API_RESPONSE from "./api_response";

function joinParameters(endpoint, parameters){

  if(parameters == null || parameters === undefined){
    return endpoint;
  } 

  var lastIndex = endpoint.lastIndexOf("/");

  if (lastIndex !== -1) {
    endpoint = endpoint.substring(0, lastIndex + 1);
  }

  if (typeof parameters === "number") {
      return `${endpoint}${parameters}`;
  }

  if (parameters && parameters.length > 0) {
      for (var i = 0; i < parameters.length; i++) {
          endpoint += encodeURIComponent(parameters[i].key) + "=" + encodeURIComponent(parameters[i].value);
        if (i !== parameters.length - 1) {
          endpoint += "&";
        }
      }
  }
  
  return endpoint;
}

async function get(endpoint, parameters) {

  if(parameters == null || parameters === undefined){
      return await callApi(endpoint, 'get');
  }

  endpoint = joinParameters(endpoint, parameters);
  return await callApi(endpoint, 'get');
}

async function post(endpoint, data, contentType){
  return await callApi(endpoint, 'post', data, contentType);
}

async function put(endpoint, id, data) {

  if(id <= 0){    
      return API_RESPONSE(
          null,
          'Id Inválido',
          'Parâmetro ID deve ser informado!',
          false,
          'error',
          400
      );
  }

  endpoint = joinParameters(endpoint, id);
  return await callApi(endpoint, 'put', data);
}

async function remove(endpoint, id) {

  if(id <= 0){
      return API_RESPONSE(
          null,
          'Id Inválido',
          'Parâmetro ID deve ser informado!',
          false,
          'error',
          400
      );
  }

  endpoint = joinParameters(endpoint, id);
  return await callApi(endpoint, 'delete');
}

const useGet = async (endpoint, parameters) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = async () => {
    try {
      setIsLoading(true);
      const response = await get(endpoint, parameters);
      setData(response);
      return response;
    } catch (e) {
      setError(e);
      setIsLoading(false);
      throw e;
    }
  };

  return {
    isLoading,
    error,
    data,
    execute,
  };
}

const usePost = async (endpoint, requestData, contentType) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  const execute = async () => {
    try {
      setIsLoading(true);
      const response = await post(endpoint, requestData, contentType);
      setData(response);
      return response;
    } catch (e) {
      setError(e);
      setIsLoading(false);
      throw e;
    }
  };
  
  return {
    isLoading,
    error,
    data,
    execute,
  };
}

const usePut = async (endpoint, id, requestData) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  const execute = async () => {
    try {
      setIsLoading(true);
      const response = await put(endpoint, id, requestData);
      setData(response);
      return response;
    } catch (e) {
      setError(e);
      setIsLoading(false);
      throw e;
    }
  };
  
  return {
    isLoading,
    error,
    data,
    execute,
  };
}

const useDelete = async (endpoint, id) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    
    const execute = async () => {
      try {
        setIsLoading(true);
        const response = await remove(endpoint, id, data);
        setData(response);
        return response;
      } catch (e) {
        setError(e);
        setIsLoading(false);
        throw e;
      }
    };
    
    return {
      isLoading,
      error,
      data,
      execute,
    };
  }

export { useGet, usePost, usePut, useDelete };