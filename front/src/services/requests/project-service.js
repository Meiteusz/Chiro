import { ENDPOINTS } from "../endpoints";
import { usePost, useGet, useDelete } from "../api-client";

const create = async (data) => {
  try {
    const response = await usePost(ENDPOINTS.project.base, data);
    if (response && response.data) {
      return response.data.toString();
    }

    console.error("Criação de Project falhou:", error);
  } catch (error) {
    console.error("Criação de Project falhou:", error);
  }

  return "";
};

const getAll = async () => {
  try {
    return await useGet(ENDPOINTS.project.base);
  } catch (error) {
    console.error("Busca de Project falhou:", error);
  }
};

const getById = async (id) => {
  try {
    return await useGet(ENDPOINTS.project.getById(id));
  } catch (error) {
    console.error("Busca por Id de Project falhou:", error);
  }
};

const resize = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.resize, data);
  } catch (error) {
    console.error("Redimensionamento de Project falhou:", error);
  }
};

const move = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.move, data);
  } catch (error) {
    console.error("Movimentação de Project falhou:", error);
  }
};

const changeColor = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.changeColor, data);
  } catch (error) {
    console.error("Mudança de Cor de Project falhou:", error);
  }
};

const deleteAsync = async (id) => {
  try {
    return await useDelete(ENDPOINTS.project.delete(id));
  } catch (error) {
    console.error("Mudança de Cor de Project falhou:", error);
  }
};

const changeName = async (data) => {
  try {
    return await usePost(ENDPOINTS.project.changeName, data);
  } catch (error) {
    console.error("Redimensionamento de Project falhou:", error);
  }
};

export default { create, getAll, getById, resize, move, changeColor, deleteAsync, changeName };
