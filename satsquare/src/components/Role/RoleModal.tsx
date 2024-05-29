import { FC, useState, useEffect, FormEvent } from "react";
import { Sponsor } from "@prisma/client";
import { Role } from "@prisma/client";

interface RoleModalProps {
  role?: Role | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const RoleModal: FC<RoleModalProps> = ({ role, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nom: "",
  });

  useEffect(() => {
    if (role) {
      setFormData({
        nom: role.nom,
      });
    } else {
      setFormData({
        nom: "",
      });
    }
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
    };
    const method = role ? "PUT" : "POST";
    const url = role ? `/api/roles/${role.id}` : "/api/roles";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl mb-4 text-[#8495B0]">
          {role ? "Modifier Role" : "Ajouter Role"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded-md"
            >
              {role ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;
