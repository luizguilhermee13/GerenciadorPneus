import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient"; // Importamos o supabase diretamente para usar a View

export default function PneusHome() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState({
    total: 0,
    reformadora: 0,
    estoque: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ... dentro do useEffect ...
    async function carregarDados() {
      try {
        setLoading(true);

        // Adicionamos um check para evitar erro de 'auth' caso o cliente não tenha iniciado
        if (!supabase) return;

        const { data, error } = await supabase
          .from("contagem_pneus_view")
          .select("*"); // Removi o .single() para evitar erro caso a view mude

        if (error) throw error;

        if (data && data.length > 0) {
          const info = data[0]; // Como é um resumo, pegamos a primeira linha
          setResumo({
            total: info.total || 0,
            reformadora: info.reforma || 0,
            estoque: info.estoque || 0,
          });
        }
      } catch (error) {
        console.error("Erro ao carregar resumo:", error.message);
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
      desc: "Filtrar por empresa e fogo",
    },
    {
      title: "Cadastrar Novo",
      icon: "➕",
      path: "/pneus/cadastro",
      color: "bg-green-100",
      desc: "Adicionar pneu unitário",
    },
    {
      title: "Na Reformadora",
      icon: "⚙️",
      path: "/pneus/na-reforma",
      color: "bg-yellow-100",
      desc: "Ver pneus em manutenção",
    },
    {
      title: "Sucatas",
      icon: "🗑️",
      path: "/pneus/sucatas",
      color: "bg-red-100",
      desc: "Histórico de descartes",
    },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-center text-2xl font-bold mb-8 text-gray-800 uppercase tracking-widest">
        Gerenciamento de Pneus
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className={`${card.color} p-6 rounded-2xl shadow-sm hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center border border-transparent hover:border-gray-300`}
          >
            <span className="text-4xl mb-3">{card.icon}</span>
            <h3 className="font-bold text-lg">{card.title}</h3>
            <p className="text-xs text-gray-400 mt-1 uppercase">
              Clique para gerenciar
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border">
        <h2 className="text-center font-bold text-gray-500 mb-8 text-xs uppercase tracking-widest">
          Resumo da Frota
        </h2>
        {loading ? (
          <p className="text-center animate-pulse text-gray-400">
            Carregando indicadores...
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center border-r">
              <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">
                Total Cadastrado
              </p>
              <p className="text-4xl font-black text-gray-800">
                {resumo.total.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="text-center border-r">
              <p className="text-[10px] font-bold text-yellow-600 uppercase mb-1">
                Na Reformadora
              </p>
              <p className="text-4xl font-black text-gray-800">
                {resumo.reformadora.toLocaleString("pt-BR")}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-green-600 uppercase mb-1">
                Em Estoque
              </p>
              <p className="text-4xl font-black text-gray-800">
                {resumo.estoque.toLocaleString("pt-BR")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
