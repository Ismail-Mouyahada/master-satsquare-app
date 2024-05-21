import { FC } from "react";
import { Association } from "@prisma/client";

interface AssociationTableProps {
  associations: Association[];
  onEdit: (association: Association) => void;
  onDelete: (association: Association) => void;
}

const AssociationTable: FC<AssociationTableProps> = ({
  associations,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-[#EDF2FF]">
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Adresse</th>
            <th className="border px-4 py-2">Valide</th>
            <th className="border px-4 py-2">Confirmé</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {associations.map((association) => (
            <tr key={association.id}>
              <td className="border px-4 py-2">{association.nom}</td>
              <td className="border px-4 py-2">
                {association.adresse_eclairage}
              </td>
              <td className="border px-4 py-2">
                {association.valide ? (
                  <span className="text-green-500">✔️</span>
                ) : (
                  <span className="text-red-500">❌</span>
                )}
              </td>
              <td className="border px-4 py-2">
                {association.est_confirme ? (
                  <span className="text-green-500">✔️</span>
                ) : (
                  <span className="text-red-500">❌</span>
                )}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-[#F8D99B] p-2 rounded-md"
                  onClick={() => onEdit(association)}
                >
                  ✏️
                </button>
                <button
                  className="bg-red-400 p-2 rounded-md"
                  onClick={() => onDelete(association)}
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

export default AssociationTable;
