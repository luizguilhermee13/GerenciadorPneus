import React, { useState, useRef, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import html2canvas from "html2canvas";
import {
  Camera,
  Save,
  Search,
  X,
  PlusCircle,
  Calendar,
  Trash2,
} from "lucide-react";

export default function InventarioPneus() {
  const [carros, setCarros] = useState([]);
  const [carrosFiltrados, setCarrosFiltrados] = useState([]);
  const [carroSelecionado, setCarroSelecionado] = useState(null);
  const [pneusNoCarro, setPneusNoCarro] = useState([]);
  const [filtroCarro, setFiltroCarro] = useState("");
  const [garagemAtiva, setGaragemAtiva] = useState(null);
  const [dataInventario, setDataInventario] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [fogoBusca, setFogoBusca] = useState("");
  const [empresaBusca, setEmpresaBusca] = useState("27");
  const [dadosEdicao, setDadosEdicao] = useState({});

  const modalRef = useRef(null);
  const posicoesOpcoes = ["DD", "DE", "TDE", "TDI", "TEE", "TEI", "ESTEPE"];

  useEffect(() => {
    fetchCarros();
  }, []);

  useEffect(() => {
    let res = carros;
    if (garagemAtiva) res = res.filter((c) => c.id_garagem === garagemAtiva);
    if (filtroCarro)
      res = res.filter((c) => c.numero_carro.includes(filtroCarro));
    setCarrosFiltrados(res);
  }, [garagemAtiva, filtroCarro, carros]);

  const fetchCarros = async () => {
    const { data } = await supabase
      .from("carros")
      .select("id, numero_carro, id_garagem")
      .eq("status", "ATIVO");
    if (data) {
      const ordenados = data.sort((a, b) =>
        a.numero_carro.localeCompare(b.numero_carro, undefined, {
          numeric: true,
        }),
      );
      setCarros(ordenados);
      setCarrosFiltrados(ordenados);
    }
  };

  const abrirInventario = async (carroObj) => {
    setCarroSelecionado(carroObj);
    try {
      const { data, error } = await supabase
        .from("pneus")
        .select("*")
        .or(
          `carro_id.eq.${carroObj.id},centro_custo.eq.${carroObj.numero_carro}`,
        );

      if (error) throw error;
      setPneusNoCarro(data || []);
    } catch (e) {
      alert("Erro: " + e.message);
    }
  };

  const vincularPneuManual = async () => {
    if (!fogoBusca || !empresaBusca)
      return alert("Preencha Empresa e Nº Fogo!");
    try {
      const { data, error } = await supabase
        .from("pneus")
        .update({
          centro_custo: carroSelecionado.numero_carro,
          carro_id: carroSelecionado.id,
        })
        .match({ numero_fogo: fogoBusca.trim(), empresa: empresaBusca })
        .select();

      if (error) throw error;
      if (data.length === 0) return alert("Pneu não encontrado!");
      alert("Pneu vinculado!");
      setFogoBusca("");
      abrirInventario(carroSelecionado);
    } catch (e) {
      alert("Erro: " + e.message);
    }
  };

  const desvincularPneu = async (pneu) => {
    if (
      !window.confirm(`Deseja remover o pneu ${pneu.numero_fogo} deste carro?`)
    )
      return;
    try {
      const { error } = await supabase
        .from("pneus")
        .update({ carro_id: null, centro_custo: "ESTOQUE", posicao: null })
        .match({ id: pneu.id }); // Usa o ID único do registro para não errar

      if (error) throw error;
      alert("Pneu removido do carro e enviado ao estoque.");
      abrirInventario(carroSelecionado);
    } catch (e) {
      alert("Erro ao remover: " + e.message);
    }
  };

  const salvarPrint = () => {
    if (modalRef.current) {
      html2canvas(modalRef.current, { scale: 2 }).then((canvas) => {
        const link = document.createElement("a");
        link.download = `inventario-${carroSelecionado.numero_carro}.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans">
      {!carroSelecionado ? (
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="bg-white p-4 rounded-[25px] shadow-sm flex gap-4 items-center border border-slate-200 flex-1">
              <Search className="text-slate-400" />
              <input
                placeholder="Buscar carro..."
                className="flex-1 border-none focus:ring-0 font-bold"
                onChange={(e) => setFiltroCarro(e.target.value)}
              />
            </div>
            <div className="bg-white p-2 rounded-[25px] shadow-sm flex gap-2 border border-slate-200">
              {[null, 1, 2, 3].map((g) => (
                <button
                  key={g}
                  onClick={() => setGaragemAtiva(g)}
                  className={`px-6 py-2 rounded-full font-bold text-sm ${garagemAtiva === g ? "bg-blue-600 text-white" : "text-slate-500"}`}
                >
                  {g === null ? "TODOS" : `G${g}`}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {carrosFiltrados.map((carro) => (
              <button
                key={carro.id}
                onClick={() => abrirInventario(carro)}
                className="bg-white p-6 rounded-[28px] hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-200 group text-center"
              >
                <div className="text-2xl font-black italic">
                  {carro.numero_carro}
                </div>
                <div className="text-[10px] opacity-50 font-bold uppercase">
                  Garagem {carro.id_garagem}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-white rounded-[45px] w-full max-w-5xl p-10 overflow-y-auto max-h-[95vh] relative shadow-2xl"
          >
            <button
              onClick={() => setCarroSelecionado(null)}
              className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors no-print"
            >
              <X />
            </button>

            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-6xl font-black italic text-slate-800 tracking-tighter">
                  VEÍCULO {carroSelecionado.numero_carro}
                </h2>
                <div className="flex items-center gap-3 mt-4 bg-slate-100 p-4 rounded-2xl w-fit border border-slate-200">
                  <Calendar size={24} className="text-blue-600" />
                  <input
                    type="date"
                    value={dataInventario}
                    onChange={(e) => setDataInventario(e.target.value)}
                    className="bg-transparent border-none p-0 focus:ring-0 text-2xl font-black text-slate-700 cursor-pointer"
                  />
                </div>
              </div>
              <button
                onClick={salvarPrint}
                className="bg-slate-800 text-white px-6 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all no-print"
              >
                <Camera size={20} /> SALVAR PRINT
              </button>
            </div>

            <div className="bg-blue-50 p-6 rounded-[30px] mb-8 flex flex-wrap md:flex-nowrap gap-4 items-end border border-blue-100 no-print">
              <div className="w-full md:w-32 text-left">
                <label className="block font-bold text-blue-900 text-[10px] mb-1 uppercase ml-2">
                  Empresa
                </label>
                <select
                  value={empresaBusca}
                  onChange={(e) => setEmpresaBusca(e.target.value)}
                  className="w-full bg-white border-none rounded-xl py-3 font-bold shadow-sm focus:ring-2 focus:ring-blue-400"
                >
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="77">77</option>
                </select>
              </div>
              <div className="flex-1 text-left">
                <label className="block font-bold text-blue-900 text-[10px] mb-1 uppercase ml-2">
                  Nº Fogo
                </label>
                <input
                  value={fogoBusca}
                  onChange={(e) => setFogoBusca(e.target.value)}
                  placeholder="Ex: 241418"
                  className="w-full bg-white border-none rounded-xl py-3 px-4 font-bold shadow-sm focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={vincularPneuManual}
                className="bg-blue-600 text-white px-8 py-3.5 rounded-xl font-black flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                <PlusCircle size={20} /> VINCULAR
              </button>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr className="text-[11px] uppercase text-slate-400 font-black">
                    <th className="px-6 py-4">Posição</th>
                    <th className="px-6 py-4">Fogo / Empresa</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pneusNoCarro.map((pneu) => (
                    <tr
                      key={pneu.id}
                      className="border-t border-slate-50 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4">
                        <select className="bg-white border border-slate-200 rounded-xl font-bold text-sm px-3 py-2">
                          <option value="">Posição...</option>
                          {posicoesOpcoes.map((op) => (
                            <option key={op} value={op}>
                              {op}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700 text-lg">
                          {pneu.numero_fogo}
                        </div>
                        <div className="text-[10px] px-2 bg-slate-100 rounded text-slate-500 inline-block font-bold uppercase">
                          Empresa {pneu.empresa}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2 no-print">
                          <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-xl shadow-md">
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => desvincularPneu(pneu)}
                            className="bg-red-100 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pneusNoCarro.length === 0 && (
                <div className="p-10 text-center text-slate-400 font-medium italic">
                  Nenhum pneu vinculado.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
