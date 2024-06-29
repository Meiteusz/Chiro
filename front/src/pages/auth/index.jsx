"use client";

import React, { useState } from "react";
import { useRouter } from "next/router";

import ProjectService from "@/services/requests/auth-service";
import cookiesKeys from "@/data/keys";
import { setCookie } from "@/data/cookies";

import "@/app/globals.css";
import "./styles.css";

const AuthScreen = () => {
  const [tokenValue, setTokenValue] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (event) => {
    setTokenValue(event.target.value);
  };

  const handleButtonClick = async () => {
    // Chamada do endpoint

    var token = await ProjectService.authenticate({ token: "123" });

    if ((token && token.data) != undefined) {
      setError(null);
      setCookie(cookiesKeys.token, token.data);
      router.push("/projects");
    } else {
      setError("Token inválido.");
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
