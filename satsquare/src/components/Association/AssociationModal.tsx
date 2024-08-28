import { Association } from "@/types/main-types/main";
import Image from "next/image";
import { FC, useState, useEffect, FormEvent } from "react";

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
    adresseEclairage: "",
    estConfirme: false,
    logoUrl: "", // Updated state to use logoUrl
  });

  useEffect(() => {
    if (association) {
      setFormData({
        nom: association.nom,
        valide: association.valide === 1,
        adresseEclairage: association.adresseEclairage,
        estConfirme: association.estConfirme,
        logoUrl: association.logoUrl || "", // Ensure it maps to the correct field
      });
    } else {
      setFormData({
        nom: "",
        valide: false,
        adresseEclairage: "",
        estConfirme: false,
        logoUrl: "",
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          logoUrl: reader.result as string, // Convert the image to a base64 string
        }));
      };
      reader.readAsDataURL(file);
    }
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
      <div className="bg-slate-50 p-6 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
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
              name="adresseEclairage"
              value={formData.adresseEclairage}
              onChange={handleChange}
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Image URL ou Télécharger une Image
            </label>
            <input
              type="text"
              name="logoUrl"
              value={formData.logoUrl}
              onChange={handleChange}
              placeholder="URL de l'image"
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74] mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full px-8 py-3 border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]"
            />
          </div>
          {formData.logoUrl && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Aperçu de l'image
              </label>
              <Image
                src={formData.logoUrl}
                alt="Aperçu de l'image"
                className="w-full h-auto rounded-md"
              />
            </div>
          )}
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
                  className={`w-8 h-8 rounded-full border-4 ${
                    formData.valide
                      ? "bg-black border-gray-300"
                      : "bg-slate-50 border-gray-300"
                  }`}
                ></span>
                <span className="text-sm font-medium text-gray-700">
                  Valide
                </span>
              </label>
            </div>
            <div className="flex items-center justify-center space-x-2 w-1/2">
              <input
                type="checkbox"
                name="estConfirme"
                id="estConfirme"
                checked={formData.estConfirme}
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="estConfirme"
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span
                  className={`w-8 h-8 rounded-full border-4 ${
                    formData.estConfirme
                      ? "bg-black border-gray-300"
                      : "bg-slate-50 border-gray-300"
                  }`}
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
