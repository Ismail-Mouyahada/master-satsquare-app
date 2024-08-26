"use client";
import { FC, useEffect, useState } from "react";
import UtilisateurTable from "@/components/Utilisateur/UtilisateurTable";
import UtilisateurModal from "@/components/Utilisateur/UtilisateurModal";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaUsers } from "react-icons/fa";
import UtilisateursearchBar from "@/components/Utilisateur/UtilisateurSearchBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Utilisateur } from "@/types/entities-types";

const UtilisateursPage: FC = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUtilisateur, setSelectedUtilisateur] =
    useState<Utilisateur | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [UtilisateurToDelete, setUtilisateurToDelete] =
    useState<Utilisateur | null>(null);

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const fetchUtilisateurs = async (pseudo: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/utilisateurs?pseudo=${pseudo}`);
      if (!response.ok) {
        throw new Error("Failed to fetch utilisateurs");
      }
      const data: Utilisateur[] = await response.json();
      setUtilisateurs(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetchUtilisateurs();
  };

  const openModal = (Utilisateur: Utilisateur | null = null) => {
    setSelectedUtilisateur(Utilisateur);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUtilisateur(null);
  };

  const openDeleteModal = (Utilisateur: Utilisateur) => {
    setUtilisateurToDelete(Utilisateur);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUtilisateurToDelete(null);
  };

  const handleDelete = async () => {
    if (UtilisateurToDelete) {
      await fetch(`/api/utilisateurs/${UtilisateurToDelete.id}`, {
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
    fetchUtilisateurs(name);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 bg-slate-50 rounded-lg shadow-md">
          <PageHeader
            title="Utilisateurs"
            icon={<FaUsers className="scale-[1.5]" color="#6D6B81" />}
          />
          <UtilisateursearchBar
            onAdd={() => openModal()}
            onSearch={handleSearch}
          />
          <UtilisateurTable
            utilisateurs={utilisateurs}
            onEdit={openModal}
            onDelete={openDeleteModal}
          />
        </div>
        <UtilisateurModal
          utilisateur={selectedUtilisateur}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-slate-50 rounded-lg shadow-lg text-slate-500">
              <h2 className="mb-4 text-2xl">Confirmer la suppression</h2>
              <p>
                Êtes-vous sûr de vouloir supprimer le Utilisateur "
                {UtilisateurToDelete?.pseudo}" ?
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

export default UtilisateursPage;
