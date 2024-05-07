"use client";

import React, { useState } from "react";
import styles from "./styles.module.css";
import "./styles.css"

const ProjectBoard = () => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value); 
  };

  const handleButtonClick = () => {
    console.log("Botão clicado!");
  };

  return (
    <div>
      <div className={styles.container}>
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Informe o token de autenticação aqui..."
            className={styles.inputField}
          />
        </div>        
        <div>
          <button className={styles.button} onClick={handleButtonClick}>
            Autenticar
          </button>
        </div> 
      </div>  
    </div>    
  );
};

export default ProjectBoard;
