import { ENDPOINTS } from "../endpoints";
import { usePost, useGet } from "./api-client";

const create = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.base, data);
  } catch (error) {
    console.error("Criação de Project falhou:", error);
    throw error;
  }
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

export default { create, getAll, getById, resize, move, changeColor };
