import axios from "axios"

import API_RESPONSE from "./api_response";
import browserStorageKeys from "@/data/browserStorageKeys";
import { LOCALHOST } from "./endpoints";

const BASE_URL = LOCALHOST;
const TIME_OUT = 10000;

const callApi = async (endpoint, method, data = null, contentType = "application/json") => {
  
  const apiConfig = axios.create({
    baseURL: BASE_URL,
    timeout: TIME_OUT,
    headers: {
      "Content-Type": contentType,
      //Authorization: `Bearer ${getToken()}`
    }
  });
  
  try {
    const response = await apiConfig({
      url: endpoint,
      method: method,
      data: data
    });

    return API_RESPONSE(
      response.data.data,
      "",
      response.data.message,
      response.data.success,
      response.status
    );

  } catch (error) {
    if(error.response.status === 401){

      localStorage.setItem(browserStorageKeys.LastAccessedUrl, indow.location.pathname);
      window.location.replace("/login/signin");
    }

    if(error.code && error.code === "ERR_NETWORK"){

      window.location.replace("/404");
    } else if (error.response) {

      var errorMessage = (error.response.data.message != null && error.response.data.message !== "") ? error.response.data.message : error.response.data.title;
      var successMessage = (error.response.data.success != null && error.response.data.success !== "") ? error.response.data.success : error.response.status >= 400 ? false : true;

      return API_RESPONSE(
        error.response.data,
        `${error.name} ${error.message}`,
        errorMessage,
        successMessage,
        error.response.status
      );

    } else if (error.request) {

      return API_RESPONSE(
        null,
        "Erro ao receber resposta",
        "Requisição foi feita com sucesso mas nenhuma resposta foi recebida",
        false,
        400
      );

    } else {

      return API_RESPONSE(
        null,
        error.name,
        error.message,
        false,
        400
      );

    }
  }
};


export { callApi };