import { FC, useState, useEffect, FormEvent } from 'react';
import { Sponsor } from '@prisma/client';

interface SponsorModalProps {
  sponsor?: Sponsor | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const SponsorModal: FC<SponsorModalProps> = ({ sponsor, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nom: '',
    valide: false,
    adresse_eclairage: '',
    est_confirme: false,
  });

  useEffect(() => {
    if (sponsor) {
      setFormData({
        nom: sponsor.nom,
        valide: sponsor.valide === 1,
        adresse_eclairage: sponsor.adresse_eclairage,
        est_confirme: sponsor.est_confirme,
      });
    } else {
      setFormData({
        nom: '',
        valide: false,
        adresse_eclairage: '',
        est_confirme: false,
      });
    }
  }, [sponsor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      valide: formData.valide ? 1 : 0,
    };
    const method = sponsor ? 'PUT' : 'POST';
    const url = sponsor ? `/api/sponsors/${sponsor.id}` : '/api/sponsors';

    await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl mb-4">{sponsor ? 'Modifier Sponsor' : 'Ajouter Sponsor'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <input
              type="text"
              name="adresse_eclairage"
              value={formData.adresse_eclairage}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Valide</label>
            <input
              type="checkbox"
              name="valide"
              checked={formData.valide}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirmé</label>
            <input
              type="checkbox"
              name="est_confirme"
              checked={formData.est_confirme}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">Annuler</button>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md">{sponsor ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SponsorModal;
