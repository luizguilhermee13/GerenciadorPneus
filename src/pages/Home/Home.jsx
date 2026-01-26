import { Link } from "react-router-dom"; // Importe o Link

function TelaInicial() {
  const topicos = [
    {
      img: "assets/calibragemPage.png",
      label: "Calibragem",
      path: "/calibragem",
    },
    { img: "assets/carrosPage.png", label: "Carros", path: "/carros" },
    {
      img: "assets/movimentacoesPage.png",
      label: "Movimentacoes",
      path: "/movimentacoes",
    },
    {
      img: "assets/nmrFogoPage.png",
      label: "NumerosFogo",
      path: "/numero-fogo",
    },
    { img: "assets/pneusPage.png", label: "Pneus", path: "/pneus" },
    { img: "assets/cadastroPage.png", label: "Cadastro", path: "/cadastro" },
    {
      img: "assets/equipamentosPage.png",
      label: "Equipamentos",
      path: "/equipamentos",
    },
    {
      img: "assets/reformaddoraPage.png",
      label: "Reformadora",
      path: "/reformadora",
    },
    // Para os que ainda não tem página, você pode deixar sem link ou usar "#"
    { img: "assets/fechadoPage.png", label: "Fechado", path: "#" },
    { img: "assets/fechadoPage.png", label: "Fechado", path: "#" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4 place-content-center place-items-center w-full min-h-screen">
      {topicos.map((topico, index) => {
        // Se o link for "#" ou se não quiser link, renderiza apenas o div
        if (topico.path === "#") {
          return (
            <div
              key={index}
              className="bg-blue-100 rounded-xl flex flex-col items-center justify-center p-2 cursor-not-allowed opacity-70"
            >
              <img
                src={topico.img}
                alt={topico.label}
                className="sm:w-60 sm:h-60 lg:w-80 lg:h-80"
              />
              <p className="mt-2 text-lg font-semibold">{topico.label}</p>
            </div>
          );
        }

        // Para os que tem link válido
        return (
          <Link
            key={index}
            to={topico.path}
            className="block hover:scale-105 transition-transform duration-200"
          >
            <div className="bg-blue-100 rounded-xl flex flex-col items-center justify-center p-2 hover:bg-blue-200 transition-colors">
              <img
                src={topico.img}
                alt={topico.label}
                className="sm:w-60 sm:h-60 lg:w-80 lg:h-80"
              />
              <p className="mt-2 text-lg font-semibold">{topico.label}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default TelaInicial;
