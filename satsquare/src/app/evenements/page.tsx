import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

export default function Evenements() {

  const evenements = [
    {
      id: 1,
      nom: "Événement 1",
      description: "Description de l'événement 1",
      utilisateur: { nom: "Utilisateur 1" },
      commence_a: new Date("2024-06-01T10:00:00Z"),
      termine_a: new Date("2024-06-01T12:00:00Z"),
      est_public: true,
      cree_le: new Date("2024-05-01T10:00:00Z"),
      mis_a_jour_le: new Date("2024-05-15T10:00:00Z"),
      Dons: [],
      EvenementsQuiz: []
    },
    {
      id: 2,
      nom: "Événement 2",
      description: "Description de l'événement 2",
      utilisateur: { nom: "Utilisateur 2" },
      commence_a: new Date("2024-06-02T14:00:00Z"),
      termine_a: new Date("2024-06-02T16:00:00Z"),
      est_public: false,
      cree_le: new Date("2024-05-02T11:00:00Z"),
      mis_a_jour_le: new Date("2024-05-16T11:00:00Z"),
      Dons: [],
      EvenementsQuiz: []
    }
  ];

  return (
    <div className="h-screen bg-[#F3F3FF]  w-full">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-[#F8D99B] p-2 rounded-md flex items-center">
              <span role="img" aria-label="icon">📅</span>
              <span className="px-4 ml-2 font-bold text-amber-800">Événements</span>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-primary">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-[#EDF2FF] text-gray-600">
                <th className="px-4 py-2 border">Nom</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Utilisateur</th>
                <th className="px-4 py-2 border">Commence</th>
                <th className="px-4 py-2 border">Termine</th>
                <th className="px-4 py-2 border">Public</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              {evenements.map((evenement) => (
                <tr key={evenement.id}>
                  <td className="px-4 py-2 border text-inherit"># {evenement.nom}</td>
                  <td className="px-4 py-2 border">{evenement.description}</td>
                  <td className="px-4 py-2 border">{evenement.utilisateur.nom}</td>
                  <td className="px-4 py-2 border">{new Date(evenement.commence_a).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{new Date(evenement.termine_a).toLocaleString()}</td>
                  <td className="px-4 py-2 border">
                    {evenement.est_public ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
                  </td>
                  <td className="px-4 py-2 space-x-2 border">
                    <button className="p-2 bg-green-400 rounded-md"><FaEdit className="text-white"/></button>
                    <button className="bg-[#F8D99B] p-2 rounded-md"><FaEye className="text-white"/></button>
                    <button className="p-2 bg-red-400 rounded-md"><FaTrash className="text-white"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};