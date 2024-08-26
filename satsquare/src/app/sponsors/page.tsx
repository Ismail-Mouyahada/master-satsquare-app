"use client";
import { FC, useEffect, useState } from "react";
import SponsorTable from "@/components/Sponsor/SponsorTable";
import SponsorSearchBar from "@/components/Sponsor/SponsorSearchBar";
import SponsorModal from "@/components/Sponsor/SponsorModal";
import PageHeader from "@/components/PageHeader/PageHeader";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaDonate } from "react-icons/fa";
import { Sponsor } from "@/types/main-types/main";

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

  const fetchSponsors = async (name: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/sponsors?name=${name}`);
      if (!response.ok) {
        throw new Error("Failed to fetch sponsors");
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
    fetchSponsors(name);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 bg-slate-50 rounded-lg shadow-md">
          <PageHeader
            title="Sponsors"
            icon={<FaDonate className="scale-[1.5]" color="#6D6B81" />}
          />
          <SponsorSearchBar onAdd={() => openModal()} onSearch={handleSearch} />
          <SponsorTable
            sponsors={sponsors}
            onEdit={(sponsor) => openModal(sponsor as Sponsor)}
            onDelete={(sponsor) => openDeleteModal(sponsor as Sponsor)}
          />
        </div>
        <SponsorModal
          sponsor={selectedSponsor}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-slate-50 rounded-lg shadow-lg text-slate-500">
              <h2 className="mb-4 text-2xl">Confirmer la suppression</h2>
              <p>
                Êtes-vous sûr de vouloir supprimer le sponsor "
                {sponsorToDelete?.nom}" ?
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

export default SponsorsPage;
