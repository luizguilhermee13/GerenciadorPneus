import api from "./api";

export const pneuService = {
  /**
   * BUSCA A LISTA COMPLETA
   * Alterado para buscar da tabela 'pneus_nos_carros' que contém as
   * movimentações reais da planilha Ansal Pneus Automatização.
   */
  async getAll() {
    try {
      // Ordenamos por pneu_fogo para evitar saltos na lista
      const response = await api.get(
        "/pneus_nos_carros?select=*&order=pneu_fogo.asc",
        {
          headers: {
            Range: "0-1000", // Reduzi para 1000 para melhorar a velocidade inicial
            Prefer: "count=exact",
          },
        },
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pneus:", error);
      throw error;
    }
  },

  /**
   * BUSCA PNEUS POR EMPRESA (Evita o erro de dados trocados entre 27, 28 e 77)
   */
  async getByEmpresa(empresaId) {
    try {
      const response = await api.get(
        `/pneus_nos_carros?empresa=eq.${empresaId}&select=*`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao filtrar por empresa:", error);
      return [];
    }
  },

  /**
   * RETORNA APENAS O NÚMERO TOTAL (Essencial para o dashboard)
   */
  async getContagem() {
    try {
      const response = await api.get("/pneus_nos_carros?select=pneu_fogo", {
        headers: { Prefer: "count=exact", Range: "0-0" },
      });
      const range = response.headers["content-range"];
      return range ? parseInt(range.split("/")[1]) : 0;
    } catch (error) {
      console.error("Erro na contagem:", error);
      return 0;
    }
  },

  /**
   * BUSCA PNEUS INSTALADOS EM UM CARRO ESPECÍFICO
   */
  async getByCarro(numeroCarro) {
    try {
      const response = await api.get(
        `/pneus_nos_carros?carro=eq.${numeroCarro}&select=*`,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar pneus do carro:", error);
      return [];
    }
  },

  /**
   * ATUALIZA DADOS DO PNEU (Baseado na chave composta Empresa + Fogo)
   */
  async update(empresa, pneuFogo, dados) {
    try {
      const response = await api.patch(
        `/pneus_nos_carros?empresa=eq.${empresa}&pneu_fogo=eq.${pneuFogo}`,
        dados,
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar pneu:", error);
      throw error;
    }
  },
};
