import { ENDPOINTS } from "../endpoints";
import { usePost, useGet, useDelete } from "@/services/api-client";

function generateRandomNumber() {
  // Gera um número aleatório entre 0 e 999999 (inclusive)
  const randomNumber = Math.floor(Math.random() * 1000000); // Gera números de 0 a 999999

  // Formata o número para ter exatamente 6 dígitos
  const formattedNumber = randomNumber.toString().padStart(6, '0');

  return formattedNumber;
}

const create = async (data) => {
  try {
    const response = await usePost(ENDPOINTS.project.base, data);
    if (response && response.data) {
      return response.data.toString();
    }
  } catch (error) {
    console.error("Criação de Project falhou:", error);
    throw error;
  }

  return "";
};

const getAll = async () => {
  try {
    return await useGet(ENDPOINTS.project.base);
  } catch (error) {
    console.error("Busca de Project falhou:", error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    return await useGet(ENDPOINTS.project.getById(id));
  } catch (error) {
    console.error("Busca por Id de Project falhou:", error);
    throw error;
  }
};

const resize = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.resize, data);
  } catch (error) {
    console.error("Redimensionamento de Project falhou:", error);
    throw error;
  }
};

const move = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.move, data);
  } catch (error) {
    console.error("Movimentação de Project falhou:", error);
    throw error;
  }
};

const changeColor = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.changeColor, data);
  } catch (error) {
    console.error("Mudança de Cor de Project falhou:", error);
    throw error;
  }
};

const deleteAsync = async (id) => {
  try {
    return await useDelete(ENDPOINTS.project.delete(id));
  } catch (error) {
    console.error("Mudança de Cor de Project falhou:", error);
    throw error;
  }
};

const changeName = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.changeName, data);
  } catch (error) {
    console.error("Redimensionamento de Project falhou:", error);
    throw error;
  }
};

const getTimelineConfiguration = async (id) => {
  try {
    return await useGet(ENDPOINTS.project.getTimelineConfiguration(id));
  } catch (error) {
    console.error("Busca das configurações da timeline falhou:", error);
    throw error;
  }
}

const getProjectName = async (id) => {
  try {
    return await useGet(ENDPOINTS.project.getName(id));
  } catch (error) {
    console.error("Busca do nome do projeto falhou:", error);
    throw error;
  }
}

const getEncryptProjectId = async (projectId) => {
  try {
    return await useGet(ENDPOINTS.project.getEncryptProjectId(projectId, generateRandomNumber()));
  } catch (error) {
    console.error("Falha ao encriptar o ID do projeto:", error);
  }
}

const getDecryptProjectId = async (token) => {
  try {
    return await useGet(ENDPOINTS.project.getDecryptProjectId(token));
  } catch (error) {
    console.error("Falha ao descriptografar o ID do projeto:", error);
  }
}

export default { create,
                 getAll, 
                 getById, 
                 resize, 
                 move, 
                 changeColor, 
                 deleteAsync, 
                 changeName, 
                 getTimelineConfiguration, 
                 getProjectName,
                 getEncryptProjectId,
                 getDecryptProjectId };

