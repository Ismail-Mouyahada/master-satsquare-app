import { Sponsor } from '@/types/main-types/main';
import { FC } from 'react';

interface SponsorTableProps {
  sponsors: Sponsor[];
  onEdit: (sponsor: Sponsor) => void;
  onDelete: (sponsor: Sponsor) => void;
}

const SponsorTable: FC<SponsorTableProps> = ({ sponsors, onEdit, onDelete }) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg overflow-x-auto text-slate-600">
      <table className="min-w-full bg-slate-50 border">
        <thead>
          <tr className="bg-[#EDF2FF]">
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Adresse</th>
            <th className="border px-4 py-2">Valide</th>
            <th className="border px-4 py-2">Confirmé</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor) => (
            <tr key={sponsor.id}>
              <td className="border px-4 py-2">{sponsor.nom}</td>
              <td className="border px-4 py-2">{sponsor.adresseEclairage}</td>
              <td className="border px-4 py-2">
                {sponsor.valide ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
              </td>
              <td className="border px-4 py-2">
                {sponsor.estConfirme ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button className="bg-action p-2 rounded-md" onClick={() => onEdit(sponsor)}>✏️</button>
                <button className="bg-red-400 p-2 rounded-md" onClick={() => onDelete(sponsor)}>🗑️</button>
                {/* <button className="bg-green-400 p-2 rounded-md">👁️</button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SponsorTable;
