import React from 'react';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface ActionButtonsProps {
  onEdit: (association: any) => void;
  onDelete: (association: any) => void;
  onView: (association: any) => void;
  association: any;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onEdit, onDelete, onView, association }) => {
  return (
    <td className="p-4 px-4 py-2 space-x-2 rounded-md">
      <button
        className="bg-[#f1eada] p-3 rounded-full"
        onClick={() => onEdit(association)}
      >
        <FaEdit className="text-[#f7bb44]" />
      </button>
      <button
        className="p-3 bg-red-100 rounded-full"
        onClick={() => onDelete(association)}
      >
        <FaTrash className="text-red-400" />
      </button>
      <button
        className="p-3 bg-green-100 rounded-full"
        onClick={() => onView(association)}
      >
        <FaEye className="text-emerald-400" />
      </button>
    </td>
  );
};

export default ActionButtons;