import { ENDPOINTS } from "../endpoints";
import { usePost } from "./api-client";

const create = async (data) => {
  try {
    return await usePost(ENDPOINTS.boardAction.base, data);
  } catch (error) {
    console.error("Criação de Board-Action falhou:", error);
    throw error;
  }
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

export default {
  create,
  changeColor,
  resize,
  move,
  changePeriod,
  conclude,
  link,
};
