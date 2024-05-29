import { Utilisateur } from "@/types/entities-types";
import { FC } from "react";

interface UtilisateurTableProps {
  utilisateurs: Utilisateur[];
  onEdit: (utilisateur: Utilisateur) => void;
  onDelete: (utilisateur: Utilisateur) => void;
}

const UtilisateurTable: FC<UtilisateurTableProps> = ({
  utilisateurs,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-[#EDF2FF]">
            <th className="border px-4 py-2">Pseudo</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Sponsor</th>
            <th className="border px-4 py-2">Association</th>
            <th className="border px-4 py-2">Crée le</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((utilisateur) => (
            <tr key={utilisateur.id}>
              <td className="border px-4 py-2">{utilisateur.pseudo}</td>
              <td className="border px-4 py-2">{utilisateur.email}</td>
              <td className="border px-4 py-2">{utilisateur.role?.nom}</td>
              <td className="border px-4 py-2">
                {utilisateur.sponsor_id ? (
                  <span className="text-green-500">✔️</span>
                ) : (
                  <span className="text-red-500">❌</span>
                )}
              </td>
              <td className="border px-4 py-2">
                {utilisateur.association_id ? (
                  <span className="text-green-500">✔️</span>
                ) : (
                  <span className="text-red-500">❌</span>
                )}
              </td>
              <td className="border px-4 py-2">
                {new Date(utilisateur.cree_le).toLocaleString()}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-action p-2 rounded-md"
                  onClick={() => onEdit(utilisateur)}
                >
                  ✏️
                </button>
                <button
                  className="bg-red-400 p-2 rounded-md"
                  onClick={() => onDelete(utilisateur)}
                >
                  🗑️
                </button>
                {/* <button className="bg-green-400 p-2 rounded-md">👁️</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UtilisateurTable;
