"use client";
import { FC, useEffect, useState } from "react";
import AssociationTable from "@/components/Association/AssociationTable";
import AssociationSearchBar from "@/components/Association/AssociationSearchBar";
import AssociationModal from "@/components/Association/AssociationModal";
import PageHeader from "@/components/PageHeader/PageHeader";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaHandsHelping } from "react-icons/fa";
import { Association } from "@/types/main-types/main";

const AssociationsPage: FC = () => {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [initialAssociations, setInitialAssociations] = useState<Association[]>(
    []
  ); // Store the initial list
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAssociation, setSelectedAssociation] =
    useState<Association | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [associationToDelete, setAssociationToDelete] =
    useState<Association | null>(null);

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/associations`);
      if (!response.ok) {
        throw new Error("Failed to fetch associations");
      }
      const data: Association[] = await response.json();
      setAssociations(data);
      setInitialAssociations(data); // Store the initial data
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetchAssociations();
  };

  const openModal = (association: Association | null = null) => {
    setSelectedAssociation(association);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAssociation(null);
  };

  const openDeleteModal = (association: Association) => {
    setAssociationToDelete(association);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setAssociationToDelete(null);
  };

  const handleDelete = async () => {
    if (associationToDelete) {
      await fetch(`/api/associations/${associationToDelete.id}`, {
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
    if (name === "") {
      setAssociations(initialAssociations); // Reset to the initial data if search is cleared
    } else {
      const filteredAssociations = initialAssociations.filter((association) =>
        association.nom.toLowerCase().includes(name.toLowerCase())
      );
      setAssociations(filteredAssociations);
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
            title="Associations"
            icon={<FaHandsHelping className="scale-[1.5]" color="#6D6B81" />}
          />
          <AssociationSearchBar
            onAdd={() => openModal()}
            onSearch={handleSearch}
          />
          <AssociationTable
            associations={associations.map((association) => ({
              ...association,
              associationDons: [],
              utilisateurs: [],
            }))}
            onEdit={(association) =>
              openModal({
                ...association,
                associationDons: [],
                utilisateurs: [],
              })
            }
            onDelete={(association) =>
              openDeleteModal({
                ...association,
                associationDons: [],
                utilisateurs: [],
              })
            }
          />
        </div>
        <AssociationModal
          association={selectedAssociation}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-slate-50 rounded-lg shadow-lg text-slate-500">
              <h2 className="mb-4 text-2xl">Confirmer la suppression</h2>
              <p>
                Êtes-vous sûr de vouloir supprimer l'association "
                {associationToDelete?.nom}" ?
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

export default AssociationsPage;
