import { FC, useState, useEffect, FormEvent } from "react";
import { Role } from "@prisma/client";
import { Utilisateur } from "@/types/entities-types";

interface UtilisateurModalProps {
  utilisateur?: Utilisateur | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const UtilisateurModal: FC<UtilisateurModalProps> = ({
  utilisateur,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    pseudo: "",
    email: "",
    mot_de_passe: "",
    role_id: null as number | undefined | null,
  });
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (utilisateur) {
      setFormData({
        pseudo: utilisateur.pseudo,
        email: utilisateur.email,
        mot_de_passe: utilisateur.mot_de_passe,
        role_id: utilisateur.role_id,
      });
    } else {
      setFormData({
        pseudo: "",
        email: "",
        mot_de_passe: "",
        role_id: null,
      });
    }
  }, [utilisateur]);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const response = await fetch(`/api/roles`);
    if (!response.ok) {
      throw new Error("Failed to fetch Roles");
    }
    const data: Role[] = await response.json();
    setRoles(data);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      role_id: formData.role_id ? Number(formData.role_id) : null, // Convert role_id to number
      statut_compte: true,
    };
    const method = utilisateur ? "PUT" : "POST";
    const url = utilisateur
      ? `/api/utilisateurs/${utilisateur.id}`
      : "/api/utilisateurs";

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
      <div className="bg-slate-50 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl mb-4 text-[#8495B0]">
          {utilisateur ? "Modifier Utilisateur" : "Ajouter Utilisateur"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Pseudo
            </label>
            <input
              type="text"
              name="pseudo"
              value={formData.pseudo}
              onChange={handleChange}
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              type="password"
              name="mot_de_passe"
              value={formData.mot_de_passe}
              onChange={handleChange}
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Rôle
            </label>
            <select
              name="role_id"
              value={formData.role_id ?? ""}
              onChange={handleChange}
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
              required
            >
              <option value="">Sélectionner un rôle</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id.toString()}>
                  {role.nom}
                </option>
              ))}
            </select>
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
              {utilisateur ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UtilisateurModal;
