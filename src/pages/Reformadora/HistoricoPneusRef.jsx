import { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { Search, History, Loader2, Gauge } from "lucide-react";

function HistoricoPneusRef() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    buscarHistoricoEntregues();
  }, []);

  const buscarHistoricoEntregues = async () => {
    try {
      setLoading(true);
      // Filtramos apenas onde status_item é ENTREGUE
      const { data, error } = await supabase
        .from("itens_coleta")
        .select(
          `
          *,
          coletas (
            numero_nota,
            id_reformadora
          )
        `,
        )
        .eq("status_item", "ENTREGUE")
        .order("data_entrega", { ascending: false });

      if (error) throw error;

      // Buscar nomes das reformadoras para exibir no histórico
      const { data: refData } = await supabase
        .from("empresas_reformadoras")
        .select("id, nome");
      const mapaRef = {};
      refData?.forEach((r) => (mapaRef[r.id] = r.nome));

      const formatados = data.map((item) => ({
        ...item,
        nome_reformadora: mapaRef[item.coletas?.id_reformadora] || "N/A",
      }));

      setHistorico(formatados);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) =>
    valor?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ||
    "R$ 0,00";

  const formatarData = (dataStr) => {
    if (!dataStr) return "---";
    return new Date(dataStr).toLocaleDateString("pt-BR", { timeZone: "UTC" });
  };

  const pneusFiltrados = historico.filter((p) =>
    p.numero_fogo?.toLowerCase().includes(busca.toLowerCase()),
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={50} />
        <p className="text-slate-500 font-black uppercase text-sm tracking-widest">
          Consultando Banco de Dados...
        </p>
      </div>
    );

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <h1 className="text-3xl font-black text-slate-800 flex items-center gap-4 uppercase">
            <History className="text-blue-600" size={35} /> Histórico de Pneus
            Entregues
          </h1>

          <div className="relative w-full md:w-96">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={24}
            />
            <input
              type="text"
              placeholder="Buscar por Nº Fogo..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 focus:border-blue-500 outline-none text-lg font-bold shadow-sm transition-all"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-[32px] shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-300 font-black text-sm uppercase tracking-widest">
                  <th className="p-6">Data Entrega</th>
                  <th className="p-6">Nº Fogo</th>
                  <th className="p-6">Reformadora</th>
                  <th className="p-6">Medida / Desenho</th>
                  <th className="p-6 text-center">Sulco</th>
                  <th className="p-6">Destino / C.Custo</th>
                  <th className="p-6">Motivo</th>
                  <th className="p-6 text-right">Valor Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pneusFiltrados.length > 0 ? (
                  pneusFiltrados.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-blue-50/50 transition-colors"
                    >
                      <td className="p-6">
                        <p className="text-xs font-black text-slate-400 uppercase">
                          Finalizado em
                        </p>
                        <p className="text-lg font-bold text-slate-700">
                          {formatarData(item.data_entrega)}
                        </p>
                      </td>
                      <td className="p-6">
                        <span className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xl font-black border border-red-100 inline-block">
                          {item.numero_fogo}
                        </span>
                      </td>
                      <td className="p-6 text-lg font-bold text-orange-600 uppercase">
                        {item.nome_reformadora}
                      </td>
                      <td className="p-6">
                        <p className="text-lg font-black text-slate-800 uppercase">
                          {item.medida}
                        </p>
                        <p className="text-sm font-medium text-slate-500 uppercase">
                          {item.modelo || item.desenho}
                        </p>
                      </td>
                      <td className="p-6 text-center">
                        <div className="flex flex-col items-center">
                          <Gauge size={20} className="text-blue-500 mb-1" />
                          <span className="text-lg font-black text-slate-700">
                            {item.sulco}mm
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-black uppercase">
                          {item.destino_pneu || "NÃO INFORMADO"}
                        </span>
                      </td>
                      <td className="p-6 font-black italic text-slate-400 text-sm uppercase">
                        {item.motivo_saida || "REFORMA"}
                      </td>
                      <td className="p-6 text-right">
                        <p className="text-2xl font-black text-emerald-600">
                          {formatarMoeda(item.valor_reforma)}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="8"
                      className="p-20 text-center text-slate-400 font-bold text-xl uppercase tracking-widest"
                    >
                      Nenhum pneu entregue encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-slate-400 font-bold uppercase text-sm flex justify-between px-4">
          <span>Total de registros: {pneusFiltrados.length}</span>
          <span>Filtro ativo: {busca || "Nenhum"}</span>
        </div>
      </div>
    </div>
  );
}

export default HistoricoPneusRef;
