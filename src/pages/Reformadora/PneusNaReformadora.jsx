import { useState, useEffect } from "react";
import { formatarMoeda } from "./utils/formatadores";

function PneusNaReformadora() {
  const [pneus, setPneus] = useState([]);
  const [dataEntrega, setDataEntrega] = useState(
    new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = () => {
    const coletas = JSON.parse(localStorage.getItem("coletas") || "[]");
    const todosPneus = [];

    coletas.forEach((coleta) => {
      if (coleta.pneus) {
        coleta.pneus.forEach((pneu, indexPneu) => {
          // Apenas pneus que NÃO estão com status ENTREGUE aparecem aqui
          if (pneu.status !== "ENTREGUE") {
            todosPneus.push({
              ...pneu,
              dataColeta: coleta.dataColeta,
              idColeta: coleta.id,
              indexPneu: indexPneu, // Referência para atualizar no array original
              statusLocal:
                pneu.status ||
                (pneu.motivo === "CONSERTO" ? "EM CONSERTO" : "EM REFORMA"),
            });
          }
        });
      }
    });
    setPneus(todosPneus);
  };

  const atualizarStatusLocal = (idColeta, indexPneu, novoStatus) => {
    setPneus((prev) =>
      prev.map((p) =>
        p.idColeta === idColeta && p.indexPneu === indexPneu
          ? { ...p, statusLocal: novoStatus }
          : p,
      ),
    );
  };

  const salvarAtualizacoes = () => {
    const coletasAtuais = JSON.parse(localStorage.getItem("coletas") || "[]");
    const entregasNovas = [];

    // 1. Atualizar o status nas coletas originais
    const coletasAtualizadas = coletasAtuais.map((coleta) => {
      const pneusAtualizados = coleta.pneus.map((pneuOriginal, idx) => {
        const pneuEditado = pneus.find(
          (p) => p.idColeta === coleta.id && p.indexPneu === idx,
        );

        if (pneuEditado) {
          if (pneuEditado.statusLocal === "ENTREGUE") {
            const pneuEntregue = {
              ...pneuOriginal,
              status: "ENTREGUE",
              dataEntrega: dataEntrega,
              garagemOrigem: coleta.garagem,
              reformadora: coleta.reformadora,
              numeroNota: coleta.numeroNota,
            };
            entregasNovas.push(pneuEntregue);
            return pneuEntregue;
          }
          return { ...pneuOriginal, status: pneuEditado.statusLocal };
        }
        return pneuOriginal;
      });
      return { ...coleta, pneus: pneusAtualizados };
    });

    // 2. Salvar coletas atualizadas
    localStorage.setItem("coletas", JSON.stringify(coletasAtualizadas));

    // 3. Salvar no histórico de entregues (PneusEntregues)
    const historicoEntregues = JSON.parse(
      localStorage.getItem("pneusEntregues") || "[]",
    );
    localStorage.setItem(
      "pneusEntregues",
      JSON.stringify([...historicoEntregues, ...entregasNovas]),
    );

    alert(
      "Atualizações salvas! Pneus entregues foram movidos para o histórico.",
    );
    carregarDados(); // Recarrega a tela para limpar os entregues
  };

  const agruparPorMedida = () => {
    const grupos = {};
    pneus.forEach((pneu) => {
      const medida = pneu.medida || "Outras";
      if (!grupos[medida]) grupos[medida] = [];
      grupos[medida].push(pneu);
    });
    return grupos;
  };

  const grupos = agruparPorMedida();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Pneus na Reformadora
        </h1>

        <div className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border">
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase">
              Data de Entrega
            </label>
            <input
              type="date"
              value={dataEntrega}
              onChange={(e) => setDataEntrega(e.target.value)}
              className="text-sm font-semibold outline-none"
            />
          </div>
          <button
            onClick={salvarAtualizacoes}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-bold transition-colors"
          >
            Salvar Atualizações
          </button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-600 text-white p-4 rounded-lg shadow-md">
          <p className="opacity-80 text-sm">Pneus em Processo</p>
          <p className="text-3xl font-bold">{pneus.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-orange-500">
          <p className="text-gray-500 text-sm">Aguardando Entrega</p>
          <p className="text-3xl font-bold text-gray-800">
            {pneus.filter((p) => p.statusLocal === "ENTREGUE").length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md border-l-4 border-green-500">
          <p className="text-gray-500 text-sm">Valor em Reforma</p>
          <p className="text-3xl font-bold text-gray-800">
            {formatarMoeda(
              pneus.reduce((soma, p) => soma + (parseFloat(p.preco) || 0), 0),
            )}
          </p>
        </div>
      </div>

      {pneus.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed">
          <p className="text-gray-400">
            Não há pneus pendentes na reformadora.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(grupos).map(([medida, pneusDoGrupo]) => (
            <div
              key={medida}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-4 bg-gray-800 text-white flex justify-between items-center">
                <h3 className="font-bold text-lg">Medida: {medida}</h3>
                <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                  {pneusDoGrupo.length} pneus
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Nº Fogo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                        Marca/Modelo
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                        Motivo
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-center text-xs  uppercase font-black text-blue-600">
                        Alterar Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {pneusDoGrupo.map((pneu, idx) => (
                      <tr
                        key={`${pneu.idColeta}-${pneu.indexPneu}`}
                        className={`hover:bg-gray-50 transition-colors ${pneu.statusLocal === "ENTREGUE" ? "bg-green-50" : ""}`}
                      >
                        <td className="px-6 py-4 font-mono font-bold text-red-600">
                          {pneu.numeroFogo}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold">{pneu.marca}</div>
                          <div className="text-xs text-gray-500">
                            {pneu.modelo}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded ${pneu.motivo === "CONSERTO" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}
                          >
                            {pneu.motivo}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center font-semibold text-gray-700">
                          {formatarMoeda(pneu.preco)}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={pneu.statusLocal}
                            onChange={(e) =>
                              atualizarStatusLocal(
                                pneu.idColeta,
                                pneu.indexPneu,
                                e.target.value,
                              )
                            }
                            className={`w-full p-2 rounded border font-bold text-sm outline-none ${
                              pneu.statusLocal === "ENTREGUE"
                                ? "bg-green-600 text-white border-green-700"
                                : "bg-white text-gray-700 border-gray-300"
                            }`}
                          >
                            <option value="EM REFORMA">EM REFORMA</option>
                            <option value="EM CONSERTO">EM CONSERTO</option>
                            <option value="ENTREGUE">✅ ENTREGUE</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PneusNaReformadora;
