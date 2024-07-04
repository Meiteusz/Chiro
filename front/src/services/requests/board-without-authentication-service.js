import { ENDPOINTS } from "../endpoints";
import { useGet } from "./api-client";

function generateRandomNumber() {
  // Gera um número aleatório entre 0 e 999999 (inclusive)
  const randomNumber = Math.floor(Math.random() * 1000000); // Gera números de 0 a 999999

  // Formata o número para ter exatamente 6 dígitos
  const formattedNumber = randomNumber.toString().padStart(6, '0');

  return formattedNumber;
}

const createLink = async (projectId) => {
    try {
      const response = await useGet(ENDPOINTS.boardWithoutAuthentication.createLink(projectId, generateRandomNumber()));
      const url = response.data;
      return url;
    } catch (error) {
      console.error("Não foi possível criar o link:", error);
    }
};

const getProjectWithToken = async (token) => {
  try {
    const response = await useGet(ENDPOINTS.boardWithoutAuthentication.getProjectWithToken(token));
    const projectId = response.data;
    
    return projectId;
  } catch (error) {
    console.error("Não foi possível recuperar o ID do projeto:", error);
  }
};

export default { createLink, getProjectWithToken };