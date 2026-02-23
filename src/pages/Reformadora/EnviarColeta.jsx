import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../../services/supabaseClient";

function EnviarColeta() {
  const navigate = useNavigate();

  // Estado inicial completo do cabeçalho
  const [cabecalho, setCabecalho] = useState({
    numeroNota: "",
    dataColeta: new Date().toISOString().split("T")[0],
    id_garagem: 2, // Default: Vitorino (ID 2)
    id_reformadora: 1, // Default: JBQ (ID 1)
  });

  const [pneus, setPneus] = useState([]);
  const [loading, setLoading] = useState(false);

  const obterPrecoPorMedida = (medida, motivo) => {
    if (motivo === "RECUSADO" || motivo === "RECLAMAÇÃO") return 0;
    if (motivo === "CONSERTO") return 100;

    const tabelaReforma = {
      "275/80R22.5": 525.0,
      "215/75R17.5": 365.0,
      "295/80R22.5": 525.0,
    };
    return tabelaReforma[medida] || 0;
  };

  const buscarPneuNoBanco = async (index, fogo) => {
    if (!fogo) return;
    try {
      const { data, error } = await supabase
        .from("pneus")
        .select("*")
        .eq("numero_fogo", fogo.toUpperCase())
        .maybeSingle();

      if (data) {
        const novaLista = [...pneus];
        novaLista[index] = {
          ...novaLista[index],
          medida: data.medida || novaLista[index].medida,
          marca: data.marca || novaLista[index].marca,
          desenho: data.desenho || novaLista[index].desenho,
          dot: data.dot || "",
          vida: data.vida || "1",
          sulco: data.sulco_atual || "",
          preco: obterPrecoPorMedida(
            data.medida || novaLista[index].medida,
            novaLista[index].motivo,
          ),
        };
        setPneus(novaLista);
      }
    } catch (err) {
      console.error("Erro ao buscar pneu:", err);
    }
  };

  const formatarMoeda = (valor) => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const atualizarCabecalho = (campo, valor) => {
    setCabecalho({ ...cabecalho, [campo]: valor });
  };

  const adicionarPneu = () => {
    const padraoMedida = "275/80R22.5";
    const padraoMotivo = "REFORMA";
    const novoPneu = {
      posicao: pneus.length + 1,
      medida: padraoMedida,
      marca: "GOODYEAR",
      desenho: "LISO",
      fogo: "",
      dot: "",
      vida: "1",
      sulco: "",
      motivo: padraoMotivo,
      preco: obterPrecoPorMedida(padraoMedida, padraoMotivo),
    };
    setPneus([...pneus, novoPneu]);
  };

  const atualizarPneu = (index, campo, valor) => {
    const novaLista = [...pneus];
    const valorFormatado =
      typeof valor === "string" ? valor.toUpperCase() : valor;

    // Máscara simples para DOT (apenas 4 dígitos)
    if (campo === "dot") {
      novaLista[index][campo] = valor.replace(/\D/g, "").substring(0, 4);
    } else {
      novaLista[index][campo] = valorFormatado;
    }

    if (campo === "medida" || campo === "motivo") {
      novaLista[index].preco = obterPrecoPorMedida(
        novaLista[index].medida,
        novaLista[index].motivo,
      );
    }
    setPneus(novaLista);
  };

  const removerPneu = (index) => {
    const filtrados = pneus.filter((_, i) => i !== index);
    setPneus(filtrados.map((p, i) => ({ ...p, posicao: i + 1 })));
  };

  const salvarColeta = async () => {
    if (!cabecalho.numeroNota || pneus.length === 0) {
      alert("Preencha a nota e adicione pneus.");
      return;
    }
    setLoading(true);

    try {
      // 1. Cria a coleta (Cabeçalho)
      const { data: coletaCriada, error: errColeta } = await supabase
        .from("coletas")
        .insert([
          {
            numero_nota: cabecalho.numeroNota,
            data_envio: cabecalho.dataColeta,
            id_garagem: parseInt(cabecalho.id_garagem),
            id_reformadora: parseInt(cabecalho.id_reformadora),
            status: "ABERTA",
          },
        ])
        .select()
        .single();

      if (errColeta) throw errColeta;

      // 2. Salva os pneus vinculados a essa coleta
      for (const p of pneus) {
        // AQUI ESTAVA O ERRO: Adicionamos os campos que faltavam abaixo
        await supabase.from("itens_coleta").insert([
          {
            id_coleta: coletaCriada.id,
            numero_fogo: p.fogo,
            medida: p.medida, // Enviando Medida
            marca: p.marca, // Enviando Marca
            modelo: p.desenho, // Enviando o que você chama de Desenho como Modelo
            dot: p.dot, // Enviando DOT
            vida: p.vida, // Enviando Vida
            sulco: p.sulco, // Enviando Sulco
            valor_reforma: p.preco,
            motivo_saida: p.motivo,
            desenho: p.desenho, // Mantendo desenho por compatibilidade
            status_item: "NA REFORMADORA",
          },
        ]);

        // 3. Atualiza ou Cria o pneu na tabela mestre de pneus (Estoque/Histórico)
        await supabase.from("pneus").upsert(
          {
            empresa: "SUA_EMPRESA",
            numero_fogo: p.fogo,
            medida: p.medida,
            marca: p.marca,
            dot: p.dot,
            vida: p.vida,
            sulco_atual: parseFloat(p.sulco) || 0,
            desenho: p.desenho,
          },
          { onConflict: "empresa, numero_fogo" },
        );
      }

      alert("Coleta salva com sucesso!");
      navigate("/reformadora");
    } catch (error) {
      alert("Erro ao salvar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans text-slate-900">
      <div className="max-w-[1850] mx-auto">
        <div className="flex justify-between items-center mb-10">
          <button
            onClick={() => navigate("/reformadora")}
            className="flex items-center gap-3 text-slate-400 hover:text-slate-800 font-black uppercase text-sm transition-all"
          >
            <ArrowLeft size={20} /> Voltar ao Painel
          </button>
          <div className="flex gap-6">
            <button
              onClick={adicionarPneu}
              className="bg-white border-2 border-blue-600 text-blue-600 font-black px-8 py-4 rounded-2xl hover:bg-blue-50 transition-all uppercase text-sm flex items-center gap-3 shadow-sm"
            >
              <Plus size={22} /> Adicionar Pneu
            </button>
            <button
              onClick={salvarColeta}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-2xl shadow-xl flex items-center gap-3 uppercase text-sm transition-all"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <Save size={22} />
              )}
              {loading ? "Salvando..." : "Finalizar Coleta"}
            </button>
          </div>
        </div>

        {/* Cabeçalho */}
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm mb-10">
          <h1 className="text-2xl font-black text-slate-800 uppercase mb-8">
            Nova Guia de Saída
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-slate-400 uppercase">
                Nº Nota
              </label>
              <input
                type="text"
                value={cabecalho.numeroNota}
                onChange={(e) =>
                  atualizarCabecalho("numeroNota", e.target.value.toUpperCase())
                }
                className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-slate-400 uppercase">
                Data
              </label>
              <input
                type="date"
                value={cabecalho.dataColeta}
                onChange={(e) =>
                  atualizarCabecalho("dataColeta", e.target.value)
                }
                className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-slate-400 uppercase">
                Garagem
              </label>
              <select
                value={cabecalho.id_garagem}
                onChange={(e) =>
                  atualizarCabecalho("id_garagem", e.target.value)
                }
                className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg"
              >
                <option value={2}>VITORINO</option>
                <option value={3}>BANDEIRANTES</option>
                <option value={1}>SÃO FRANCISCO</option>
              </select>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-xs font-black text-slate-400 uppercase">
                Reformadora
              </label>
              <select
                value={cabecalho.id_reformadora}
                onChange={(e) =>
                  atualizarCabecalho("id_reformadora", e.target.value)
                }
                className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-blue-500 outline-none font-bold text-lg text-blue-600"
              >
                <option value={1}>JBQ PNEUS</option>
                <option value={2}>JACAR</option>
                <option value={3}>ALVORADA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-400 font-black text-xs uppercase">
                <th className="p-6 text-center w-20">Pos</th>
                <th className="p-6">Medida</th>
                <th className="p-6">Marca</th>
                <th className="p-6">Desenho</th>
                <th className="p-6 text-center text-blue-200">Nº Fogo</th>
                <th className="p-6 text-center">Dot</th>
                <th className="p-6 text-center">Vida</th>
                <th className="p-6 text-center">Sulco</th>
                <th className="p-6">Motivo</th>
                <th className="p-6 text-right">Preço</th>
                <th className="p-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pneus.map((pneu, index) => (
                <tr
                  key={index}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="p-5 text-center font-black text-slate-300">
                    {pneu.posicao}
                  </td>
                  <td className="p-4">
                    <select
                      value={pneu.medida}
                      onChange={(e) =>
                        atualizarPneu(index, "medida", e.target.value)
                      }
                      className="w-full bg-transparent font-bold outline-none"
                    >
                      <option value="275/80R22.5">275/80R22.5</option>
                      <option value="215/75R17.5">215/75R17.5</option>
                      <option value="295/80R22.5">295/80R22.5</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={pneu.marca}
                      onChange={(e) =>
                        atualizarPneu(index, "marca", e.target.value)
                      }
                      className="w-full bg-transparent font-bold outline-none uppercase"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={pneu.desenho}
                      onChange={(e) =>
                        atualizarPneu(index, "desenho", e.target.value)
                      }
                      className="w-full bg-transparent font-black text-blue-600 outline-none uppercase"
                    />
                  </td>
                  <td className="p-4">
                    <input
                      type="text"
                      value={pneu.fogo}
                      onBlur={(e) => buscarPneuNoBanco(index, e.target.value)}
                      onChange={(e) =>
                        atualizarPneu(index, "fogo", e.target.value)
                      }
                      className="w-full bg-blue-50 p-3 rounded-xl font-black text-blue-700 text-center outline-none"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="text"
                      value={pneu.dot}
                      onChange={(e) =>
                        atualizarPneu(index, "dot", e.target.value)
                      }
                      className="w-16 bg-slate-50 rounded-lg p-2 text-center font-bold outline-none border border-slate-100"
                      placeholder="0000"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="number"
                      value={pneu.vida}
                      onChange={(e) =>
                        atualizarPneu(index, "vida", e.target.value)
                      }
                      className="w-14 bg-slate-50 rounded-lg p-2 text-center font-bold outline-none border border-slate-100"
                    />
                  </td>
                  <td className="p-4 text-center">
                    <input
                      type="number"
                      value={pneu.sulco}
                      onChange={(e) =>
                        atualizarPneu(index, "sulco", e.target.value)
                      }
                      className="w-16 bg-slate-50 rounded-lg p-2 text-center font-bold outline-none border border-slate-100"
                      placeholder="mm"
                    />
                  </td>
                  <td className="p-4">
                    <select
                      value={pneu.motivo}
                      onChange={(e) =>
                        atualizarPneu(index, "motivo", e.target.value)
                      }
                      className="w-full bg-transparent font-black text-xs outline-none"
                    >
                      <option value="REFORMA">REFORMA</option>
                      <option value="CONSERTO">CONSERTO</option>
                      <option value="RECUSADO">RECUSADO</option>
                      <option value="RECLAMAÇÃO">RECLAMAÇÃO</option>
                    </select>
                  </td>
                  <td className="p-4 text-right font-mono font-black text-emerald-600">
                    {formatarMoeda(pneu.preco)}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => removerPneu(index)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Rodapé Resumo */}
        {pneus.length > 0 && (
          <div className="mt-10 flex justify-between items-center bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl">
            <div>
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Resumo
              </p>
              <h2 className="text-xl font-bold">
                {pneus.length} pneus selecionados
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest">
                Total Estimado
              </p>
              <h2 className="text-6xl font-black text-emerald-400">
                {formatarMoeda(pneus.reduce((acc, p) => acc + p.preco, 0))}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnviarColeta;
