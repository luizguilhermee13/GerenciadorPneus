// Funções de formatação e busca de valores fixos
export function obterPrecoPorMedida(medida, motivo = "REFORMA") {
  // REGRA NOVA: Se for conserto, o valor é fixo em 100 independente da medida
  if (motivo === "CONSERTO") {
    return 100.0;
  }
  const precos = {
    "275/80R22.5": 525.0,
    "295/80R22.5": 525.0,
    "215/75R17.5": 365.0,
  };
  return precos[medida] || 0;
}

export function formatarMoeda(valor) {
  if (!valor && valor !== 0) return "R$ 0,00";
  const numero = typeof valor === "string" ? parseFloat(valor) : valor;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numero);
}

export function formatarData(data) {
  if (!data) return "";
  const date = new Date(data);
  return isNaN(date.getTime()) ? data : date.toLocaleDateString("pt-BR");
}
