import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

function TelaPneus() {
  const [pneus, setPneus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [sulcoStats, setSulcoStats] = useState({
    alto: 0,
    mediano: 0,
    alerta: 0,
    liso: 0,
  });

  const itensPorPagina = 50;
  const navigate = useNavigate();

  // Estados para os filtros
  const [filtroEmpresa, setFiltroEmpresa] = useState("");
  const [filtroFogo, setFiltroFogo] = useState("");
  const [filtroMedida, setFiltroMedida] = useState("");
  const [filtroCentroCusto, setFiltroCentroCusto] = useState("");
  const [filtroDesenho, setFiltroDesenho] = useState("");

  const totalPaginas = Math.ceil(totalRegistros / itensPorPagina);

  const fetchDados = async () => {
    setLoading(true);
    try {
      // 1. Buscar estatísticas de sulco (View)
      const { data: stats } = await supabase
        .from("estatisticas_sulco_view")
        .select("*")
        .single();
      if (stats) setSulcoStats(stats);

      // 2. Buscar pneus com paginação e filtros
      const de = pagina * itensPorPagina;
      const ate = de + itensPorPagina - 1;

      let query = supabase
        .from("pneus")
        .select("*", { count: "exact" })
        .order("data_entrada", { ascending: false })
        .range(de, ate);

      if (filtroEmpresa) query = query.ilike("empresa", `%${filtroEmpresa}%`);
      if (filtroFogo) query = query.ilike("numero_fogo", `%${filtroFogo}%`);
      if (filtroMedida) query = query.ilike("medida", `%${filtroMedida}%`);
      if (filtroDesenho) query = query.ilike("desenho", `%${filtroDesenho}%`);
      if (filtroCentroCusto)
        query = query.ilike("centro_custo", `%${filtroCentroCusto}%`);

      const { data, count, error } = await query;
      if (error) throw error;

      setPneus(data || []);
      setTotalRegistros(count || 0);
    } catch (error) {
      console.error("Erro:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, [pagina]);

  const handlePesquisar = () => {
    setPagina(0);
    fetchDados();
  };

  // Função auxiliar para calcular largura da barra do gráfico
  const calcularLargura = (valor) => {
    if (!totalRegistros || totalRegistros === 0) return "0%";
    return `${(valor / (sulcoStats.alto + sulcoStats.mediano + sulcoStats.alerta + sulcoStats.liso)) * 100}%`;
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-[1800px] mx-auto">
        {/* HEADER E ÁREA SUPERIOR (Filtros + Gráfico) */}
        <div className="bg-white p-8 rounded-t-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-10 border-b border-slate-50 pb-5">
            <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Pesquisa de Pneus
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* COLUNA DA ESQUERDA: FILTROS */}
            <div className="flex-1 max-w-2xl space-y-5">
              <div className="flex items-center">
                <label className="w-40 text-right pr-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Empresa
                </label>
                <input
                  type="text"
                  className="w-60 p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
                  value={filtroEmpresa}
                  onChange={(e) => setFiltroEmpresa(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right pr-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Nº do Pneu
                </label>
                <input
                  type="text"
                  placeholder="Ex: 004550"
                  className="w-60 p-2 bg-blue-50 border border-blue-100 rounded-xl outline-none font-bold text-blue-700"
                  value={filtroFogo}
                  onChange={(e) => setFiltroFogo(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right pr-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Medida
                </label>
                <input
                  type="text"
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
                  value={filtroMedida}
                  onChange={(e) => setFiltroMedida(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right pr-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Centro Custo
                </label>
                <input
                  type="text"
                  placeholder="Ex: 360"
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-700"
                  value={filtroCentroCusto}
                  onChange={(e) => setFiltroCentroCusto(e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right pr-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                  Desenho
                </label>
                <input
                  type="text"
                  className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
                  value={filtroDesenho}
                  onChange={(e) => setFiltroDesenho(e.target.value)}
                />
              </div>

              <div className="flex items-center pt-4">
                <div className="w-40"></div>
                <button
                  onClick={handlePesquisar}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black px-16 py-3.5 rounded-xl shadow-lg shadow-blue-200 transition-all uppercase text-sm active:scale-95"
                >
                  {loading ? "Processando..." : "Pesquisar"}
                </button>
              </div>
            </div>

            {/* COLUNA DA DIREITA: GRÁFICO DE BARRAS HORIZONTAL */}
            <div className="flex-1 bg-slate-50 rounded-3xl p-8 border border-slate-100 self-start shadow-inner">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 text-center">
                Perfil de Desgaste (Frota Total)
              </h3>

              <div className="space-y-6">
                {/* Barra: Alto */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-emerald-600">
                      Sulco Alto ({">"}10mm)
                    </span>
                    <span className="text-slate-500">
                      {sulcoStats.alto} unid.
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-700"
                      style={{ width: calcularLargura(sulcoStats.alto) }}
                    ></div>
                  </div>
                </div>

                {/* Barra: Mediano */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-blue-600">Mediano (6-10mm)</span>
                    <span className="text-slate-500">
                      {sulcoStats.mediano} unid.
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-700"
                      style={{ width: calcularLargura(sulcoStats.mediano) }}
                    ></div>
                  </div>
                </div>

                {/* Barra: Alerta */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-orange-600">Alerta (3-6mm)</span>
                    <span className="text-slate-500">
                      {sulcoStats.alerta} unid.
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full transition-all duration-700"
                      style={{ width: calcularLargura(sulcoStats.alerta) }}
                    ></div>
                  </div>
                </div>

                {/* Barra: Liso */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-red-600">Liso ({"<"}3mm)</span>
                    <span className="text-slate-500">
                      {sulcoStats.liso} unid.
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-red-500 h-full transition-all duration-700"
                      style={{ width: calcularLargura(sulcoStats.liso) }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABELA COMPLETA */}
        <div className="bg-white border border-slate-200 border-t-0 shadow-xl rounded-b-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse table-fixed">
              <thead>
                <tr className="bg-slate-800 text-slate-200 font-bold text-[10px] uppercase tracking-widest">
                  <th className="p-4 border-r border-slate-700 w-20">Emp.</th>
                  <th className="p-4 border-r border-slate-700 w-32">Fogo</th>
                  <th className="p-4 border-r border-slate-700 w-24">Sulco</th>
                  <th className="p-4 border-r border-slate-700 w-28">Vida</th>
                  <th className="p-4 border-r border-slate-700 w-36">
                    KM Rodada
                  </th>
                  <th className="p-4 border-r border-slate-700 w-32">Marca</th>
                  <th className="p-4 border-r border-slate-700 w-44">Medida</th>
                  <th className="p-4 border-r border-slate-700 w-32">Data</th>
                  <th className="p-4 border-r border-slate-700 w-24">
                    Posição
                  </th>
                  <th className="p-4 w-32">C. Custo</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {pneus.map((pneu, idx) => (
                  <tr
                    key={idx}
                    onClick={() =>
                      navigate(
                        `/pneus/editar/${pneu.empresa}/${pneu.numero_fogo}`,
                      )
                    }
                    className="border-b border-slate-100 hover:bg-blue-600 hover:text-white transition-all cursor-pointer group text-sm"
                  >
                    <td className="p-4 border-r font-bold">{pneu.empresa}</td>
                    <td className="p-4 border-r font-black italic">
                      {pneu.numero_fogo}
                    </td>
                    <td className="p-4 border-r font-bold">
                      {pneu.sulco_atual}mm
                    </td>
                    <td className="p-4 border-r">
                      <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-blue-700 rounded text-[10px] font-black uppercase">
                        {pneu.vida}
                      </span>
                    </td>
                    <td className="p-4 border-r font-mono font-bold">
                      {pneu.km_rodada?.toLocaleString("pt-BR")}
                    </td>
                    <td className="p-4 border-r uppercase font-semibold text-xs">
                      {pneu.marca}
                    </td>
                    <td className="p-4 border-r truncate text-xs">
                      {pneu.medida}
                    </td>
                    <td className="p-4 border-r font-mono text-[11px]">
                      {pneu.data_entrada
                        ? new Date(pneu.data_entrada).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-4 border-r">
                      <b className="px-2 py-1 bg-slate-50 group-hover:bg-blue-800 rounded text-[10px] shadow-sm uppercase">
                        {pneu.posicao}
                      </b>
                    </td>
                    <td className="p-4 font-black">{pneu.centro_custo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RODAPÉ COM PAGINAÇÃO */}
          <div className="bg-slate-50 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Página {pagina + 1} de {totalPaginas || 1} •{" "}
              {totalRegistros.toLocaleString("pt-BR")} itens
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setPagina((p) => Math.max(0, p - 1))}
                disabled={pagina === 0 || loading}
                className="px-8 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-all shadow-sm"
              >
                ← ANTERIOR
              </button>
              <button
                onClick={() => setPagina((p) => p + 1)}
                disabled={pagina + 1 >= totalPaginas || loading}
                className="px-8 py-2.5 bg-slate-800 border border-slate-800 rounded-xl text-xs font-black text-white hover:bg-slate-900 disabled:opacity-30 transition-all shadow-md"
              >
                PRÓXIMO →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TelaPneus;
