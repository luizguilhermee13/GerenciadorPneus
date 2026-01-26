// Componente para o cabeçalho da coleta
export default function CabecalhoColeta({ dados, onDadosChange }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Dados da Coleta</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Data *</label>
          <input
            type="date"
            value={dados.data}
            onChange={(e) => onDadosChange("data", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Garagem *</label>
          <select
            value={dados.garagem}
            onChange={(e) => onDadosChange("garagem", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Selecione</option>
            <option value="Bandeirantes">Bandeirantes</option>
            <option value="SaoFrancisco">São Francisco</option>
            <option value="Vitorino">Vitorino</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nº Coleta</label>
          <input
            type="text"
            value={dados.numeroColeta}
            className="w-full border rounded px-3 py-2 bg-gray-100"
            disabled
            placeholder="Auto-gerado"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Reformadora *
          </label>
          <select
            value={dados.reformadora}
            onChange={(e) => onDadosChange("reformadora", e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          >
            <option value="">Selecione</option>
            <option value="ANSAL_VITORINO_BRAGA">ANSAL - VITORINO BRAGA</option>
            <option value="OUTRA_A">Outra Reformadora A</option>
            <option value="OUTRA_B">Outra Reformadora B</option>
          </select>
        </div>
      </div>
    </div>
  );
}
