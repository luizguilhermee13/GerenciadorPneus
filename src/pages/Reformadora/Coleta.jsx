import React, { useState } from "react";
import { formatarMoeda, obterPrecoPorMedida } from "./utils/formatadores";
import { validarDadosColeta } from "./utils/validacoes";

function Coleta() {
  const [dadosExtraidos, setDadosExtraidos] = useState([]);

  // Cabeçalho da Nota
  const [cabecalho, setCabecalho] = useState({
    numeroNota: "",
    dataColeta: new Date().toISOString().split("T")[0],
    garagem: "MATRIZ",
    reformadora: "JBQ",
  });

  const atualizarCabecalho = (campo, valor) => {
    setCabecalho({ ...cabecalho, [campo]: valor.toUpperCase() });
  };

  const adicionarPneuManual = () => {
    const padraoMedida = "275/80R22.5";
    const padraoMotivo = "REFORMA";

    const novoPneu = {
      medida: padraoMedida,
      marca: "GOODYEAR",
      modelo: "",
      numeroFogo: "",
      dot: "",
      qtdReforma: 1,
      desenho: "LISO",
      motivo: padraoMotivo,
      // Passamos medida e motivo para o calculador de preço
      preco: obterPrecoPorMedida(padraoMedida, padraoMotivo),
    };
    setDadosExtraidos([...dadosExtraidos, novoPneu]);
  };

  const atualizarPneu = (index, campo, valor) => {
    const novosDados = [...dadosExtraidos];

    // Atualiza o valor do campo que foi mexido
    novosDados[index][campo] = valor;

    // REGRA DE NEGÓCIO: Se mudar Medida OU Motivo, o preço precisa atualizar
    if (campo === "medida" || campo === "motivo") {
      novosDados[index].preco = obterPrecoPorMedida(
        novosDados[index].medida,
        novosDados[index].motivo,
      );
    }

    // Tratamento para DOT (apenas números e max 4 dígitos)
    if (campo === "dot") {
      novosDados[index][campo] = valor.replace(/\D/g, "").substring(0, 4);
    }

    setDadosExtraidos(novosDados);
  };

  const removerPneu = (index) => {
    setDadosExtraidos(dadosExtraidos.filter((_, i) => i !== index));
  };

  const handleSalvar = () => {
    if (!cabecalho.numeroNota) {
      alert("Por favor, informe o número da nota/coleta.");
      return;
    }

    if (dadosExtraidos.length === 0) {
      alert("Adicione pelo menos um pneu antes de salvar.");
      return;
    }

    const erros = validarDadosColeta(dadosExtraidos);
    if (erros.length > 0) {
      alert(erros.join("\n"));
      return;
    }

    const dadosParaSalvar = {
      ...cabecalho,
      id: Date.now(),
      pneus: dadosExtraidos,
      status: "COLETADO",
    };

    const historicoExistente = JSON.parse(
      localStorage.getItem("coletas") || "[]",
    );
    localStorage.setItem(
      "coletas",
      JSON.stringify([...historicoExistente, dadosParaSalvar]),
    );

    alert(`Coleta #${cabecalho.numeroNota} salva com sucesso!`);

    // Limpar campos após salvar
    setDadosExtraidos([]);
    setCabecalho({
      ...cabecalho,
      numeroNota: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* CABEÇALHO DO FORMULÁRIO */}
        <div className="bg-gray-800 p-6 text-white">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📋 Nova Coleta de Pneus
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-700 p-4 rounded-lg">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Nº Nota/Coleta
              </label>
              <input
                type="text"
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white font-mono"
                placeholder="Ex: 5050"
                value={cabecalho.numeroNota}
                onChange={(e) =>
                  atualizarCabecalho("numeroNota", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Data
              </label>
              <input
                type="date"
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                value={cabecalho.dataColeta}
                onChange={(e) =>
                  atualizarCabecalho("dataColeta", e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Garagem
              </label>
              <select
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                value={cabecalho.garagem}
                onChange={(e) => atualizarCabecalho("garagem", e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="BANDEIRANTES">Bandeirantes</option>
                <option value="SAOFRANCISCO">São Francisco</option>
                <option value="VITORINO">Vitorino</option>
                <option value="MATRIZ">Matriz</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">
                Reformadora
              </label>
              <select
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                value={cabecalho.reformadora}
                onChange={(e) =>
                  atualizarCabecalho("reformadora", e.target.value)
                }
              >
                <option value="JBQ">JBQ</option>
                <option value="JACAR">Jacar</option>
                <option value="ANUSAL">Anusal</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Listagem de Pneus
            </h2>
            <button
              onClick={adicionarPneuManual}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-bold shadow"
            >
              + Adicionar Pneu
            </button>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 text-gray-600 text-xs uppercase">
                <tr>
                  <th className="p-3 border text-center w-12">#</th>
                  <th className="p-3 border text-left">Medida</th>
                  <th className="p-3 border text-left">Marca</th>
                  <th className="p-3 border text-left">Modelo</th>
                  <th className="p-3 border text-left">Nº Fogo</th>
                  <th className="p-3 border text-center">DOT</th>
                  <th className="p-3 border text-center w-20">Ref.</th>
                  <th className="p-3 border text-left">Desenho</th>
                  <th className="p-3 border text-left">Motivo</th>
                  <th className="p-3 border text-center">Preço</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dadosExtraidos.map((pneu, index) => (
                  <tr
                    key={index}
                    className="text-sm hover:bg-blue-50 transition-colors"
                  >
                    <td className="p-2 border text-center">
                      <button
                        onClick={() => removerPneu(index)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </td>
                    <td className="p-2 border">
                      <select
                        value={pneu.medida}
                        onChange={(e) =>
                          atualizarPneu(index, "medida", e.target.value)
                        }
                        className="w-full bg-transparent outline-none"
                      >
                        <option value="275/80R22.5">275/80R22.5</option>
                        <option value="215/75R17.5">215/75R17.5</option>
                        <option value="295/80R22.5">295/80R22.5</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <select
                        value={pneu.marca}
                        onChange={(e) =>
                          atualizarPneu(index, "marca", e.target.value)
                        }
                        className="w-full bg-transparent outline-none"
                      >
                        <option value="GOODYEAR">GOODYEAR</option>
                        <option value="MICHELIN">MICHELIN</option>
                        <option value="PIRELLI">PIRELLI</option>
                        <option value="BRIDGESTONE">BRIDGESTONE</option>
                        <option value="OUTRA">OUTRA</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={pneu.modelo}
                        onChange={(e) =>
                          atualizarPneu(
                            index,
                            "modelo",
                            e.target.value.toUpperCase(),
                          )
                        }
                        className="w-full p-1 outline-none"
                        placeholder="MODELO"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={pneu.numeroFogo}
                        onChange={(e) =>
                          atualizarPneu(index, "numeroFogo", e.target.value)
                        }
                        className="w-full p-1 font-mono text-red-600 font-bold outline-none"
                        placeholder="FOGO"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        value={pneu.dot}
                        onChange={(e) =>
                          atualizarPneu(index, "dot", e.target.value)
                        }
                        className="w-full p-1 text-center outline-none"
                        placeholder="0000"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={pneu.qtdReforma}
                        onChange={(e) =>
                          atualizarPneu(index, "qtdReforma", e.target.value)
                        }
                        className="w-full p-1 text-center outline-none"
                      />
                    </td>
                    <td className="p-2 border">
                      <select
                        value={pneu.desenho}
                        onChange={(e) =>
                          atualizarPneu(index, "desenho", e.target.value)
                        }
                        className="w-full bg-transparent outline-none"
                      >
                        <option value="LISO">LISO</option>
                        <option value="MISTO">MISTO</option>
                        <option value="LAMEIRO">LAMEIRO</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <select
                        value={pneu.motivo}
                        onChange={(e) =>
                          atualizarPneu(index, "motivo", e.target.value)
                        }
                        className="w-full bg-transparent outline-none font-bold text-blue-700"
                      >
                        <option value="REFORMA">REFORMA</option>
                        <option value="CONSERTO">CONSERTO</option>
                        <option value="RECLAMAÇÃO">RECLAMAÇÃO</option>
                      </select>
                    </td>
                    <td className="p-2 border font-bold text-green-700 text-center bg-gray-50">
                      {formatarMoeda(pneu.preco)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {dadosExtraidos.length > 0 && (
            <div className="mt-8 border-t pt-6 flex justify-between items-center">
              <div className="text-gray-600 text-lg">
                Total:{" "}
                <span className="font-bold">
                  {formatarMoeda(
                    dadosExtraidos.reduce((acc, p) => acc + p.preco, 0),
                  )}
                </span>
              </div>
              <button
                onClick={handleSalvar}
                className="bg-green-600 text-white px-12 py-3 rounded-lg font-black hover:bg-green-700 shadow-xl transition-all transform hover:scale-105"
              >
                💾 FINALIZAR E SALVAR COLETA
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Coleta;
