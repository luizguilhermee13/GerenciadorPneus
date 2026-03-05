import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../services/supabaseClient";
import {
  Search,
  CheckCircle,
  Clipboard,
  Save,
  Loader2,
  X,
  History,
  Info,
  Maximize2,
  ListChecks,
  AlertCircle,
} from "lucide-react";

const PneusARemover = () => {
  const [pneus, setPneus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("");
  const [pneuSelecionado, setPneuSelecionado] = useState(null);
  const [imagemExpandida, setImagemExpandida] = useState(null);

  useEffect(() => {
    fetchPneus();
  }, []);

  const fetchPneus = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pneus_limpeza")
      .select("*")
      .order("dias_parados", { ascending: false });
    if (!error) setPneus(data);
    setLoading(false);
  }; // Lógica dos Contadores (Comparador)

  const stats = useMemo(() => {
    const total = pneus.length;
    const avaliados = pneus.filter((p) => p.analisado).length;
    const restantes = total - avaliados;
    const progresso = total > 0 ? (avaliados / total) * 100 : 0;
    return { total, avaliados, restantes, progresso };
  }, [pneus]);

  const handlePaste = (e, campo) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setPneuSelecionado({
            ...pneuSelecionado,
            [campo]: event.target.result,
          });
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleSalvarAnalise = async () => {
    const { error } = await supabase
      .from("pneus_limpeza")
      .update({
        foto_cadastro: pneuSelecionado.foto_cadastro,
        foto_movimentacao: pneuSelecionado.foto_movimentacao,
        analisado: true,
      })
      .eq("id", pneuSelecionado.id);

    if (!error) {
      setPneuSelecionado(null);
      fetchPneus();
    }
  };

  const pneusFiltrados = pneus.filter(
    (p) =>
      p.numero_pneu.toLowerCase().includes(filtro.toLowerCase()) ||
      p.empresa.toLowerCase().includes(filtro.toLowerCase()),
  );

  return (
    <div className="p-4 md:p-12 bg-slate-50 min-h-screen font-sans text-slate-900">
           {" "}
      <div className="max-w-6xl mx-auto">
                {/* HEADER & COMPARADOR */}       {" "}
        <header className="mb-12">
                   {" "}
          <div className="text-center mb-10">
                       {" "}
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase italic tracking-tighter mb-4">
                            Higienização de Estoque            {" "}
            </h1>
                       {" "}
            <div className="h-2 w-64 bg-slate-200 mx-auto rounded-full overflow-hidden">
                           {" "}
              <div
                className="h-full bg-emerald-500 transition-all duration-1000"
                style={{ width: `${stats.progresso}%` }}
              ></div>
                         {" "}
            </div>
                     {" "}
          </div>
                    {/* CARDS DE ESTATÍSTICAS */}         {" "}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                       {" "}
            <div className="bg-white p-6 rounded-[24px] border-b-4 border-blue-500 shadow-sm flex items-center gap-5">
                           {" "}
              <div className="bg-blue-50 p-4 rounded-2xl text-blue-600">
                                <ListChecks size={30} />             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Total na Base                {" "}
                </p>
                               {" "}
                <p className="text-3xl font-black text-slate-800">
                                    {stats.total}               {" "}
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="bg-white p-6 rounded-[24px] border-b-4 border-emerald-500 shadow-sm flex items-center gap-5">
                           {" "}
              <div className="bg-emerald-50 p-4 rounded-2xl text-emerald-600">
                                <CheckCircle size={30} />             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Já Avaliados                {" "}
                </p>
                               {" "}
                <p className="text-3xl font-black text-slate-800">
                                    {stats.avaliados}               {" "}
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
                       {" "}
            <div className="bg-white p-6 rounded-[24px] border-b-4 border-orange-400 shadow-sm flex items-center gap-5">
                           {" "}
              <div className="bg-orange-50 p-4 rounded-2xl text-orange-600">
                                <AlertCircle size={30} />             {" "}
              </div>
                           {" "}
              <div>
                               {" "}
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Restantes                {" "}
                </p>
                               {" "}
                <p className="text-3xl font-black text-slate-800">
                                    {stats.restantes}               {" "}
                </p>
                             {" "}
              </div>
                         {" "}
            </div>
                     {" "}
          </div>
                   {" "}
          <div className="relative max-w-2xl mx-auto">
                       {" "}
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"
              size={24}
            />
                       {" "}
            <input
              type="text"
              placeholder="Localizar pneu na lista de limpeza..."
              className="w-full pl-14 pr-6 py-5 rounded-3xl border-none shadow-xl shadow-slate-200/50 focus:ring-4 focus:ring-blue-500/20 text-lg font-medium"
              onChange={(e) => setFiltro(e.target.value)}
            />
                     {" "}
          </div>
                 {" "}
        </header>
               {" "}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20">
                       {" "}
            <Loader2 className="animate-spin text-blue-600 mb-4" size={50} />   
                   {" "}
            <p className="font-black text-slate-400 uppercase">
                            Processando Inventário...            {" "}
            </p>
                     {" "}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
                       {" "}
            {pneusFiltrados.map((pneu) => (
              <div
                key={pneu.id}
                onClick={() => setPneuSelecionado(pneu)}
                className={`flex flex-col md:flex-row items-center justify-between p-6 md:p-8 rounded-[32px] border-2 transition-all cursor-pointer group ${
                  pneu.analisado
                    ? "bg-emerald-50/50 border-emerald-100 opacity-70"
                    : "bg-white border-transparent shadow-sm hover:shadow-xl hover:border-blue-400"
                }`}
              >
                               {" "}
                {/* (Mesmo conteúdo da lista anterior com pequenas melhorias visuais) */}
                               {" "}
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                                   {" "}
                  <div
                    className={`text-3xl font-black tracking-tighter ${pneu.analisado ? "text-emerald-700" : "text-slate-800"}`}
                  >
                                        {pneu.numero_pneu}                 {" "}
                  </div>
                                   {" "}
                  <div className="flex flex-col items-center md:items-start">
                                       {" "}
                    <span className="text-[10px] font-black text-slate-400 uppercase">
                                            Empresa                    {" "}
                    </span>
                                       {" "}
                    <span className="text-lg font-bold text-slate-600 uppercase">
                                            {pneu.empresa}                 
                       {" "}
                    </span>
                                     {" "}
                  </div>
                                   {" "}
                  <div
                    className={`px-4 py-1.5 rounded-xl font-black text-xs uppercase ${pneu.dias_parados > 365 ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}
                  >
                                        {pneu.dias_parados} dias                
                     {" "}
                  </div>
                                 {" "}
                </div>
                               {" "}
                <div className="mt-4 md:mt-0 flex items-center gap-4 text-slate-400 font-bold uppercase text-xs">
                                    {pneu.localizacao}                 {" "}
                  {pneu.analisado && (
                    <div className="bg-emerald-500 text-white p-1.5 rounded-full">
                                            <CheckCircle size={18} />           
                             {" "}
                    </div>
                  )}
                                 {" "}
                </div>
                             {" "}
              </div>
            ))}
                     {" "}
          </div>
        )}
             {" "}
      </div>
            {/* MODAL DE ANÁLISE */}     {" "}
      {pneuSelecionado && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4 z-40">
                   {" "}
          <div className="bg-white rounded-[40px] w-full max-w-5xl max-h-[95vh] overflow-y-auto p-8 md:p-12 shadow-2xl relative">
                       {" "}
            <button
              onClick={() => setPneuSelecionado(null)}
              className="absolute top-8 right-8 p-3 bg-slate-100 rounded-full hover:bg-red-100 transition-all text-slate-500"
            >
                            <X size={28} />           {" "}
            </button>
                       {" "}
            <header className="mb-10">
                           {" "}
              <span className="text-blue-600 font-black uppercase tracking-widest text-xs">
                                Auditoria de Pneu              {" "}
              </span>
                           {" "}
              <h2 className="text-4xl font-black uppercase text-slate-800 tracking-tighter mt-1">
                                {pneuSelecionado.numero_pneu}             {" "}
              </h2>
                         {" "}
            </header>
                       {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {" "}
              {["foto_cadastro", "foto_movimentacao"].map((campo, idx) => (
                <div key={campo} className="flex flex-col gap-3">
                                   {" "}
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
                                       {" "}
                    {idx === 0
                      ? "1. Print do Cadastro"
                      : "2. Histórico de Movimentos"}
                                     {" "}
                  </label>
                                   {" "}
                  <div
                    onPaste={(e) => handlePaste(e, campo)}
                    className="group border-4 border-dashed border-slate-100 rounded-[32px] p-2 flex flex-col items-center justify-center min-h-[300px] bg-slate-50 hover:bg-blue-50 hover:border-blue-200 transition-all relative overflow-hidden"
                  >
                                       {" "}
                    {pneuSelecionado[campo] ? (
                      <div className="relative w-full h-full">
                                               {" "}
                        <img
                          src={pneuSelecionado[campo]}
                          className="w-full h-full object-contain rounded-[24px]"
                          alt="Preview"
                        />
                                               {" "}
                        <button
                          onClick={() =>
                            setImagemExpandida(pneuSelecionado[campo])
                          }
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-black uppercase text-xs"
                        >
                                                    <Maximize2 size={24} />{" "}
                          Clique para Ampliar                        {" "}
                        </button>
                                             {" "}
                      </div>
                    ) : (
                      <div className="text-center">
                                               {" "}
                        <Clipboard
                          className="mx-auto text-slate-200 mb-3"
                          size={50}
                        />
                                               {" "}
                        <p className="text-xs font-black text-slate-400 uppercase leading-relaxed">
                                                    Clique e use                
                                   {" "}
                          <span className="text-blue-500">Ctrl+V</span>         
                                       {" "}
                        </p>
                                             {" "}
                      </div>
                    )}
                                     {" "}
                  </div>
                                 {" "}
                </div>
              ))}
                         {" "}
            </div>
                       {" "}
            <button
              onClick={handleSalvarAnalise}
              className="w-full mt-10 bg-slate-900 text-white py-6 rounded-[24px] font-black uppercase text-lg flex items-center justify-center gap-4 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200"
            >
                            <Save size={24} /> Confirmar Revisão          
               {" "}
            </button>
                     {" "}
          </div>
                 {" "}
        </div>
      )}
            {/* LIGHTBOX (IMAGEM EXPANDIDA) */}     {" "}
      {imagemExpandida && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setImagemExpandida(null)}
        >
                   {" "}
          <button className="absolute top-10 right-10 text-white/50 hover:text-white">
                        <X size={40} />         {" "}
          </button>
                   {" "}
          <img
            src={imagemExpandida}
            className="max-w-full max-h-full shadow-2xl rounded-lg"
            alt="Fullscreen"
          />
                 {" "}
        </div>
      )}
         {" "}
    </div>
  );
};

export default PneusARemover;
