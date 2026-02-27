import { Routes, Route, Link, Navigate } from "react-router-dom";

// LOGIN (Corrigido o caminho conforme sua estrutura)
import Login from "../components/Login";

// Home
import TelaInicial from "../Home/Home";

// Pneus
import PneusHome from "../Pneus/PneusHome";
import PesquisaPneus from "../Pneus/PesquisaPneus";
import AtualizarCadastro from "../Pneus/AtualizarCadastro";
import PneusARemover from "../Pneus/PneusARemover";

// Carros
import CarrosInfo from "../Carros/CarrosInfo";

// Calibragem, Equipamentos, Movimentações, Controle KM
import Calibragem from "../Calibragem/Calibragem";
import AtualizarCalibragem from "../Calibragem/Atualizar";
import GraficoCalibragem from "../Calibragem/Grafico";
import HistoricoCalibragem from "../Calibragem/Historico";
import ImprimirCalibragem from "../Calibragem/Imprimir";
import Equipamentos from "../Equipamentos/Equipamentos";
import Movimentacoes from "../Movimentacoes/Movimentacoes";
import AtualizarMovimentacoes from "../Movimentacoes/Atualizar";
import GraficoMovimentacoes from "../Movimentacoes/Grafico";
import HistoricoMovimentacoes from "../Movimentacoes/Historico";
import ControleKM from "../ControleDeKM/ControleKM";

// REFORMADORA
import ReformadoraHome from "../Reformadora/ReformadoraHome";
import EnviarColeta from "../Reformadora/EnviarColeta";
import AtualizarColeta from "../Reformadora/AtualizarColeta";
import ColetasFeitas from "../Reformadora/ColetasFeitas";
import DadosImportantes from "../Reformadora/DadosImportantes";
import HistoricoPneusRef from "../Reformadora/HistoricoPneusRef";
import IndicadoresRecapagem from "../Reformadora/IndicadoresRecapagem";

// --- COMPONENTE DE PROTEÇÃO ---
const RotaProtegida = ({ children }) => {
  const estaAutenticado = localStorage.getItem("autenticado") === "true";
  if (!estaAutenticado) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

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
      {/* ROTA DE LOGIN (Livre para acesso) */}
      <Route path="/login" element={<Login />} />

      {/* TODAS AS ROTAS ABAIXO EXIGEM LOGIN */}
      <Route
        path="/"
        element={
          <RotaProtegida>
            <TelaInicial />
          </RotaProtegida>
        }
      />

      {/* MÓDULO PNEUS */}
      <Route path="/pneus">
        <Route
          index
          element={
            <RotaProtegida>
              <PneusHome />
            </RotaProtegida>
          }
        />
        <Route
          path="busca"
          element={
            <RotaProtegida>
              <PesquisaPneus />
            </RotaProtegida>
          }
        />
        <Route
          path="remover"
          element={
            <RotaProtegida>
              <PneusARemover />
            </RotaProtegida>
          }
        />
        <Route
          path="editar/:empresa/:fogo"
          element={
            <RotaProtegida>
              <AtualizarCadastro />
            </RotaProtegida>
          }
        />
      </Route>

      {/* MÓDULO REFORMADORA */}
      <Route path="/reformadora">
        <Route
          index
          element={
            <RotaProtegida>
              <ReformadoraHome />
            </RotaProtegida>
          }
        />
        <Route
          path="enviar"
          element={
            <RotaProtegida>
              <EnviarColeta />
            </RotaProtegida>
          }
        />
        <Route
          path="atualizar"
          element={
            <RotaProtegida>
              <AtualizarColeta />
            </RotaProtegida>
          }
        />
        <Route
          path="consultar"
          element={
            <RotaProtegida>
              <ColetasFeitas />
            </RotaProtegida>
          }
        />
        <Route
          path="dados-importantes"
          element={
            <RotaProtegida>
              <DadosImportantes />
            </RotaProtegida>
          }
        />
        <Route
          path="historico"
          element={
            <RotaProtegida>
              <HistoricoPneusRef />
            </RotaProtegida>
          }
        />
        <Route
          path="indicadores"
          element={
            <RotaProtegida>
              <IndicadoresRecapagem />
            </RotaProtegida>
          }
        />
      </Route>

      <Route
        path="/carros"
        element={
          <RotaProtegida>
            <CarrosInfo />
          </RotaProtegida>
        }
      />
      <Route
        path="/controle-km"
        element={
          <RotaProtegida>
            <ControleKM />
          </RotaProtegida>
        }
      />

      <Route path="/calibragem">
        <Route
          index
          element={
            <RotaProtegida>
              <Calibragem />
            </RotaProtegida>
          }
        />
        <Route
          path="atualizar"
          element={
            <RotaProtegida>
              <AtualizarCalibragem />
            </RotaProtegida>
          }
        />
        <Route
          path="grafico"
          element={
            <RotaProtegida>
              <GraficoCalibragem />
            </RotaProtegida>
          }
        />
        <Route
          path="historico"
          element={
            <RotaProtegida>
              <HistoricoCalibragem />
            </RotaProtegida>
          }
        />
        <Route
          path="imprimir"
          element={
            <RotaProtegida>
              <ImprimirCalibragem />
            </RotaProtegida>
          }
        />
      </Route>

      <Route path="/movimentacoes">
        <Route
          index
          element={
            <RotaProtegida>
              <Movimentacoes />
            </RotaProtegida>
          }
        />
        <Route
          path="atualizar"
          element={
            <RotaProtegida>
              <AtualizarMovimentacoes />
            </RotaProtegida>
          }
        />
        <Route
          path="grafico"
          element={
            <RotaProtegida>
              <GraficoMovimentacoes />
            </RotaProtegida>
          }
        />
        <Route
          path="historico"
          element={
            <RotaProtegida>
              <HistoricoMovimentacoes />
            </RotaProtegida>
          }
        />
      </Route>

      <Route
        path="/equipamentos"
        element={
          <RotaProtegida>
            <Equipamentos />
          </RotaProtegida>
        }
      />

      {/* Se der erro 404, volta para o início (que vai pedir login se necessário) */}
      <Route path="*" element={<Pagina404 />} />
    </Routes>
  );
}
