<<<<<<< HEAD
import prisma from "@/db/connect";
import { Sponsor } from "@prisma/client";
import { FC } from "react";
import SponsorHeader from "../components/Sponsor/SponsorHeader";
import SponsorSearchBar from "../components/Sponsor/SponsorSearchBar";
import SponsorTable from "../components/Sponsor/SponsorTable";
import Sidebar from "@/components/Sidebar/page";

=======
"use client";
import { FC, useEffect, useState } from 'react';
import { Sponsor } from '@prisma/client';
import SponsorTable from '@/components/Sponsor/SponsorTable';
import SponsorSearchBar from '@/components/Sponsor/SponsorSearchBar';
import SponsorHeader from '@/components/Sponsor/SponsorHeader';
import SponsorModal from '@/components/Sponsor/SponsorModal';
>>>>>>> 670891af998a61e5832c443ace6abd6f2bb5654c

const SponsorsPage: FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [sponsorToDelete, setSponsorToDelete] = useState<Sponsor | null>(null);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async (name: string = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sponsors?name=${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch sponsors');
      }
      const data: Sponsor[] = await response.json();
      setSponsors(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetchSponsors();
  };

  const openModal = (sponsor: Sponsor | null = null) => {
    setSelectedSponsor(sponsor);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSponsor(null);
  };

  const openDeleteModal = (sponsor: Sponsor) => {
    setSponsorToDelete(sponsor);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSponsorToDelete(null);
  };

  const handleDelete = async () => {
    if (sponsorToDelete) {
      await fetch(`/api/sponsors/${sponsorToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      handleSave();
      closeDeleteModal();
    }
  };

  const handleSearch = (name: string) => {
    fetchSponsors(name);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<<<<<<< HEAD
    <aside className="flex flex-row w-full ">
        <Sidebar/>
      <div className="  bg-[#F3F3FF]  w-full">

        <div className="p-4 bg-white rounded-lg shadow-md">

          <SponsorHeader />
          <SponsorSearchBar />
          <SponsorTable sponsors={sponsors} />
        </div>
      </div>
    </aside>

=======
    <div className="h-screen bg-[#F3F3FF] p-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <SponsorHeader />
        <SponsorSearchBar onAdd={() => openModal()} onSearch={handleSearch} />
        <SponsorTable sponsors={sponsors} onEdit={openModal} onDelete={openDeleteModal} />
      </div>
      <SponsorModal
        sponsor={selectedSponsor}
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
      />
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl mb-4">Confirmer la suppression</h2>
            <p>Êtes-vous sûr de vouloir supprimer le sponsor "{sponsorToDelete?.nom}" ?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={closeDeleteModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">Annuler</button>
              <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-md">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
>>>>>>> 670891af998a61e5832c443ace6abd6f2bb5654c
  );
};

export default SponsorsPage;
