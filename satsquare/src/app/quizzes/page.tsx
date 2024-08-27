"use client";
import { FC, useEffect, useState } from "react";
import QuizTable from "@/components/Quiz/QuizTable";
import QuizSearchBar from "@/components/Quiz/QuizSearchBar";
import Loader from "@/components/Loader";
import PageHeader from "@/components/PageHeader/PageHeader";
import Sidebar from "@/components/Sidebar/page";
import { FaGamepad } from "react-icons/fa";
import { Quiz } from "@/types/main-types/main";

const QuizPage: FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quizform`);
      if (!response.ok) {
        throw new Error("Failed to fetch quizzes");
      }
      const data: Quiz[] = await response.json();
      setQuizzes(data);
      setFilteredQuizzes(data); // Initially, all quizzes are displayed
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm) {
      const filtered = quizzes.filter((quiz) =>
        quiz.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredQuizzes(filtered);
    } else {
      setFilteredQuizzes(quizzes); // Reset to all quizzes if search is cleared
    }
  };

  const openDeleteModal = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setQuizToDelete(null);
  };

  const handleDelete = async () => {
    if (quizToDelete) {
      await fetch(`/api/quizzes/${quizToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchQuizzes(); // Refetch quizzes after deletion
      closeDeleteModal();
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 ml-[4em] bg-slate-50 rounded-lg shadow-md">
          <PageHeader
            title="Quiz"
            icon={<FaGamepad className="scale-[1.5]" color="#6D6B81" />}
          />
          <QuizSearchBar onSearch={handleSearch} />
          <QuizTable quizzes={filteredQuizzes} onDelete={openDeleteModal} />
          {isDeleteModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="p-6 bg-slate-50 rounded-lg shadow-lg text-slate-500">
                <h2 className="mb-4 text-2xl">Confirmer la suppression</h2>
                <p>
                  Êtes-vous sûr de vouloir supprimer le quiz "
                  {quizToDelete?.subject}" ?
                </p>
                <div className="flex justify-end mt-4 space-x-4">
                  <button
                    onClick={closeDeleteModal}
                    className="px-4 py-2 text-gray-700 bg-gray-300 rounded-md"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 text-white bg-red-500 rounded-md"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
