"use client";
import { FC, useEffect, useState } from "react";
import UtilisateurTable from "@/components/Utilisateur/UtilisateurTable";
import UtilisateurModal from "@/components/Utilisateur/UtilisateurModal";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaUser } from "react-icons/fa";
import UtilisateursearchBar from "@/components/Utilisateur/UtilisateurSearchBar";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Utilisateur } from "@/types/entities-types";
import ProfileDetail from "@/components/ProfileDetail/ProfileDetail";

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
    <div className="flex flex-row w-full">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <PageHeader
            title="Profil"
            icon={<FaUser className="scale-[1.5]" color="#6D6B81" />}
          />
          <ProfileDetail />
        </div>
      </div>
    </div>
  );
};

export default UtilisateursPage;
