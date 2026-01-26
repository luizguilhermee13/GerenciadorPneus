import React, { useState, useEffect } from "react";

function PneusEntregues() {
  const [entregues, setEntregues] = useState([]);
  const [filtroData, setFiltroData] = useState("");

  // Funções de formatação internas para evitar erros de import
  const formatarMoeda = (valor) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valor || 0);

  const formatarData = (data) => {
    if (!data) return "---";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("pneusEntregues") || "[]");
    const dadosOrdenados = dados.sort(
      (a, b) => new Date(b.dataEntrega) - new Date(a.dataEntrega),
    );
    setEntregues(dadosOrdenados);
  }, []);

  const pneusFiltrados = filtroData
    ? entregues.filter((p) => p.dataEntrega === filtroData)
    : entregues;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            🚚 Histórico de Pneus Entregues
          </h1>
          <p className="text-gray-600 text-sm">
            Pneus que já retornaram da reformadora
          </p>
        </div>

        <div className="bg-white p-3 rounded-lg shadow-sm border flex items-center gap-3">
          <label className="text-xs font-bold text-gray-500 uppercase">
            Filtrar Data:
          </label>
          <input
            type="date"
            className="outline-none text-sm font-semibold"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
          {filtroData && (
            <button
              onClick={() => setFiltroData("")}
              className="text-red-500 text-xs font-bold underline"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      {pneusFiltrados.length === 0 ? (
        <div className="bg-white p-10 rounded-xl text-center border-2 border-dashed border-gray-300 text-gray-400">
          Nenhum registro encontrado.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Entrega
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Nº Fogo
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Medida
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                  Origem
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase">
                  Valor
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pneusFiltrados.map((pneu, idx) => (
                <tr key={idx} className="hover:bg-blue-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">
                    {formatarData(pneu.dataEntrega)}
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-red-600">
                    {pneu.numeroFogo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {pneu.medida}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 italic">
                    #{pneu.numeroNota}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-green-700">
                    {formatarMoeda(pneu.preco)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-green-100 text-green-800 text-[10px] font-black px-2 py-1 rounded-full uppercase">
                      Entregue
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PneusEntregues;
