"use client";
import { FC, useEffect, useState } from "react";
import { Evenement } from "@prisma/client";
import QuizTable from "@/components/Quiz/QuizTable";
import QuizSearchBar from "@/components/Quiz/QuizSearchBar";
import QuizModal from "@/components/Quiz/QuizModal";
import QuizHeader from "@/components/Quiz/QuizHeader";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaCalculator } from "react-icons/fa";

const Quizzes: FC = () => {
  const [Quizs, setQuizs] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Evenement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [QuizToDelete, setQuizToDelete] = useState<Evenement | null>(null);

  useEffect(() => {
    fetchQuizs();
  }, []);

  const fetchQuizs = async (name: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quizzes?name=${name}`);
      if (!response.ok) {
        throw new Error("Failed to fetch Quizs");
      }
      const data: Evenement[] = await response.json();
      setQuizs(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetchQuizs();
  };

  const openModal = (Quiz: Evenement | null = null) => {
    setSelectedQuiz(Quiz);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedQuiz(null);
  };

  const openDeleteModal = (Quiz: Evenement) => {
    setQuizToDelete(Quiz);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setQuizToDelete(null);
  };

  const handleDelete = async () => {
    if (QuizToDelete) {
      await fetch(`/api/Quizs/${QuizToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      handleSave();
      closeDeleteModal();
    }
  };

  const handleSearch = (name: string) => {
    fetchQuizs(name);
  };

  if (loading) return <Loader/>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <QuizHeader title="Evenements"  icon={<FaCalculator className="scale-[1.5]" color="#6D6B81" />}/>
          <QuizSearchBar onAdd={() => openModal()} onSearch={handleSearch} />
          <QuizTable
            Quizs={Quizs}
            onEdit={openModal}
            onDelete={openDeleteModal}
          />
        </div>
        <QuizModal
          Quiz={selectedQuiz}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h2 className="mb-4 text-2xl">Confirmer la suppression</h2>
              <p>
                Êtes-vous sûr de vouloir supprimer l'événement "
                {QuizToDelete?.nom}" ?
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
  );
};

export default Quizzes;
