import React, { useEffect, useState } from "react";
import { carroService } from "../../services/carroService";
import {
  Car,
  MapPin,
  Calendar,
  Palette,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function CarrosInfo() {
  const [carros, setCarros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    fetchCarros();
  }, []);

  async function fetchCarros() {
    try {
      setLoading(true);
      const data = await carroService.getAll();
      setCarros(data || []);
    } catch (error) {
      console.error("Erro ao carregar carros:", error);
    } finally {
      setLoading(false);
    }
  }

  const carrosFiltrados = carros.filter((c) => {
    const termo = busca.toLowerCase();
    return (
      c.numero_carro?.toLowerCase().includes(termo) ||
      c.garagem_nome?.toLowerCase().includes(termo)
    );
  });

  return (
    <div className="p-8 bg-[#F1F5F9] min-h-screen font-sans">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          FROTA <span className="text-blue-600">ANSAL</span>
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          {carrosFiltrados.length} veículos cadastrados no sistema
        </p>

        {/* BUSCA */}
        <div className="mt-8 relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Buscar por número do carro ou garagem..."
            className="w-full pl-12 pr-4 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-700 font-medium outline-none"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Carregando Frota...
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {carrosFiltrados.map((carro) => (
            <div
              key={carro.id}
              className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative"
            >
              {/* STATUS BADGE */}
              <div className="absolute top-6 right-6">
                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black ${carro.status === "ATIVO" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                >
                  <ShieldCheck size={10} />
                  {carro.status}
                </span>
              </div>

              {/* ICONE E NÚMERO */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors">
                  <Car size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-none">
                    {carro.numero_carro}
                  </h2>
                  <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">
                    {carro.tipo}
                  </p>
                </div>
              </div>

              {/* INFOS */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <MapPin size={16} className="text-slate-400" />
                  <span className="text-xs font-bold truncate">
                    {carro.garagem_nome || "Não definida"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <Calendar size={14} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-700">
                      Ano: {carro.ano}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <Palette size={14} className="text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-700 uppercase">
                      {carro.cor}
                    </span>
                  </div>
                </div>
              </div>

              {/* TIPO DE USO */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                  Operação:
                </span>
                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black rounded-full shadow-md shadow-blue-100">
                  {carro.uso}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
