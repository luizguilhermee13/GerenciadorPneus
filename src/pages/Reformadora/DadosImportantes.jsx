import { Info, DollarSign, Phone, MapPin, MessageCircle } from "lucide-react";

function DadosImportantes() {
  const precosFixos = [
    { medida: "275/80R22.5", preco: 525.0, obs: "Liso/Misto" },
    { medida: "295/80R22.5", preco: 525.0, obs: "Liso/Misto" },
    { medida: "215/75R17.5", preco: 365.0, obs: "Liso/Misto" },
    { medida: "Conserto", preco: 100.0, obs: "Valor por Manchão" },
  ];

  const formatarMoeda = (valor) =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="p-10 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-[1600px] mx-auto">
        <h1 className="text-4xl font-black mb-12 text-slate-800 flex items-center gap-4 uppercase tracking-tighter">
          <Info className="text-blue-600" size={45} /> Informações Estratégicas
        </h1>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* CARD DE PREÇOS - LADO ESQUERDO */}
          <div className="bg-white rounded-[40px] shadow-xl border border-slate-200 overflow-hidden">
            <div className="bg-emerald-600 p-8 flex items-center justify-between">
              <h2 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                <DollarSign size={32} /> Tabela de Preços Atual
              </h2>
              <span className="bg-emerald-700 text-emerald-100 px-4 py-1 rounded-full text-xs font-bold uppercase">
                Valores Fixos
              </span>
            </div>

            <div className="p-8 space-y-6">
              {precosFixos.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-6 bg-slate-50 rounded-[24px] border border-slate-100 hover:border-emerald-200 transition-all"
                >
                  <div>
                    <p className="text-2xl font-black text-slate-800">
                      {item.medida}
                    </p>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      {item.obs}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-4xl font-black text-emerald-600">
                      {formatarMoeda(item.preco)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CARD DE CONTATOS E APOIO - LADO DIREITO */}
          <div className="space-y-10">
            {/* Contato Principal */}
            <div className="bg-white rounded-[40px] shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-blue-600 p-8 text-white">
                <h2 className="text-2xl font-black uppercase tracking-widest flex items-center gap-3">
                  <Phone size={32} /> Contato Reformadora
                </h2>
              </div>

              <div className="p-10">
                <div className="flex items-start gap-6 mb-8">
                  <div className="bg-blue-100 p-4 rounded-2xl text-blue-600 font-black text-2xl">
                    JBQ
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-800">
                      JBQ - Recapagem de Pneus
                    </h3>
                    <p className="flex items-center gap-2 text-slate-500 font-bold mt-1 uppercase tracking-wide">
                      <MapPin size={18} /> Matias Barbosa - MG
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-[24px] border border-green-100">
                    <p className="text-xs font-black text-green-600 uppercase mb-2">
                      WhatsApp Comercial
                    </p>
                    <p className="text-2xl font-black text-green-700 flex items-center gap-2">
                      <MessageCircle fill="currentColor" size={24} /> (32)
                      99999-9999
                    </p>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase mb-2">
                      Telefone Fixo
                    </p>
                    <p className="text-2xl font-black text-slate-700 flex items-center gap-2">
                      (32) 3232-3232
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dica/Aviso Importante */}
            <div className="bg-orange-500 rounded-[40px] p-10 text-white shadow-lg shadow-orange-200 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase mb-2 italic">
                  Atenção ao Prazo
                </h3>
                <p className="text-lg font-bold opacity-90">
                  O prazo médio de retorno é de 7 a 10 dias úteis. Sempre
                  conferir o número de fogo no ato da entrega!
                </p>
              </div>
              {/* Decoração de fundo */}
              <div className="absolute -right-10 -bottom-10 opacity-20 transform rotate-12">
                <Info size={200} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DadosImportantes;
