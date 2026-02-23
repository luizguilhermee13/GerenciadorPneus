import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { ChevronDown, ChevronUp, FileText, Loader2 } from "lucide-react";

function ColetasFeitas() {
  const [coletas, setColetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [abertas, setAbertas] = useState({});

  useEffect(() => {
    buscarColetas();
  }, []);

  const buscarColetas = async () => {
    try {
      setLoading(true);
      const { data: coletasData, error: coletasError } = await supabase
        .from("coletas")
        .select("*, itens_coleta(*)")
        .order("data_envio", { ascending: false });

      if (coletasError) throw coletasError;

      const [reformadorasRes, garagensRes] = await Promise.allSettled([
        supabase.from("empresas_reformadoras").select("id, nome"),
        supabase.from("garagens").select("id, nome_garagem"),
      ]);

      const mapaReformadoras = {};
      if (
        reformadorasRes.status === "fulfilled" &&
        reformadorasRes.value.data
      ) {
        reformadorasRes.value.data.forEach(
          (item) => (mapaReformadoras[item.id] = item.nome),
        );
      }

      const mapaGaragens = {};
      if (garagensRes.status === "fulfilled" && garagensRes.value.data) {
        garagensRes.value.data.forEach(
          (item) => (mapaGaragens[item.id] = item.nome_garagem),
        );
      }

      const coletasFormatadas = coletasData.map((coleta) => {
        const total = coleta.itens_coleta?.length || 0;
        const entregues =
          coleta.itens_coleta?.filter((i) => i.status_item === "ENTREGUE")
            .length || 0;
        const progresso = `${entregues.toString().padStart(2, "0")}/${total.toString().padStart(2, "0")}`;

        return {
          ...coleta,
          progresso_entrega: progresso,
          isConcluida: entregues === total && total > 0,
          nome_reformadora_extra:
            mapaReformadoras[coleta.id_reformadora] ||
            `ID: ${coleta.id_reformadora}`,
          nome_garagem_extra:
            mapaGaragens[coleta.id_garagem] || `Unidade ${coleta.id_garagem}`,
        };
      });

      setColetas(coletasFormatadas);
    } catch (err) {
      console.error("Erro detalhado:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNota = (id) =>
    setAbertas((prev) => ({ ...prev, [id]: !prev[id] }));

  const formatarMoeda = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatarData = (dataStr) => {
    if (!dataStr) return "---";
    return new Date(dataStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="text-slate-500 font-black uppercase text-sm tracking-widest">
          Carregando Relatórios...
        </p>
      </div>
    );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <h1 className="text-3xl font-black mb-12 text-slate-800 flex items-center gap-4 uppercase tracking-tight">
        <FileText className="text-blue-600" size={32} /> Relatório de Coletas
      </h1>

      <div className="max-w-[1500px] mx-auto space-y-8">
        {coletas.map((coleta) => (
          <div
            key={coleta.id}
            className="bg-white rounded-[32px] shadow-md border border-slate-200 overflow-hidden"
          >
            <div
              onClick={() => toggleNota(coleta.id)}
              className="p-8 cursor-pointer flex justify-between items-center hover:bg-slate-50 transition-colors"
            >
              <div className="grid grid-cols-2 md:grid-cols-5 gap-10 flex-1">
                <div>
                  <p className="text-xs uppercase font-black text-slate-400 mb-2 tracking-wider">
                    Nº Nota
                  </p>
                  <p className="text-xl font-black text-blue-700">
                    {coleta.numero_nota || "S/N"}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-slate-400 mb-2 tracking-wider">
                    Data Envio
                  </p>
                  <p className="text-lg font-bold text-slate-700">
                    {formatarData(coleta.data_envio)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-slate-400 mb-2 tracking-wider">
                    Reformadora
                  </p>
                  <p className="text-lg font-bold text-orange-600 uppercase">
                    {coleta.nome_reformadora_extra}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-slate-400 mb-2 tracking-wider">
                    Status
                  </p>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-black uppercase inline-block ${
                      coleta.isConcluida
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {coleta.status ||
                      (coleta.isConcluida ? "CONCLUÍDA" : "EM ABERTO")}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-slate-400 mb-2 tracking-wider">
                    Progresso Retorno
                  </p>
                  <p className="font-black text-slate-800 text-lg">
                    {coleta.progresso_entrega}
                  </p>
                </div>
              </div>
              <div className="ml-6 text-slate-300">
                {abertas[coleta.id] ? (
                  <ChevronUp size={32} />
                ) : (
                  <ChevronDown size={32} />
                )}
              </div>
            </div>

            {abertas[coleta.id] && (
              <div className="p-10 border-t border-slate-100 bg-slate-50/50">
                <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 font-black text-xs uppercase tracking-widest">
                        <th className="p-5">Pos</th>
                        <th className="p-5">Medida</th>
                        <th className="p-5">Marca</th>
                        <th className="p-5">Desenho (Mod)</th>
                        <th className="p-5">Nº Fogo</th>
                        <th className="p-5">Dot</th>
                        <th className="p-5">Vida</th>
                        <th className="p-5">Sulco</th>
                        <th className="p-5">Motivo</th>
                        <th className="p-5 text-right">Preço</th>
                        <th className="p-5 text-center">Data Entrega</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {coleta.itens_coleta?.map((item, idx) => {
                        const isEntregue = item.status_item === "ENTREGUE";
                        return (
                          <tr
                            key={idx}
                            className={`transition-colors text-sm ${
                              isEntregue
                                ? "bg-green-50/70 hover:bg-green-100"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="p-5 text-slate-400 font-bold text-base">
                              {idx + 1}
                            </td>
                            <td className="p-5 font-bold text-slate-800 uppercase text-base">
                              {item.medida || "---"}
                            </td>
                            <td className="p-5 text-slate-600 uppercase font-medium">
                              {item.marca || "---"}
                            </td>
                            <td className="p-5 text-slate-700 uppercase font-bold">
                              {item.modelo || item.desenho || "---"}
                            </td>
                            <td className="p-5 font-black text-blue-600 text-base">
                              {item.numero_fogo}
                            </td>
                            <td className="p-5 text-slate-500 font-mono font-medium">
                              {item.dot || "---"}
                            </td>
                            <td className="p-5 text-blue-700 font-black">
                              {item.vida || "---"}
                            </td>
                            <td className="p-5 font-mono text-slate-700 font-bold">
                              {item.sulco ? `${item.sulco}mm` : "---"}
                            </td>
                            <td
                              className={`p-5 font-black italic ${isEntregue ? "text-green-700" : "text-slate-400"}`}
                            >
                              {item.motivo_saida || "REFORMA"}
                            </td>
                            <td
                              className={`p-5 text-right font-mono font-black text-base ${isEntregue ? "text-green-700" : "text-emerald-600"}`}
                            >
                              {formatarMoeda(item.valor_reforma || 0)}
                            </td>
                            <td className="p-5 text-center font-bold text-slate-600 text-base">
                              {formatarData(item.data_entrega)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColetasFeitas;
