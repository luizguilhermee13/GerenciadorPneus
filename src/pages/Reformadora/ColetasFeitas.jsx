import { useState, useEffect } from "react";
import { formatarMoeda } from "./utils/formatadores";

function ColetasFeitas() {
  const [coletas, setColetas] = useState([]);

  useEffect(() => {
    const coletasSalvas = JSON.parse(localStorage.getItem("coletas") || "[]");
    setColetas(coletasSalvas);
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📋 Relatório de Notas de Coleta
      </h1>

      <div className="space-y-8">
        {coletas.map((coleta) => (
          <div
            key={coleta.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            {/* CABEÇALHO DA NOTA */}
            <div className="bg-gray-100 p-4 border-b grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">
                  Nº da Nota/Coleta
                </p>
                <p className="font-mono font-bold text-blue-700">
                  {coleta.numeroNota || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">
                  Data da Coleta
                </p>
                <p className="font-bold">{coleta.dataColeta}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">
                  Garagem (Origem)
                </p>
                <p className="font-bold">{coleta.garagem}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-500">
                  Reformadora (Destino)
                </p>
                <p className="font-bold text-orange-600">
                  {coleta.reformadora}
                </p>
              </div>
            </div>

            {/* TABELA DE PNEUS DA NOTA */}
            <div className="p-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-400 border-b">
                    <th className="pb-2">Fogo</th>
                    <th className="pb-2">Medida</th>
                    <th className="pb-2">Marca/Modelo</th>
                    <th className="pb-2 text-right">Valor Unit.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {coleta.pneus?.map((pneu, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="py-2 font-mono font-bold text-red-600">
                        {pneu.numeroFogo}
                      </td>
                      <td className="py-2">{pneu.medida}</td>
                      <td className="py-2 text-gray-600">
                        {pneu.marca} {pneu.modelo}
                      </td>
                      <td className="py-2 text-right font-bold text-green-600">
                        {formatarMoeda(pneu.preco)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex justify-end border-t pt-2">
                <p className="text-lg font-black text-gray-800">
                  TOTAL DA NOTA:{" "}
                  {formatarMoeda(
                    coleta.pneus?.reduce(
                      (acc, p) => acc + parseFloat(p.preco),
                      0,
                    ),
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ColetasFeitas;
