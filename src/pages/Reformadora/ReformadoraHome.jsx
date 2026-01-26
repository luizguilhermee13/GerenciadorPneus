import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function ReformadoraHome() {
  const [resumo, setResumo] = useState({ naRef: 0, entregues: 0 });

  useEffect(() => {
    // Busca dados reais do LocalStorage
    const coletas = JSON.parse(localStorage.getItem("coletas") || "[]");
    const entregues = JSON.parse(
      localStorage.getItem("pneusEntregues") || "[]",
    );

    let totalNaRef = 0;
    coletas.forEach((c) => {
      if (c.pneus) {
        totalNaRef += c.pneus.filter((p) => p.status !== "ENTREGUE").length;
      }
    });

    setResumo({ naRef: totalNaRef, entregues: entregues.length });
  }, []);

  const cards = [
    {
      label: "Nova Coleta",
      path: "/reformadora/coleta",
      cor: "bg-blue-100",
      icone: "📦",
    },
    {
      label: "Coletas Feitas",
      path: "/reformadora/coletas-feitas",
      cor: "bg-green-100",
      icone: "📊",
    },
    {
      label: "Pneus na Reformadora",
      path: "/reformadora/pneus-na-reformadora",
      cor: "bg-yellow-100",
      icone: "🛞",
    },
    {
      label: "Histórico Entregues",
      path: "/reformadora/pneus-entregues",
      cor: "bg-orange-100",
      icone: "🚚",
    },
    {
      label: "Dados Importantes",
      path: "/reformadora/dados-importantes",
      cor: "bg-purple-100",
      icone: "📋",
    },
    {
      label: "Histórico Geral",
      path: "/reformadora/historico-pneus",
      cor: "bg-red-100",
      icone: "📈",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-8">
        Reformadora - Controle de Pneus
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cards.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="block hover:scale-105 transition-transform duration-300"
          >
            <div
              className={`${item.cor} rounded-2xl flex flex-col items-center justify-center p-6 h-64 shadow-lg`}
            >
              <div className="text-4xl mb-4">{item.icone}</div>
              <p className="text-xl font-semibold text-center">{item.label}</p>
              <p className="text-xs text-gray-500 mt-2">
                Clique para gerenciar
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 p-6 bg-white rounded-xl shadow-inner border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          Resumo do Pátio
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-yellow-50 rounded-lg border-b-4 border-yellow-400">
            <p className="text-xs font-bold text-yellow-700 uppercase">
              Na Reformadora
            </p>
            <p className="text-3xl font-black">{resumo.naRef}</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border-b-4 border-orange-400">
            <p className="text-xs font-bold text-orange-700 uppercase">
              Entregues
            </p>
            <p className="text-3xl font-black">{resumo.entregues}</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border-b-4 border-blue-400">
            <p className="text-xs font-bold text-blue-700 uppercase">
              Tempo Médio
            </p>
            <p className="text-3xl font-black">7d</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReformadoraHome;
