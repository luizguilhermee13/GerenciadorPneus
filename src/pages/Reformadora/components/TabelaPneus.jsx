import React from "react";

export default function TabelaPneus({ pneus, onUpdatePneu, onRemovePneu }) {
  return (
    <div className="overflow-x-auto shadow-inner border rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="p-3 border">Medida</th>
            <th className="p-3 border">Marca</th>
            <th className="p-3 border">Modelo</th>
            <th className="p-3 border">Nº Fogo</th>
            <th className="p-3 border">DOT</th>
            <th className="p-3 border">Desenho</th>
            <th className="p-3 border">Preço (R$)</th>
            <th className="p-3 border text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {pneus.map((pneu, index) => (
            <tr key={index} className="hover:bg-blue-50 transition-colors">
              <td className="p-2 border">
                <input
                  type="text"
                  value={pneu.medida}
                  onChange={(e) =>
                    onUpdatePneu(index, "medida", e.target.value)
                  }
                  className="w-full bg-transparent focus:ring-1 focus:ring-blue-500 rounded px-1"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  value={pneu.marca}
                  onChange={(e) => onUpdatePneu(index, "marca", e.target.value)}
                  className="w-full bg-transparent focus:ring-1 focus:ring-blue-500 rounded px-1"
                />
              </td>
              <td className="p-2 border font-semibold text-blue-700">
                <input
                  type="text"
                  value={pneu.modelo}
                  onChange={(e) =>
                    onUpdatePneu(index, "modelo", e.target.value)
                  }
                  className="w-full bg-transparent focus:ring-1 focus:ring-blue-500 rounded px-1"
                />
              </td>
              <td className="p-2 border font-mono text-red-600">
                <input
                  type="text"
                  value={pneu.numeroFogo}
                  onChange={(e) =>
                    onUpdatePneu(index, "numeroFogo", e.target.value)
                  }
                  className="w-full bg-transparent focus:ring-1 focus:ring-blue-500 rounded px-1"
                />
              </td>
              <td className="p-2 border">
                <input
                  type="text"
                  maxLength="4"
                  value={pneu.dot}
                  onChange={(e) => onUpdatePneu(index, "dot", e.target.value)}
                  className="w-full bg-transparent focus:ring-1 focus:ring-blue-500 rounded px-1 text-center"
                />
              </td>
              <td className="p-2 border text-center uppercase text-xs">
                {pneu.desenho}
              </td>
              <td className="p-2 border">
                <input
                  type="number"
                  value={pneu.preco}
                  onChange={(e) => onUpdatePneu(index, "preco", e.target.value)}
                  className="w-full bg-transparent focus:ring-1 focus:ring-blue-500 rounded px-1"
                />
              </td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => onRemovePneu(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
