import { useState, useEffect, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  LayoutDashboard,
  TrendingUp,
  CheckCircle2,
  Truck,
  Calendar,
  DollarSign,
  Loader2,
  Layers,
} from "lucide-react";

function IndicadoresRecapagem() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [anoSelecionado, setAnoSelecionado] = useState(
    new Date().getFullYear(),
  );
  const [mesSelecionado, setMesSelecionado] = useState(0);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const mesesNomes = [
    "Ano Completo",
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  useEffect(() => {
    buscarDadosIndicadores();
  }, [anoSelecionado, mesSelecionado]);

  const buscarDadosIndicadores = async () => {
    try {
      setLoading(true);
      let dataInicio, dataFim;

      if (mesSelecionado === 0) {
        dataInicio = `${anoSelecionado}-01-01`;
        dataFim = `${anoSelecionado}-12-31`;
      } else {
        const ultimoDia = new Date(anoSelecionado, mesSelecionado, 0).getDate();
        const mesFormatado = mesSelecionado.toString().padStart(2, "0");
        dataInicio = `${anoSelecionado}-${mesFormatado}-01`;
        dataFim = `${anoSelecionado}-${mesFormatado}-${ultimoDia}`;
      }

      const { data: itens, error } = await supabase
        .from("itens_coleta")
        .select(`*, coletas!inner(data_envio)`)
        .gte("coletas.data_envio", dataInicio)
        .lte("coletas.data_envio", dataFim);

      if (error) throw error;
      setData(itens || []);
    } catch (err) {
      console.error("Erro nos indicadores:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalColetados = data.length;
    const totalEntregues = data.filter(
      (i) => i.status_item === "ENTREGUE",
    ).length;
    const totalInvestido = data.reduce(
      (acc, curr) => acc + (curr.valor_reforma || 0),
      0,
    );

    // Lógica para Medidas
    const contagem275 = data.filter((i) => i.medida?.includes("275")).length;
    const contagem215 = data.filter((i) => i.medida?.includes("215")).length;

    const dadosMedidas = [
      { name: "275/80R22,5", quantidade: contagem275 },
      { name: "215/75R17,5", quantidade: contagem215 },
    ];

    const motivos = {
      reformas: data.filter((i) => i.motivo_saida === "REFORMA").length,
      consertos: data.filter((i) => i.motivo_saida === "CONSERTO").length,
      recusados: data.filter(
        (i) => i.motivo_saida === "RECUSADO" || i.status_item === "RECUSADO",
      ).length,
      reclamados: data.filter(
        (i) => i.motivo_saida === "GARANTIA" || i.motivo_saida === "RECLAMACAO",
      ).length,
    };

    const dadosPizza = [
      { name: "Reformas", value: motivos.reformas },
      { name: "Consertos", value: motivos.consertos },
      { name: "Recusados", value: motivos.recusados },
      { name: "Reclamações", value: motivos.reclamados },
    ].filter((item) => item.value > 0);

    const dadosGraficoPrincipal =
      mesSelecionado === 0
        ? mesesNomes.slice(1).map((mes, idx) => ({
            name: mes.substring(0, 3),
            coletados: data.filter(
              (item) => new Date(item.coletas.data_envio).getUTCMonth() === idx,
            ).length,
            entregues: data.filter(
              (item) =>
                new Date(item.coletas.data_envio).getUTCMonth() === idx &&
                item.status_item === "ENTREGUE",
            ).length,
          }))
        : Array.from(
            { length: new Date(anoSelecionado, mesSelecionado, 0).getDate() },
            (_, i) => {
              const dia = i + 1;
              return {
                name: dia.toString(),
                coletados: data.filter(
                  (item) =>
                    new Date(item.coletas.data_envio).getUTCDate() === dia,
                ).length,
                entregues: data.filter(
                  (item) =>
                    new Date(item.coletas.data_envio).getUTCDate() === dia &&
                    item.status_item === "ENTREGUE",
                ).length,
              };
            },
          );

    return {
      totalColetados,
      totalEntregues,
      totalInvestido,
      dadosPizza,
      dadosGraficoPrincipal,
      dadosMedidas,
    };
  }, [data, mesSelecionado]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={50} />
        <p className="font-black text-slate-400 uppercase">
          Filtrando Período...
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER RESPONSIVO */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-4 uppercase text-center lg:text-left">
            <LayoutDashboard className="text-blue-600" size={36} />
            Painel:{" "}
            {mesSelecionado === 0 ? "Anual" : mesesNomes[mesSelecionado]}{" "}
            {anoSelecionado}
          </h1>

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200">
            <Calendar className="text-slate-400" size={24} />
            <select
              value={anoSelecionado}
              onChange={(e) => setAnoSelecionado(Number(e.target.value))}
              className="bg-transparent font-black text-lg outline-none cursor-pointer border-r pr-4 border-slate-100"
            >
              {[2024, 2025, 2026].map((ano) => (
                <option key={ano} value={ano}>
                  {ano}
                </option>
              ))}
            </select>
            <select
              value={mesSelecionado}
              onChange={(e) => setMesSelecionado(Number(e.target.value))}
              className="bg-transparent font-black text-lg outline-none cursor-pointer pl-2"
            >
              {mesesNomes.map((mes, idx) => (
                <option key={idx} value={idx}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* CARDS KPI RESPONSIVOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <CardStats
            title="Coletados"
            value={stats.totalColetados}
            icon={<Truck size={35} />}
            color="bg-blue-600"
          />
          <CardStats
            title="Entregues"
            value={stats.totalEntregues}
            icon={<CheckCircle2 size={35} />}
            color="bg-emerald-500"
          />
          <CardStats
            title="Taxa Retorno"
            value={`${stats.totalColetados > 0 ? ((stats.totalEntregues / stats.totalColetados) * 100).toFixed(1) : 0}%`}
            icon={<TrendingUp size={35} />}
            color="bg-orange-500"
          />
          <CardStats
            title="Investimento"
            value={stats.totalInvestido.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={<DollarSign size={35} />}
            color="bg-slate-800"
          />
        </div>

        {/* PRIMEIRA LINHA DE GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200">
            <h3 className="text-xl font-black text-slate-800 uppercase mb-8">
              Evolução do Fluxo
            </h3>
            <div className="h-[300px] md:h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.dadosGraficoPrincipal}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontWeight: "bold" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontWeight: "bold" }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="coletados"
                    stroke="#3b82f6"
                    strokeWidth={4}
                    fill="#3b82f6"
                    fillOpacity={0.1}
                    name="Enviados"
                  />
                  <Area
                    type="monotone"
                    dataKey="entregues"
                    stroke="#10b981"
                    strokeWidth={4}
                    fill="#10b981"
                    fillOpacity={0.1}
                    name="Entregues"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200">
            <h3 className="text-xl font-black text-slate-800 uppercase mb-8 text-center">
              Status
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.dadosPizza}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {stats.dadosPizza.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-6">
              {stats.dadosPizza.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border-b border-slate-50 pb-2"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[idx] }}
                    ></div>
                    <span className="text-xs font-black text-slate-600 uppercase">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-black text-slate-800 text-lg">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEGUNDA LINHA: GRÁFICO DE MEDIDAS (NOVO) */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase">
                Volume por Medida (275 vs 215)
              </h3>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stats.dadosMedidas}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontWeight: "bold" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontWeight: "bold" }}
                  />
                  <Tooltip cursor={{ fill: "#f8fafc" }} />
                  <Bar
                    dataKey="quantidade"
                    radius={[10, 10, 0, 0]}
                    barSize={60}
                    name="Quantidade de Pneus"
                  >
                    {stats.dadosMedidas.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === 0 ? "#1e293b" : "#3b82f6"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardStats({ title, value, icon, color }) {
  return (
    <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200 flex items-center gap-6">
      <div className={`${color} p-4 md:p-5 rounded-2xl text-white shadow-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase mb-1">
          {title}
        </p>
        <p className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
}

export default IndicadoresRecapagem;
