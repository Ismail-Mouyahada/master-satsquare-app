import { FC, useState, useEffect, FormEvent } from "react";
import { Association } from "@prisma/client";

interface AssociationModalProps {
  association?: Association | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const AssociationModal: FC<AssociationModalProps> = ({
  association,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    valide: false,
    adresse_eclairage: "",
    est_confirme: false,
  });

  useEffect(() => {
    if (association) {
      setFormData({
        nom: association.nom,
        valide: association.valide === 1,
        adresse_eclairage: association.adresse_eclairage,
        est_confirme: association.est_confirme,
      });
    } else {
      setFormData({
        nom: "",
        valide: false,
        adresse_eclairage: "",
        est_confirme: false,
      });
    }
  }, [association]);

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
      valide: formData.valide ? 1 : 0,
    };
    const method = association ? "PUT" : "POST";
    const url = association
      ? `/api/associations/${association.id}`
      : "/api/associations";

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
          {association ? "Modifier Association" : "Ajouter Association"}
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
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Adresse
            </label>
            <input
              type="text"
              name="adresse_eclairage"
              value={formData.adresse_eclairage}
              onChange={handleChange}
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
              required
            />
          </div>
          <div className="flex mb-4">
            <div className="flex items-center justify-center space-x-2 w-1/2">
              <input
                type="checkbox"
                name="valide"
                id="valide"
                checked={formData.valide}
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="valide"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span
                  className={`w-8 h-8 rounded-full border-4 ${formData.valide ? "bg-black border-gray-300" : "bg-slate-50 border-gray-300"}`}
                ></span>
                <span className="text-sm font-medium text-gray-700">
                  Valide
                </span>
              </label>
            </div>
            <div className="flex items-center justify-center space-x-2 w-1/2">
              <input
                type="checkbox"
                name="est_confirme"
                id="est_confirme"
                checked={formData.est_confirme}
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="est_confirme"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span
                  className={`w-8 h-8 rounded-full border-4 ${formData.est_confirme ? "bg-black border-gray-300" : "bg-slate-50 border-gray-300"}`}
                ></span>
                <span className="text-sm font-medium text-gray-700">
                  Confirmé
                </span>
              </label>
            </div>
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
              {association ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssociationModal;
