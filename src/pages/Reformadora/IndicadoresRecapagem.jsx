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
  const [dataEnvio, setDataEnvio] = useState([]); // Itens ENVIADOS no período
  const [dataEntrega, setDataEntrega] = useState([]); // Itens ENTREGUES no período
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

      // BUSCA 1: Pneus que saíram para a reformadora (baseado na data da coleta)
      const { data: enviados, error: err1 } = await supabase
        .from("itens_coleta")
        .select(`*, coletas!inner(data_envio)`)
        .gte("coletas.data_envio", dataInicio)
        .lte("coletas.data_envio", dataFim);

      // BUSCA 2: Pneus que chegaram (baseado no campo data_entrega da tabela itens_coleta)
      const { data: entregues, error: err2 } = await supabase
        .from("itens_coleta")
        .select(`*, coletas(data_envio)`)
        .gte("data_entrega", dataInicio)
        .lte("data_entrega", dataFim)
        .eq("status_item", "ENTREGUE");

      if (err1 || err2) throw err1 || err2;

      setDataEnvio(enviados || []);
      setDataEntrega(entregues || []);
    } catch (err) {
      console.error("Erro nos indicadores:", err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalColetados = dataEnvio.length;
    const totalEntregues = dataEntrega.length;
    const totalInvestido = dataEnvio.reduce(
      (acc, curr) => acc + (Number(curr.valor_reforma) || 0),
      0,
    );

    const contagem275 = dataEnvio.filter((i) =>
      i.medida?.includes("275"),
    ).length;
    const contagem215 = dataEnvio.filter((i) =>
      i.medida?.includes("215"),
    ).length;

    const dadosMedidas = [
      { name: "275/80R22,5", quantidade: contagem275 },
      { name: "215/75R17,5", quantidade: contagem215 },
    ];

    const motivos = {
      reformas: dataEnvio.filter((i) => i.motivo_saida === "REFORMA").length,
      consertos: dataEnvio.filter((i) => i.motivo_saida === "CONSERTO").length,
      recusados: dataEnvio.filter(
        (i) => i.motivo_saida === "RECUSADO" || i.status_item === "RECUSADO",
      ).length,
      reclamados: dataEnvio.filter(
        (i) => i.motivo_saida === "GARANTIA" || i.motivo_saida === "RECLAMACAO",
      ).length,
    };

    // Gráfico de Pizza sem filtros de exclusão para bater com o total de envios
    const dadosPizza = [
      { name: "Reformas", value: motivos.reformas },
      { name: "Consertos", value: motivos.consertos },
      { name: "Recusados", value: motivos.recusados },
      { name: "Reclamações", value: motivos.reclamados },
    ];

    const dadosGraficoPrincipal =
      mesSelecionado === 0
        ? mesesNomes.slice(1).map((mes, idx) => ({
            name: mes.substring(0, 3),
            coletados: dataEnvio.filter(
              (i) => new Date(i.coletas.data_envio).getUTCMonth() === idx,
            ).length,
            entregues: dataEntrega.filter(
              (i) => new Date(i.data_entrega).getUTCMonth() === idx,
            ).length,
          }))
        : Array.from(
            { length: new Date(anoSelecionado, mesSelecionado, 0).getDate() },
            (_, i) => {
              const dia = i + 1;
              return {
                name: dia.toString(),
                coletados: dataEnvio.filter(
                  (i) => new Date(i.coletas.data_envio).getUTCDate() === dia,
                ).length,
                entregues: dataEntrega.filter(
                  (i) => new Date(i.data_entrega).getUTCDate() === dia,
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
  }, [dataEnvio, dataEntrega, mesSelecionado]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={50} />
        <p className="font-black text-slate-400 uppercase tracking-widest">
          Sincronizando Fluxo Real...
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 flex items-center gap-4 uppercase">
            <LayoutDashboard className="text-blue-600" size={36} />
            Indicadores Recapagem
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

        {/* CARDS KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <CardStats
            title="Enviados p/ Reforma"
            value={stats.totalColetados}
            icon={<Truck size={35} />}
            color="bg-blue-600"
          />
          <CardStats
            title="Recebidos no Pátio"
            value={stats.totalEntregues}
            icon={<CheckCircle2 size={35} />}
            color="bg-emerald-500"
          />
          <CardStats
            title="Taxa de Giro"
            value={`${stats.totalColetados > 0 ? ((stats.totalEntregues / stats.totalColetados) * 100).toFixed(1) : 0}%`}
            icon={<TrendingUp size={35} />}
            color="bg-orange-500"
          />
          <CardStats
            title="Investimento Período"
            value={stats.totalInvestido.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
            icon={<DollarSign size={35} />}
            color="bg-slate-800"
          />
        </div>

        {/* GRÁFICOS DE ÁREA E PIZZA */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200">
            <div className="mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase">
                Evolução de Entradas e Saídas
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Azul: Coletados p/ Reforma | Verde: Entregues pela Reformadora
              </p>
            </div>
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
              Motivos de Saída
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

        {/* GRÁFICO DE MEDIDAS */}
        <div className="grid grid-cols-1 gap-8">
          <div className="bg-white p-6 md:p-8 rounded-[32px] shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Layers size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase">
                Volume por Medida (Envios)
              </h3>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dadosMedidas}>
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
                    name="Quantidade"
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
