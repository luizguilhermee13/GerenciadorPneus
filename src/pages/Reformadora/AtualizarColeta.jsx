import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { Save, Loader2, CheckSquare, Square, Search } from "lucide-react";

function AtualizarColeta() {
  const [itensPendentes, setItensPendentes] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busca, setBusca] = useState("");
  const [edicoesItens, setEdicoesItens] = useState({});

  const [entregaInfo, setEntregaInfo] = useState({
    dataEntrega: new Date().toISOString().split("T")[0],
    garagemDestino: "2",
  });

  useEffect(() => {
    buscarPendentes();
  }, []);

  const buscarPendentes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("itens_coleta")
        .select(
          `
          *,
          coletas (numero_nota, data_envio, id_reformadora)
        `,
        )
        .eq("status_item", "NA REFORMADORA");

      if (error) throw error;
      setItensPendentes(data || []);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelecao = (id) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const selecionarTodos = () => {
    if (selecionados.length === itensFiltrados.length) setSelecionados([]);
    else setSelecionados(itensFiltrados.map((i) => i.id));
  };

  const atualizarEdicaoLocal = (id, campo, valor) => {
    setEdicoesItens((prev) => {
      const novoEstado = {
        ...prev,
        [id]: { ...prev[id], [campo]: valor },
      };

      // Se marcar como RECUSADO, zera o valor automaticamente
      if (campo === "motivo" && valor === "RECUSADO") {
        novoEstado[id].valor = 0;
      }
      return novoEstado;
    });
  };

  const confirmarEntrega = async () => {
    if (selecionados.length === 0) return alert("Selecione ao menos um pneu!");

    const confirmar = window.confirm(
      `Confirmar entrega de ${selecionados.length} pneus?`,
    );
    if (!confirmar) return;

    setLoading(true);

    try {
      for (const id of selecionados) {
        const itemOriginal = itensPendentes.find((i) => i.id === id);
        if (!itemOriginal) continue;

        const edicao = edicoesItens[id] || {};

        const valorFinal =
          edicao.valor !== undefined
            ? parseFloat(edicao.valor)
            : itemOriginal.valor_reforma || 0;
        const sulcoFinal =
          edicao.sulco !== undefined
            ? parseFloat(edicao.sulco)
            : itemOriginal.sulco || 0;

        const { error: errorItem } = await supabase
          .from("itens_coleta")
          .update({
            status_item: "ENTREGUE",
            data_entrega: entregaInfo.dataEntrega,
            motivo_saida:
              edicao.motivo || itemOriginal.motivo_saida || "REFORMA",
            valor_reforma: isNaN(valorFinal) ? 0 : valorFinal,
            sulco: isNaN(sulcoFinal) ? 0 : sulcoFinal,
            // Agora enviando o destino para o centro de custo
            destino_pneu: entregaInfo.garagemDestino || "ESTOQUE GERAL",
          })
          .eq("id", id);

        if (errorItem) throw errorItem;
      }

      // ... lógica de fechar a coleta pai (permanece igual)
      const idsColetasAfetadas = [
        ...new Set(
          selecionados
            .map((id) => itensPendentes.find((i) => i.id === id)?.id_coleta)
            .filter(Boolean),
        ),
      ];

      for (const idColeta of idsColetasAfetadas) {
        const { data: restantes } = await supabase
          .from("itens_coleta")
          .select("id")
          .eq("id_coleta", idColeta)
          .eq("status_item", "NA REFORMADORA");

        if (restantes && restantes.length === 0) {
          await supabase
            .from("coletas")
            .update({ status: "CONCLUÍDA" })
            .eq("id", idColeta);
        }
      }

      alert("Pneus entregues e destinos registrados para Centro de Custo!");
      setSelecionados([]);
      setEdicoesItens({});
      buscarPendentes();
    } catch (err) {
      alert(
        "Erro na operação: Verifique se a coluna 'destino_pneu' foi criada no banco. Detalhes: " +
          err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const itensFiltrados = itensPendentes.filter((i) =>
    i.numero_fogo?.toLowerCase().includes(busca.toLowerCase()),
  );

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 mb-8 flex flex-wrap items-end gap-6">
          <div className="flex-1 min-w-[300px]">
            <h1 className="text-2xl font-black uppercase mb-2 text-blue-600">
              Atualizar Retorno
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase">
              Ajuste o motivo, preço e sulco antes de confirmar
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">
              Data Recebimento
            </label>
            <input
              type="date"
              className="bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold outline-none"
              value={entregaInfo.dataEntrega}
              onChange={(e) =>
                setEntregaInfo({ ...entregaInfo, dataEntrega: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-slate-400 uppercase">
              Destino (Garagem)
            </label>
            <select
              className="bg-slate-50 border-2 border-slate-100 p-3 rounded-xl font-bold outline-none"
              value={entregaInfo.garagemDestino}
              onChange={(e) =>
                setEntregaInfo({
                  ...entregaInfo,
                  garagemDestino: e.target.value,
                })
              }
            >
              <option value="1">SÃO FRANCISCO </option>
              <option value="2">VITORINO </option>
              <option value="3">BANDEIRANTES </option>
              <option value="SUCATA">PILHA DE SUCATEADO</option>
            </select>
          </div>

          <button
            onClick={confirmarEntrega}
            disabled={loading || selecionados.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-black px-10 py-4 rounded-2xl transition-all flex items-center gap-3 uppercase text-sm"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Save size={20} />
            )}
            Confirmar Recebimento ({selecionados.length})
          </button>
        </div>

        <div className="mb-6 flex items-center bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm gap-4">
          <Search className="text-slate-300" />
          <input
            type="text"
            placeholder="PESQUISAR Nº FOGO..."
            className="flex-1 outline-none font-bold uppercase text-sm"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <button
            onClick={selecionarTodos}
            className="text-[10px] font-black text-blue-600 uppercase hover:underline"
          >
            {selecionados.length === itensFiltrados.length
              ? "Desmarcar Todos"
              : "Selecionar Todos"}
          </button>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-black text-[10px] uppercase">
                <th className="p-5 w-16 text-center">Sel.</th>
                <th className="p-5">Pneu</th>
                <th className="p-5">Nota</th>
                <th className="p-5">Motivo Saída</th>
                <th className="p-5">Valor Final</th>
                <th className="p-5 text-center">Sulco (mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itensFiltrados.map((item) => {
                const isSelected = selecionados.includes(item.id);
                const valorAtual =
                  edicoesItens[item.id]?.valor ?? item.valor_reforma ?? "";
                const motivoAtual =
                  edicoesItens[item.id]?.motivo ??
                  item.motivo_saida ??
                  "REFORMA";
                const sulcoAtual =
                  edicoesItens[item.id]?.sulco ?? item.sulco ?? "";

                return (
                  <tr
                    key={item.id}
                    className={`transition-all ${isSelected ? "bg-blue-50/40" : "hover:bg-slate-50"}`}
                  >
                    <td
                      className="p-5 text-center"
                      onClick={() => toggleSelecao(item.id)}
                    >
                      {isSelected ? (
                        <CheckSquare
                          className="text-blue-600 mx-auto"
                          size={24}
                        />
                      ) : (
                        <Square className="text-slate-200 mx-auto" size={24} />
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex flex-col">
                        <span className="font-black text-slate-700 text-lg">
                          {item.numero_fogo}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          {item.marca} | {item.medida}
                        </span>
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-400 text-xs">
                      NF: {item.coletas?.numero_nota || "S/N"}
                    </td>
                    <td className="p-5">
                      <select
                        disabled={!isSelected}
                        value={motivoAtual}
                        onChange={(e) =>
                          atualizarEdicaoLocal(
                            item.id,
                            "motivo",
                            e.target.value,
                          )
                        }
                        className={`p-2 rounded-lg font-black text-[10px] uppercase border-2 outline-none ${motivoAtual === "RECUSADO" ? "border-red-200 text-red-600 bg-red-50" : "border-slate-100 text-blue-600"}`}
                      >
                        <option value="REFORMA">REFORMA</option>
                        <option value="RECUSADO">RECUSADO (SUCATA)</option>
                        <option value="CONSERTO">APENAS CONSERTO</option>
                        <option value="RECLAMAÇÃO">RECLAMAÇÃO</option>
                      </select>
                    </td>
                    <td className="p-5">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-400">
                          R$
                        </span>
                        <input
                          type="number"
                          disabled={!isSelected}
                          className="w-24 p-2 font-mono font-black text-sm border-b-2 border-slate-100 outline-none focus:border-blue-500 disabled:bg-transparent"
                          value={valorAtual}
                          onChange={(e) =>
                            atualizarEdicaoLocal(
                              item.id,
                              "valor",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </td>
                    <td className="p-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="number"
                          disabled={!isSelected}
                          className="w-16 p-2 text-center font-black text-sm border-b-2 border-slate-100 outline-none focus:border-blue-500 disabled:bg-transparent"
                          value={sulcoAtual}
                          onChange={(e) =>
                            atualizarEdicaoLocal(
                              item.id,
                              "sulco",
                              e.target.value,
                            )
                          }
                        />
                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                          mm
                        </span>
                      </div>
                      <div className="text-[9px] text-slate-300 mt-1 uppercase font-bold">
                        Anterior: {item.sulco}mm
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AtualizarColeta;
