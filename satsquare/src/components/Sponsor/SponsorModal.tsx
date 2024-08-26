import { Sponsor } from "@/types/main-types/main";
import { FC, useState, useEffect, FormEvent } from "react";

interface SponsorModalProps {
  sponsor?: Sponsor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const SponsorModal: FC<SponsorModalProps> = ({
  sponsor,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    valide: false,
    adresseEclairage: "",
    estConfirme: false,
  });

  useEffect(() => {
    if (sponsor) {
      setFormData({
        nom: sponsor.nom,
        valide: sponsor.valide === 1,
        adresseEclairage: sponsor.adresseEclairage,
        estConfirme: sponsor.estConfirme,
      });
    } else {
      setFormData({
        nom: "",
        valide: false,
        adresseEclairage: "",
        estConfirme: false,
      });
    }
  }, [sponsor]);

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
    const method = sponsor ? "PUT" : "POST";
    const url = sponsor ? `/api/sponsors/${sponsor.id}` : "/api/sponsors";

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
          {sponsor ? "Modifier Sponsor" : "Ajouter Sponsor"}
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
                  className={`w-8 h-8 rounded-full border-4 ${formData.estConfirme ? "bg-black border-gray-300" : "bg-slate-50 border-gray-300"}`}
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
              {sponsor ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SponsorModal;
