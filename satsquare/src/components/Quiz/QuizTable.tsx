import { FC } from 'react';
import { Evenement } from '@prisma/client';

interface QuizTableProps {
  Quizs: Evenement[];
  onEdit: (Quiz: Evenement) => void;
  onDelete: (Quiz: Evenement) => void;
}

const QuizTable: FC<QuizTableProps> = ({ Quizs, onEdit, onDelete }) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-[#EDF2FF]">
            <th scope="col" className="border px-4 py-2">Nom</th>
            <th scope="col" className="border px-4 py-2">Description</th>
            <th scope="col" className="border px-4 py-2">Commence à</th>
            <th scope="col" className="border px-4 py-2">Termine à</th>
            <th className="border px-4 py-2">Statut</th>
            <th scope="col" className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Quizs.map((Quiz) => (
            <tr key={Quiz.id}>
              <td className="border px-4 py-2">{Quiz.nom}</td>
              <td className="border px-4 py-2">{Quiz.description}</td>
              <td className="border px-4 py-2">{new Date(Quiz.commence_a).toLocaleString()}</td>
              <td className="border px-4 py-2">{new Date(Quiz.termine_a).toLocaleString()}</td>
              <td className="border px-4 py-2">
                {Quiz.est_public ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <button className="bg-[#F8D99B] p-2 rounded-md" onClick={() => onEdit(Quiz)}>✏️</button>
                <button className="bg-red-400 p-2 rounded-md" onClick={() => onDelete(Quiz)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;
