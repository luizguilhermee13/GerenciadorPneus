import api from "./api";

export const carroService = {
  async getAll() {
    try {
      // Buscamos todos os carros ordenados pelo número
      const response = await api.get("/carros?select=*&order=numero_carro.asc");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar carros:", error);
      throw error;
    }
  },
};
