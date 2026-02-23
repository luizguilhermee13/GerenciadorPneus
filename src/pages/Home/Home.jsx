import { Link } from "react-router-dom";

function TelaInicial() {
  const topicos = [
    {
      img: "assets/pneusPage.png",
      label: "Pneus",
      path: "/pneus",
      color: "bg-blue-50",
    },
    {
      img: "assets/reformaddoraPage.png",
      label: "Recapagem",
      path: "/reformadora",
      color: "bg-orange-50",
    },
    {
      img: "assets/movimentacoesPage.png",
      label: "Movimentações",
      path: "/movimentacoes",
      color: "bg-orange-50",
    },
    {
      img: "assets/calibragemPage.png",
      label: "Calibragem",
      path: "/calibragem",
      color: "bg-blue-50",
    },
    {
      img: "assets/carrosPage.png",
      label: "Carros",
      path: "/carros",
      color: "bg-green-50",
    },
    {
      img: "assets/fechadoPage.png",
      label: "Controle KM",
      path: "/controle-km",
      color: "bg-blue-50",
    },
    {
      img: "assets/equipamentosPage.png",
      label: "Equipamentos",
      path: "/equipamentos",
      color: "bg-blue-50",
    },
    {
      img: "assets/fechadoPage.png",
      label: "Em breve",
      path: "#",
      color: "bg-gray-100",
    },
    {
      img: "assets/fechadoPage.png",
      label: "Em breve",
      path: "#",
      color: "bg-gray-100",
    },
    {
      img: "assets/fechadoPage.png",
      label: "Em breve",
      path: "#",
      color: "bg-gray-100",
    },
  ];

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* max-w-full e gap maior para dar imponência aos cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full ">
        {topicos.map((topico, index) => {
          const isLocked = topico.path === "#";

          const cardBaseStyle = `
            ${topico.color} 
            aspect-square 
            rounded-[2rem] 
            flex flex-col items-center justify-center 
            overflow-hidden
            transition-all duration-300 
            border border-gray-100
          `;

          const content = (
            <div
              className={`${cardBaseStyle} ${
                !isLocked
                  ? "hover:shadow-2xl hover:-translate-y-3 cursor-pointer shadow-md"
                  : "opacity-40 cursor-not-allowed"
              }`}
            >
              {/* Container da Imagem ocupando quase tudo */}
              <div className="relative w-full h-full flex items-center justify-center p-2">
                <img
                  src={topico.img}
                  alt={topico.label}
                  className="w-full h-full object-contain"
                />

                {/* Texto sobreposto ou na base com fundo semitransparente se preferir preenchimento total */}
                <div className="absolute bottom-3 w-full px-2">
                  <p className="text-center font-black text-gray-800 text-base md:text-xl uppercase tracking-tighter">
                    {topico.label}
                  </p>
                </div>
              </div>
            </div>
          );

          if (isLocked) {
            return <div key={index}>{content}</div>;
          }

          return (
            <Link key={index} to={topico.path} className="no-underline">
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default TelaInicial;
