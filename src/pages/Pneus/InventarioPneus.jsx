import React, { useState, useRef } from "react";
import { supabase } from "../../services/supabaseClient";
import html2canvas from "html2canvas";
import {
  Camera,
  Clipboard,
  Save,
  Search,
  Trash2,
  CheckCircle2,
  Printer,
} from "lucide-react";

export default function InventarioPneus() {
  const [carroBusca, setCarroBusca] = useState("");
  const [pneusNoCarro, setPneusNoCarro] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataInventario, setDataInventario] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [dadosEdicao, setDadosEdicao] = useState({});

  const relatorioRef = useRef(null);

  const buscarPneus = async () => {
    if (!carroBusca) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("pneus")
        .select("*")
        .eq("centro_custo", carroBusca.trim())
        .order("posicao", { ascending: true });

      if (error) throw error;

      const initialStates = {};
      data.forEach((p) => {
        initialStates[p.numero_fogo] = {
          fogo: p.numero_fogo,
          posicao: p.posicao,
          sulco: "",
          km: "",
          print_evidencia: null, // Área para o Ctrl+V
        };
      });
      setDadosEdicao(initialStates);
      setPneusNoCarro(data || []);
    } catch (error) {
      alert("Erro: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Lógica de Colar Imagem (Igual à sua tela de limpeza)
  const handlePaste = (e, fogo) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setDadosEdicao((prev) => ({
            ...prev,
            [fogo]: { ...prev[fogo], print_evidencia: event.target.result },
          }));
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleCaptureRelatorio = async () => {
    if (relatorioRef.current) {
      const canvas = await html2canvas(relatorioRef.current, {
        scale: 2,
        backgroundColor: "#f1f5f9",
      });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Inventario_Carro_${carroBusca}_${dataInventario}.png`;
      link.click();
    }
  };

  const salvarPneu = async (pneuOriginal) => {
    const editado = dadosEdicao[pneuOriginal.numero_fogo];
    if (!editado.sulco || !editado.km) return alert("Preencha Sulco e KM!");

    try {
      // 1. Atualiza pneu
      await supabase
        .from("pneus")
        .update({
          numero_fogo: editado.fogo,
          posicao: editado.posicao,
        })
        .eq("id", pneuOriginal.id);

      // 2. Salva no histórico (incluindo a imagem colada se desejar)
      await supabase.from("inventario_pneus").insert([
        {
          numero_fogo: editado.fogo,
          numero_carro: carroBusca,
          sulco_informado: parseFloat(editado.sulco),
          km_veiculo: parseFloat(editado.km),
          data_movimentacao: dataInventario,
          url_foto: editado.print_evidencia, // Salva o base64 ou URL
        },
      ]);

      alert("Pneu atualizado!");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER CONTROLES */}
        <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/60 mb-8 flex flex-wrap items-end gap-4 border border-white">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Veículo
            </label>
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-slate-300"
                size={20}
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-bold"
                value={carroBusca}
                onChange={(e) => setCarroBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">
              Data Inventário
            </label>
            <input
              type="date"
              className="w-full p-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
              value={dataInventario}
              onChange={(e) => setDataInventario(e.target.value)}
            />
          </div>

          <button
            onClick={buscarPneus}
            className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Buscar
          </button>

          <button
            onClick={handleCaptureRelatorio}
            className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-black uppercase text-sm hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-slate-300"
          >
            <Camera size={18} /> Salvar Print
          </button>
        </div>

        {/* ÁREA DO RELATÓRIO (O que será fotografado) */}
        <div ref={relatorioRef} className="p-2">
          <div className="grid grid-cols-1 gap-6">
            {pneusNoCarro.map((pneu) => (
              <div
                key={pneu.id}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-200/50"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Dados Esquerda */}
                  <div className="lg:col-span-3 space-y-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase">
                        Nº Fogo
                      </label>
                      <input
                        type="text"
                        value={dadosEdicao[pneu.numero_fogo]?.fogo}
                        onChange={(e) =>
                          setDadosEdicao({
                            ...dadosEdicao,
                            [pneu.numero_fogo]: {
                              ...dadosEdicao[pneu.numero_fogo],
                              fogo: e.target.value,
                            },
                          })
                        }
                        className="w-full text-2xl font-black text-slate-800 border-b-2 border-slate-100 focus:border-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase">
                        Posição
                      </label>
                      <select
                        value={dadosEdicao[pneu.numero_fogo]?.posicao}
                        onChange={(e) =>
                          setDadosEdicao({
                            ...dadosEdicao,
                            [pneu.numero_fogo]: {
                              ...dadosEdicao[pneu.numero_fogo],
                              posicao: e.target.value,
                            },
                          })
                        }
                        className="w-full p-2 bg-slate-50 rounded-xl text-xs font-bold uppercase"
                      >
                        <option value="DIANTEIRO ESQUERDO">
                          DIANTEIRO ESQ
                        </option>
                        <option value="DIANTEIRO DIREITO">DIANTEIRO DIR</option>
                        <option value="TRASEIRO ESQUERDO INTERNO">
                          TRAS ESQ INT
                        </option>
                        <option value="TRASEIRO ESQUERDO EXTERNO">
                          TRAS ESQ EXT
                        </option>
                        <option value="TRASEIRO DIREITO INTERNO">
                          TRAS DIR INT
                        </option>
                        <option value="TRASEIRO DIREITO EXTERNO">
                          TRAS DIR EXT
                        </option>
                        <option value="ESTEPE">ESTEPE</option>
                      </select>
                    </div>
                  </div>

                  {/* Inputs Centro */}
                  <div className="lg:col-span-3 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-blue-500 uppercase">
                        Sulco mm
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        onChange={(e) =>
                          setDadosEdicao({
                            ...dadosEdicao,
                            [pneu.numero_fogo]: {
                              ...dadosEdicao[pneu.numero_fogo],
                              sulco: e.target.value,
                            },
                          })
                        }
                        className="w-full p-3 bg-blue-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-black text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-blue-500 uppercase">
                        KM Veículo
                      </label>
                      <input
                        type="number"
                        onChange={(e) =>
                          setDadosEdicao({
                            ...dadosEdicao,
                            [pneu.numero_fogo]: {
                              ...dadosEdicao[pneu.numero_fogo],
                              km: e.target.value,
                            },
                          })
                        }
                        className="w-full p-3 bg-blue-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 font-black text-center"
                      />
                    </div>
                  </div>

                  {/* ÁREA DE COLAGEM (Ctrl+V) */}
                  <div className="lg:col-span-4">
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2">
                      Evidência (Ctrl+V)
                    </label>
                    <div
                      onPaste={(e) => handlePaste(e, pneu.numero_fogo)}
                      className="h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden group hover:border-blue-400 transition-all cursor-pointer"
                    >
                      {dadosEdicao[pneu.numero_fogo]?.print_evidencia ? (
                        <img
                          src={dadosEdicao[pneu.numero_fogo].print_evidencia}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-300 group-hover:text-blue-400">
                          <Clipboard size={20} />
                          <span className="text-[8px] font-black uppercase">
                            Colar Print
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ação */}
                  <div className="lg:col-span-2">
                    <button
                      onClick={() => salvarPneu(pneu)}
                      className="w-full bg-emerald-500 text-white p-4 rounded-2xl font-black uppercase text-[10px] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Save size={16} /> Salvar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
