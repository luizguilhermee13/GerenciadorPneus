import { useState, useEffect } from "react";

export function useColeta() {
  const [coletas, setColetas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar histórico ao iniciar
  useEffect(() => {
    const coletasSalvas = localStorage.getItem("coletas");
    if (coletasSalvas) {
      setColetas(JSON.parse(coletasSalvas));
    }
    setCarregando(false);
  }, []);

  const salvarColeta = (pneus) => {
    try {
      const novaColeta = {
        id: Date.now(),
        data: new Date().toLocaleDateString("pt-BR"),
        pneus: pneus,
        status: "COLETADO",
      };

      const novasColetas = [...coletas, novaColeta];
      setColetas(novasColetas);
      localStorage.setItem("coletas", JSON.stringify(novasColetas));

      return { success: true };
    } catch (error) {
      console.error("Erro ao salvar:", error);
      return { success: false, error: error.message };
    }
  };

  const removerColeta = (id) => {
    const filtradas = coletas.filter((c) => c.id !== id);
    setColetas(filtradas);
    localStorage.setItem("coletas", JSON.stringify(filtradas));
  };

  return { coletas, carregando, salvarColeta, removerColeta };
}
