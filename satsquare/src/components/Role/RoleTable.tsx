import { FC } from "react";
import { Role } from "@prisma/client";

interface RoleTableProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

const RoleTable: FC<RoleTableProps> = ({ roles, onEdit, onDelete }) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-[#EDF2FF]">
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td className="border px-4 py-2">{role.nom}</td>

              <td className="border px-4 py-2 space-x-2">
                <button
                  className="bg-action p-2 rounded-md"
                  onClick={() => onEdit(role)}
                >
                  ✏️
                </button>
                <button
                  className="bg-red-400 p-2 rounded-md"
                  onClick={() => onDelete(role)}
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

export default RoleTable;
