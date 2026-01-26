export default function LayoutBase() {
  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h1 className="text-xl font-bold mb-4">Menu Lateral</h1>
      <ul>
        <li className="p-2 hover:bg-gray-700">Dashboard</li>
        <li className="p-2 hover:bg-gray-700">Cadastros</li>
        <li className="p-2 hover:bg-gray-700">Relatórios</li>
      </ul>
    </div>
  );
}
