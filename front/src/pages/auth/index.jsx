"use client";

import React, { useState } from "react";

import "./styles.css";
import "@/app/globals.css";

const AuthScreen = () => {
  const [tokenValue, setTokenValue] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    setTokenValue(event.target.value);
  };

  const handleButtonClick = () => {
    if (tokenValue != "123") {
      setError("Token inválido.");
    } else {
      window.location.href = "http://localhost:3000/";
      setError(null);
    }
  };

  return (
    <div className="container-background">
      <div className="container-auth">
        <div>
          <input
            className="token-field"
            type="password"
            value={tokenValue}
            onChange={handleInputChange}
            placeholder="Informe o token"
          />
        </div>
        <div>
          <button className="button-auth" onClick={handleButtonClick}>
            Autenticar
          </button>
          {error && (
            <div className="auth-error-message">
              <label>{error}</label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
