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
    <div className="h-screen bg-[#F3F3FF] p-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-[#F8D99B] p-2 rounded-md flex items-center">
              <span role="img" aria-label="icon">📅</span>
              <span className="ml-2">Événements</span>
            </div>
          </div>
        </div>
        <div className="bg-[#F3F3FF] p-4 rounded-lg">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-[#EDF2FF]">
                <th className="border px-4 py-2">Nom</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Utilisateur</th>
                <th className="border px-4 py-2">Commence</th>
                <th className="border px-4 py-2">Termine</th>
                <th className="border px-4 py-2">Public</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {evenements.map((evenement) => (
                <tr key={evenement.id}>
                  <td className="border px-4 py-2">{evenement.nom}</td>
                  <td className="border px-4 py-2">{evenement.description}</td>
                  <td className="border px-4 py-2">{evenement.utilisateur.nom}</td>
                  <td className="border px-4 py-2">{new Date(evenement.commence_a).toLocaleString()}</td>
                  <td className="border px-4 py-2">{new Date(evenement.termine_a).toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    {evenement.est_public ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button className="bg-[#F8D99B] p-2 rounded-md">✏️</button>
                    <button className="bg-red-400 p-2 rounded-md">🗑️</button>
                    <button className="bg-green-400 p-2 rounded-md">👁️</button>
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