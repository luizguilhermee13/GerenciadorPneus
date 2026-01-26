import { useState, useEffect } from "react";
import { formatarMoeda } from "./utils/formatadores";

function HistoricoPneusRef() {
  const [historico, setHistorico] = useState([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    const coletas = JSON.parse(localStorage.getItem("coletas") || "[]");
    const todosPneus = coletas.flatMap((c) =>
      c.pneus.map((p) => ({ ...p, data: c.data, status: "Concluído" })),
    );
    setHistorico(todosPneus);
  }, []);

  const pneusFiltrados = historico.filter((p) => p.numeroFogo.includes(busca));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📜 Histórico Individual de Pneus
      </h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Buscar por Nº Fogo..."
            className="flex-1 border p-2 rounded"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Data</th>
              <th className="px-4 py-3 text-left">Nº Fogo</th>
              <th className="px-4 py-3 text-left">Medida</th>
              <th className="px-4 py-3 text-left">Desenho</th>
              <th className="px-4 py-3 text-left">Motivo</th>
              <th className="px-4 py-3 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {pneusFiltrados.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50">
                <td className="px-4 py-3">{item.data}</td>
                <td className="px-4 py-3 font-mono font-bold text-red-600">
                  {item.numeroFogo}
                </td>
                <td className="px-4 py-3">{item.medida}</td>
                <td className="px-4 py-3">{item.desenho}</td>
                <td className="px-4 py-3 text-xs font-bold uppercase">
                  {item.motivo}
                </td>
                <td className="px-4 py-3 text-right font-bold">
                  {formatarMoeda(item.preco)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HistoricoPneusRef;
