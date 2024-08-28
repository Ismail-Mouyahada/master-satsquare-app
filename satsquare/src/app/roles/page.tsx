"use client";
import { FC, useEffect, useState } from "react";
import RoleTable from "@/components/Role/RoleTable";
import RoleModal from "@/components/Role/RoleModal";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaShieldAlt } from "react-icons/fa";
import RolesearchBar from "@/components/Role/RoleSearchBar";
import PageHeader from "@/components/PageHeader/PageHeader";
// import { Role } from "@/types/main-types/main";
import { Role } from "@/types/main-types/main";

const RolePage: FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/roles`);
      if (!response.ok) {
        throw new Error("Failed to fetch Roles");
      }
      const data: Role[] = await response.json();
      setRoles(data);
      setFilteredRoles(data); // Initially, show all roles
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetchRoles();
  };

  const openModal = (role: Role | null = null) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
  };

  const openDeleteModal = (role: Role) => {
    setRoleToDelete(role);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRoleToDelete(null);
  };

  const handleDelete = async () => {
    if (roleToDelete) {
      await fetch(`/api/roles/${roleToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      handleSave();
      closeDeleteModal();
    }
  };

  // Filter roles locally without making an API call
  const handleSearch = (name: string) => {
    const filtered = roles.filter((role) =>
      role.nom.toLowerCase().includes(name.toLowerCase())
    );
    setFilteredRoles(filtered);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 ml-[4em] bg-slate-50 rounded-lg shadow-md">
          <PageHeader
            title="Roles"
            icon={<FaShieldAlt className="scale-[1.5]" color="#6D6B81" />}
          />
          <RolesearchBar onAdd={() => openModal()} onSearch={handleSearch} />
          <RoleTable
            roles={filteredRoles} // Use the filtered list here
            onEdit={openModal}
            onDelete={openDeleteModal}
          />
        </div>
        <RoleModal
          role={
            selectedRole
              ? {
                  ...selectedRole,
                  utilisateurs: selectedRole.utilisateurs || [],
                }
              : null
          }
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-slate-50 rounded-lg shadow-lg text-slate-500">
              <h2 className="mb-4 text-2xl">Confirmer la suppression</h2>
              <p>
                Êtes-vous sûr de vouloir supprimer le Role "{roleToDelete?.nom}"
                ?
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

export default RolePage;
