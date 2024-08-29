import { FC } from "react";
import { FaCheck, FaExclamationTriangle } from "react-icons/fa";
import ActionButtons from "../ActionButtons/page";
import { Association } from "@/types/main-types/main";

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
  function handleView(association: any): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg overflow-x-auto text-slate-600">
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <table className="min-w-full bg-slate-50 border">
          <thead>
            <tr className="bg-[#EDF2FF]">
              <th className="p-8 text-center rounded-md">Nom</th>
              <th className="p-8 font-semibold rounded-md">Adresse</th>
              <th className="p-8 font-semibold rounded-md ">Valide</th>
              <th className="p-8 font-semibold rounded-md">Confirmé</th>
              <th className="p-8 font-semibold rounded-md">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-slate-50">
            {associations.map((association) => (
              <tr key={association.id}>
                <td className="border px-4 py-2  ">{association.nom}</td>
                <td className="border px-4 py-2  ">
                  {association.adresseEclairage}
                </td>
                <td className="border px-4 py-2  justify-center ">
                  {association.valide ? (
                    <span className="text-green-400  ">
                      <FaCheck className="scale-[1.5]" />
                    </span>
                  ) : (
                    <span className="text-red-400">
                      <FaExclamationTriangle className="scale-[1.5]" />
                    </span>
                  )}
                </td>
                <td className="border px-4 py-2  ">
                  {association.estConfirme ? (
                    <span className="text-green-400  ">
                      <FaCheck className="scale-[1.5]" />
                    </span>
                  ) : (
                    <span className="text-red-400">
                      <FaExclamationTriangle className="scale-[1.5]" />
                    </span>
                  )}
                </td>
                <ActionButtons
                  onEdit={onEdit}
                  onDelete={onDelete}
                  association={association}
                />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssociationTable;
