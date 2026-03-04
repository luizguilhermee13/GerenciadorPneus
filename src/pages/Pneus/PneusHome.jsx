import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

export default function PneusHome() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState({
    total: 0,
    reformadora: 0,
    estoque: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function carregarDados() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("contagem_pneus_view")
          .select("*");
        if (data && data.length > 0) {
          const info = data[0];
          setResumo({
            total: info.total || 0,
            reformadora: info.reforma || 0,
            estoque: info.estoque || 0,
          });
        }
      } catch (error) {
        console.error("Erro:", error.message);
      } finally {
        setLoading(false);
      }
    }
    carregarDados();
  }, []);

  const cards = [
    {
      title: "Busca Geral",
      icon: "🔍",
      path: "/pneus/busca",
      color: "bg-blue-100",
    },
    {
      title: "Inventário",
      icon: "📝",
      path: "/pneus/inventario",
      color: "bg-purple-100",
    }, // CARD ADICIONADO
    {
      title: "Cadastrar Novo",
      icon: "➕",
      path: "/pneus/cadastro",
      color: "bg-green-100",
    },
    {
      title: "Na Reformadora",
      icon: "⚙️",
      path: "/pneus/na-reforma",
      color: "bg-yellow-100",
    },
    {
      title: "Pneus a Remover",
      icon: "🧹",
      path: "/pneus/remover",
      color: "bg-orange-100",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-8 text-gray-800 uppercase tracking-widest">
        Gerenciamento de Pneus
      </h1>

      {/* Grid ajustada para 5 colunas no desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className={`${card.color} p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center border border-transparent hover:border-gray-300`}
          >
            <span className="text-4xl mb-3">{card.icon}</span>
            <h3 className="font-bold text-lg">{card.title}</h3>
            <p className="text-[10px] text-gray-400 mt-2 uppercase font-semibold">
              Clique para gerenciar
            </p>
          </div>
        ))}
      </div>

      {/* Resumo da Frota */}
      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-center font-bold text-gray-500 mb-8 text-xs uppercase tracking-widest">
          Resumo da Frota
        </h2>
        {loading ? (
          <p className="text-center animate-pulse text-gray-400">
            Carregando...
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center border-r">
              <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">
                Total
              </p>
              <p className="text-4xl font-black text-gray-800">
                {resumo.total}
              </p>
            </div>
            <div className="text-center border-r">
              <p className="text-[10px] font-bold text-yellow-600 uppercase mb-1">
                Reforma
              </p>
              <p className="text-4xl font-black text-gray-800">
                {resumo.reformadora}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-green-600 uppercase mb-1">
                Estoque
              </p>
              <p className="text-4xl font-black text-gray-800">
                {resumo.estoque}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
