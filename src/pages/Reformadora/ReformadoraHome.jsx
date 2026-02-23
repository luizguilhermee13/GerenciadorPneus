import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient"; // Importando o cliente do Supabase
import {
  Truck,
  RefreshCw,
  ClipboardList,
  History,
  BarChart3,
  Settings2,
  PackageCheck,
  Loader2,
} from "lucide-react";

function ReformadoraHome() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState({ naRef: 0, entregues: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buscarDadosReais();
  }, []);

  const buscarDadosReais = async () => {
    try {
      setLoading(true);

      // 1. Buscar pneus que estão "Em Aberto" (Aguardando reforma ou em processo)
      // Contamos todos que NÃO foram entregues ainda
      const { count: naRef, error: errorAberto } = await supabase
        .from("itens_coleta")
        .select("*", { count: "exact", head: true })
        .neq("status_item", "ENTREGUE");

      // 2. Buscar pneus "Finalizados" (Histórico de entregas)
      const { count: entregues, error: errorEntregues } = await supabase
        .from("itens_coleta")
        .select("*", { count: "exact", head: true })
        .eq("status_item", "ENTREGUE");

      if (errorAberto || errorEntregues)
        throw new Error("Erro ao buscar contadores");

      setResumo({
        naRef: naRef || 0,
        entregues: entregues || 0,
      });
    } catch (err) {
      console.error("Erro ao carregar resumo home:", err);
    } finally {
      setLoading(false);
    }
  };

  const menus = [
    {
      label: "Enviar Coleta",
      sub: "Registrar saída de pneus",
      path: "/reformadora/enviar",
      cor: "bg-blue-600",
      icone: <Truck size={35} />,
    },
    {
      label: "Atualizar Coleta",
      sub: "Dar baixas e status",
      path: "/reformadora/atualizar",
      cor: "bg-orange-500",
      icone: <RefreshCw size={35} />,
    },
    {
      label: "Coletas Realizadas",
      sub: "Consultar registros",
      path: "/reformadora/consultar",
      cor: "bg-slate-800",
      icone: <ClipboardList size={35} />,
    },
    {
      label: "Histórico Geral",
      sub: "Linha do tempo de pneus",
      path: "/reformadora/historico",
      cor: "bg-purple-600",
      icone: <History size={35} />,
    },
    {
      label: "Indicadores e BI",
      sub: "Balanço e Estatísticas",
      path: "/reformadora/indicadores",
      cor: "bg-emerald-600",
      icone: <BarChart3 size={35} />,
    },
    {
      label: "Dados Importantes",
      sub: "Configurações técnicas",
      path: "/reformadora/dados-importantes",
      cor: "bg-slate-400",
      icone: <Settings2 size={35} />,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 md:p-12 font-sans text-slate-900">
      <div className="max-w-[1500px] mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-16 border-b border-slate-200 pb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">
              Controle de Reformadora
            </h1>
            <p className="text-slate-500 font-black uppercase text-xs tracking-[0.2em] mt-2">
              Painel de Gestão de Recapitagem • Dados em Tempo Real
            </p>
          </div>

          {/* RESUMO RÁPIDO (CARDS TOPO) */}
          <div className="flex gap-6 mt-8 md:mt-0">
            <div className="bg-white px-8 py-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5 min-w-[200px]">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                <PackageCheck size={30} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Em Aberto
                </p>
                {loading ? (
                  <Loader2 className="animate-spin text-slate-300" size={20} />
                ) : (
                  <p className="text-3xl font-black text-slate-800">
                    {resumo.naRef}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-white px-8 py-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-5 min-w-[200px]">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Truck size={30} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-wider">
                  Finalizados
                </p>
                {loading ? (
                  <Loader2 className="animate-spin text-slate-300" size={20} />
                ) : (
                  <p className="text-3xl font-black text-slate-800">
                    {resumo.entregues}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* GRID DE CARDS DE MENU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {menus.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 text-left flex flex-col justify-between min-h-[280px]"
            >
              <div
                className={`${item.cor} text-white w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}
              >
                {item.icone}
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                  {item.label}
                </h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                  {item.sub}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* RODAPÉ */}
        <div className="mt-20 flex items-center justify-center gap-8 text-xs font-black text-slate-400 uppercase tracking-[0.4em]">
          <span>Sistema de Monitoramento v2.5</span>
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Banco de Dados: Conectado</span>
        </div>
      </div>
    </div>
  );
}

export default ReformadoraHome;
