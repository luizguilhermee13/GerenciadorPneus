// Validações baseadas nos novos parâmetros técnicos
export function validarDadosColeta(dados) {
  const erros = [];

  dados.forEach((pneu, index) => {
    const numPneu = index + 1;

    // Número do fogo: agora flexível, mas obrigatório
    if (!pneu.numeroFogo || pneu.numeroFogo.trim() === "") {
      erros.push(`Pneu ${numPneu}: Número do fogo é obrigatório.`);
    }

    // Modelo: obrigatório para evitar banco de dados vazio
    if (!pneu.modelo || pneu.modelo.trim() === "") {
      erros.push(`Pneu ${numPneu}: O modelo deve ser informado.`);
    }

    // DOT: Validar exatamente 4 dígitos
    if (pneu.dot && !/^\d{4}$/.test(pneu.dot.trim())) {
      erros.push(`Pneu ${numPneu}: DOT deve ter exatamente 4 dígitos.`);
    }

    // Preço: Garante que não salve com valor zero
    if (!pneu.preco || pneu.preco <= 0) {
      erros.push(`Pneu ${numPneu}: Preço inválido para a medida selecionada.`);
    }
  });

  return erros;
}

export function validarDOT(dot) {
  return /^\d{4}$/.test(dot?.trim());
}
