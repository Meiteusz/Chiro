import React, { createContext, useState, useContext } from "react";
import APIUnavailable from "@/pages/error-network/index";
import { Error } from "@/utils/constants";
const ErrorNetworkContext = createContext();

export const ErrorNetworkProvider = ({ children }) => {
  const [errorNetwork, setErrorNetwork] = useState(false);
  return (
    <ErrorNetworkContext.Provider value={{ errorNetwork, setErrorNetwork }}>
      {errorNetwork === (Error.Err_Network || Error.Err_Connection_Refused) ? (
        <APIUnavailable />
      ) : (
        children
      )}
    </ErrorNetworkContext.Provider>
  );
};

export const useError = () => {
  return useContext(ErrorNetworkContext);
};
