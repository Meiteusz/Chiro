import { ENDPOINTS } from "../endpoints";
import { usePost, useDelete } from "@/services/api-client";

const create = async (data) => {
  try {
    const response = await usePost(ENDPOINTS.boardAction.base, data);
    if (response && response.data) {
      return response.data.toString();
    }

    console.error("Criação de Board-Action falhou:", error);
  } catch (error) {
    console.error("Criação de Board-Action falhou:", error);
  }

  return "";
};

const changeColor = async (data) => {
  try {
    return await usePost(ENDPOINTS.boardAction.changeColor, data);
  } catch (error) {
    console.error("Mudança de Cor de Board-Action falhou:", error);
    throw error;
  }
};

const resize = async (data) => {
  try {
    return await usePost(ENDPOINTS.boardAction.resize, data);
  } catch (error) {
    console.error("Redimensionamento de Board-Action falhou:", error);
    throw error;
  }
};

const move = async (data) => {
  try {
    return await usePost(ENDPOINTS.boardAction.move, data);
  } catch (error) {
    console.error("Movimento de Board-Action falhou:", error);
    throw error;
  }
};

const changePeriod = async (data) => {
  try {
    return await usePost(ENDPOINTS.boardAction.changePeriod, data);
  } catch (error) {
    console.error("Mundança de Período de Board-Action falhou:", error);
    throw error;
  }
};

const conclude = async (data) => {
  try {
    return await usePost(ENDPOINTS.boardAction.conclude, data);
  } catch (error) {
    console.error("Conclusão de Board-Action falhou:", error);
    throw error;
  }
};

const link = async (data) => {
  try {
    return await usePost(ENDPOINTS.boardAction.link, data);
  } catch (error) {
    console.error("Vínculo de Board-Action falhou:", error);
    throw error;
  }
};

const deleteAsync = async (id) => {
  try {
    return await useDelete(ENDPOINTS.boardAction.delete(id));
  } catch (error) {
    console.error("Mudança de Cor de Project falhou:", error);
  }
};

const changeContent = async (data) => {
  try {
    return await usePost(ENDPOINTS.boardAction.changeContent, data);
  } catch (error) {
    console.error("Redimensionamento de Project falhou:", error);
  }
};

export default {
  create,
  changeColor,
  resize,
  move,
  changePeriod,
  conclude,
  link,
  deleteAsync,
  changeContent
};
