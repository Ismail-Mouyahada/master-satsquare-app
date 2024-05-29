import { FC } from "react";
import { Association } from "@prisma/client";
import { FaCertificate, FaCloudversify, FaCross, FaEdit, FaEye, FaObjectGroup, FaObjectUngroup, FaRemoveFormat, FaTrash } from "react-icons/fa";
import ActionButtons from "../ActionButtons/page";

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
    <div className="  bg-[#F3F3FF] rounded-lg p-8">
      <table className="min-w-full p-4 rounded-md -none">
        <thead>
          <tr className="text-center text-gray-400 rounded-md ">
            <th className="p-8 text-center rounded-md">Nom</th>
            <th className="p-8 font-semibold rounded-md">Adresse</th>
            <th className="p-8 font-semibold rounded-md ">Valide</th>
            <th className="p-8 font-semibold rounded-md">Confirmé</th>
            <th className="p-8 font-semibold rounded-md">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {associations.map((association) => (
            <tr key={association.id}>
              <td className="p-4 px-4 py-2 rounded-md ">{association.nom}</td>
              <td className="p-4 px-4 py-2 rounded-md ">
                {association.adresse_eclairage}
              </td>
              <td className="p-4 px-4 py-2 rounded-md ">
                {association.valide ? (
                  <span className="text-green-500"><FaCertificate/></span>
                ) : (
                  <span className="text-red-500"><FaCross/></span>
                )}
              </td>
              <td className="p-4 px-4 py-2 rounded-md ">
                {association.est_confirme ? (
                  <span className="text-green-500">✔️</span>
                ) : (
                  <span className="text-red-500">❌</span>
                )}
              </td>
              <ActionButtons
              onEdit={onEdit}
              onDelete={onDelete}
              onView={handleView}
              association={association}
            />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssociationTable;
