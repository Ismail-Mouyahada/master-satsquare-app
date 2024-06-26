import { FC } from 'react';
import { Quiz } from '@prisma/client';
import ActionButtons from '../ActionButtons/page';

interface QuizTableProps {
  quizzes: Quiz[];
  onDelete: (quiz: Quiz) => void;
}

const QuizTable: FC<QuizTableProps> = ({ quizzes, onDelete }) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg overflow-x-auto text-slate-600">
      <table className="min-w-full bg-slate-50 border">
        <thead>
          <tr className="bg-[#EDF2FF]">
            <th className="border px-4 py-2">Titre</th>
            <th className="border px-4 py-2">Catégorie</th>
            <th className="border px-4 py-2">Créé le</th>
            <th className="border px-4 py-2">Mis à jour le</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td className="border px-4 py-2">{quiz.titre}</td>
              <td className="border px-4 py-2">{quiz.categorie}</td>
              <td className="border px-4 py-2">
                {new Date(quiz.cree_le).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                {new Date(quiz.mis_a_jour_le).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2 space-x-2">
                <a href={`/quizzes/${quiz.id}`} className="bg-action p-2 rounded-md">
                 ✏️
                </a>
                <button
                  className="bg-red-400 p-2 rounded-md"
                  onClick={() => onDelete(quiz)}
                >
                  🗑️
                </button>
              </td>
           
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizTable;
