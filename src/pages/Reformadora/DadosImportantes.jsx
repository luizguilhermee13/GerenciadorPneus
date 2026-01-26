import { formatarMoeda } from "./utils/formatadores";

function DadosImportantes() {
  const precosFixos = [
    { medida: "275/80R22.5", preco: 525.0, obs: "Liso/Misto" },
    { medida: "295/80R22.5", preco: 525.0, obs: "Liso/Misto" },
    { medida: "215/75R17.5", preco: 365.0, obs: "Liso/Misto" },
    { medida: "Conserto", preco: 100.0, obs: "Conserto" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        📌 Dados Importantes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Preços Fixos */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <h2 className="text-lg font-bold mb-4 text-green-700 uppercase">
            💰 Tabela de Preços Atual (Fixo)
          </h2>
          <div className="space-y-4">
            {precosFixos.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center p-3 bg-gray-50 rounded border"
              >
                <div>
                  <p className="font-bold text-gray-700">{item.medida}</p>
                  <p className="text-xs text-gray-500">{item.obs}</p>
                </div>
                <span className="text-xl font-black text-green-600">
                  {formatarMoeda(item.preco)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Card de Contatos */}
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <h2 className="text-lg font-bold mb-4 text-blue-700 uppercase">
            📞 Contato Reformadora
          </h2>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <p className="font-black text-blue-900 text-lg">JBQ - Pneus</p>
            <p className="text-sm font-medium text-blue-700 mb-3 uppercase">
              Ponto de Referência: Matias Barbosa - MG
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2 font-semibold">
                🟢 WhatsApp: (32) 99999-9999
              </p>
              <p className="flex items-center gap-2 font-semibold">
                ☎️ Fixo: (32) 3232-3232
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DadosImportantes;
