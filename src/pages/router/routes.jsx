import { Routes, Route, Link } from "react-router-dom";

// Home
import TelaInicial from "../Home/Home";
// Cadastro
import CadastroCarros from "../Cadastro/CadastroCarros";
import CadastroPneus from "../Cadastro/CadastroPneus";
import Pesquisa from "../Cadastro/Pesquisa";
// Calibragem
import Calibragem from "../Calibragem/Calibragem";
import AtualizarCalibragem from "../Calibragem/Atualizar";
import GraficoCalibragem from "../Calibragem/Grafico";
import HistoricoCalibragem from "../Calibragem/Historico";
import ImprimirCalibragem from "../Calibragem/Imprimir";
// Carros
import CarrosInfo from "../Carros/CarrosInfo";
// Equipamentos
import Equipamentos from "../Equipamentos/Equipamentos";
// Movimentações
import Movimentacoes from "../Movimentacoes/Movimentacoes";
import AtualizarMovimentacoes from "../Movimentacoes/Atualizar";
import GraficoMovimentacoes from "../Movimentacoes/Grafico";
import HistoricoMovimentacoes from "../Movimentacoes/Historico";
// Número de Fogo
import NumeroFogo from "../NumeroFogo/NumeroFogo";
// Pneus
import PneusInfo from "../Pneus/PneusInfo";

// REFORMADORA - IMPORTANTE: O arquivo PneusEntregues.jsx PRECISA existir nesta pasta
import ReformadoraHome from "../Reformadora/ReformadoraHome";
import Coleta from "../Reformadora/Coleta";
import ColetasFeitas from "../Reformadora/ColetasFeitas";
import DadosImportantes from "../Reformadora/DadosImportantes";
import HistoricoPneusRef from "../Reformadora/HistoricoPneusRef";
import PneusNaReformadora from "../Reformadora/PneusNaReformadora";
import PneusEntregues from "../Reformadora/PneusEntregues";

// Components
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";

// Componente de erro para quando a página não existe
const Pagina404 = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8 text-center">
    <h1 className="text-4xl font-bold text-red-600 mb-4">404</h1>
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
      Página não encontrada
    </h2>
    <Link
      to="/"
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      ← Voltar para a página inicial
    </Link>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<TelaInicial />} />

      {/* Cadastro */}
      <Route path="/cadastro/carros" element={<CadastroCarros />} />
      <Route path="/cadastro/pneus" element={<CadastroPneus />} />
      <Route path="/cadastro/pesquisa" element={<Pesquisa />} />

      {/* Calibragem */}
      <Route path="/calibragem" element={<Calibragem />} />
      <Route path="/calibragem/atualizar" element={<AtualizarCalibragem />} />
      <Route path="/calibragem/grafico" element={<GraficoCalibragem />} />
      <Route path="/calibragem/historico" element={<HistoricoCalibragem />} />
      <Route path="/calibragem/imprimir" element={<ImprimirCalibragem />} />

      <Route path="/carros" element={<CarrosInfo />} />
      <Route path="/equipamentos" element={<Equipamentos />} />

      {/* Movimentações */}
      <Route path="/movimentacoes" element={<Movimentacoes />} />
      <Route
        path="/movimentacoes/atualizar"
        element={<AtualizarMovimentacoes />}
      />
      <Route path="/movimentacoes/grafico" element={<GraficoMovimentacoes />} />
      <Route
        path="/movimentacoes/historico"
        element={<HistoricoMovimentacoes />}
      />

      <Route path="/numero-fogo" element={<NumeroFogo />} />
      <Route path="/pneus" element={<PneusInfo />} />

      {/* REFORMADORA - Rotas aninhadas */}
      <Route path="/reformadora">
        <Route index element={<ReformadoraHome />} />
        <Route path="coleta" element={<Coleta />} />
        <Route path="coletas-feitas" element={<ColetasFeitas />} />
        <Route path="pneus-na-reformadora" element={<PneusNaReformadora />} />
        <Route path="pneus-entregues" element={<PneusEntregues />} />
        <Route path="dados-importantes" element={<DadosImportantes />} />
        <Route path="historico-pneus" element={<HistoricoPneusRef />} />
      </Route>

      <Route path="/header" element={<Header />} />
      <Route path="/sidebar" element={<Sidebar />} />

      {/* Fallback global */}
      <Route path="*" element={<Pagina404 />} />
    </Routes>
  );
}
