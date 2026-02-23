import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";

function AtualizarCadastro() {
  const { empresa, fogo } = useParams();
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarPneu = async () => {
      try {
        const { data, error } = await supabase
          .from("pneus")
          .select("*")
          .eq("empresa", empresa)
          .eq("numero_fogo", fogo)
          .maybeSingle();

        if (error) throw error;
        if (data) setDados(data);
        else {
          alert("Pneu não encontrado!");
          navigate(-1);
        }
      } catch (error) {
        console.error("Erro:", error.message);
      } finally {
        setLoading(false);
      }
    };
    carregarPneu();
  }, [empresa, fogo, navigate]);

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("pneus")
        .update(dados) // Aqui ele envia o objeto 'dados' completo com as alterações
        .eq("empresa", empresa)
        .eq("numero_fogo", fogo);

      if (error) throw error;
      alert("Cadastro atualizado com sucesso!");
      navigate(-1);
    } catch (error) {
      alert("Erro ao atualizar: " + error.message);
    }
  };

  if (loading)
    return <div className="p-20 text-center font-bold">Carregando...</div>;

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 flex justify-center items-start">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="bg-slate-800 p-6 text-white flex justify-between items-center">
          <h2 className="text-xl font-black uppercase italic">
            Editar Cadastro Completo
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-slate-700 px-6 py-2 rounded-xl font-bold text-xs hover:bg-slate-600"
          >
            VOLTAR
          </button>
        </div>

        <form onSubmit={handleSalvar} className="p-8 space-y-6">
          {/* IDENTIFICAÇÃO PRINCIPAL */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Nº Fogo
              </label>
              <input
                type="text"
                className="w-full bg-transparent text-xl font-black text-blue-600 outline-none"
                value={dados.numero_fogo || ""}
                onChange={(e) =>
                  setDados({ ...dados, numero_fogo: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Empresa
              </label>
              <input
                type="text"
                className="w-full bg-transparent text-xl font-black text-slate-700 outline-none"
                value={dados.empresa || ""}
                onChange={(e) =>
                  setDados({ ...dados, empresa: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                DOT
              </label>
              <input
                type="text"
                className="w-full bg-transparent text-xl font-black text-slate-700 outline-none"
                value={dados.dot || ""}
                onChange={(e) => setDados({ ...dados, dot: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MARCA, MEDIDA E DESENHO */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Marca
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500"
                value={dados.marca || ""}
                onChange={(e) =>
                  setDados({ ...dados, marca: e.target.value.toUpperCase() })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Medida
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={dados.medida || ""}
                onChange={(e) => setDados({ ...dados, medida: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Desenho
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={dados.desenho || ""}
                onChange={(e) =>
                  setDados({ ...dados, desenho: e.target.value })
                }
              />
            </div>

            {/* STATUS TÉCNICO */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Sulco (mm)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={dados.sulco_atual || ""}
                onChange={(e) =>
                  setDados({ ...dados, sulco_atual: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Vida Atual
              </label>
              <select
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={dados.vida || ""}
                onChange={(e) => setDados({ ...dados, vida: e.target.value })}
              >
                <option value="NOVO">NOVO</option>
                <option value="1REF">1ª REFORMA</option>
                <option value="2REF">2ª REFORMA</option>
                <option value="3REF">3ª REFORMA</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                KM Rodada
              </label>
              <input
                type="number"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={dados.km_rodada || ""}
                onChange={(e) =>
                  setDados({ ...dados, km_rodada: e.target.value })
                }
              />
            </div>

            {/* LOCALIZAÇÃO */}
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Posição
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500"
                value={dados.posicao || ""}
                onChange={(e) =>
                  setDados({ ...dados, posicao: e.target.value.toUpperCase() })
                }
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase mb-2">
                Centro de Custo
              </label>
              <input
                type="text"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500"
                value={dados.centro_custo || ""}
                onChange={(e) =>
                  setDados({ ...dados, centro_custo: e.target.value })
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 text-lg uppercase italic"
          >
            Salvar Todas as Alterações
          </button>
        </form>
      </div>
    </div>
  );
}

export default AtualizarCadastro;
