"use client";
import { FC, useEffect, useState } from "react";
import { Evenement } from "@prisma/client";
import EventTable from "@/components/Event/EventTable";
import EventSearchBar from "@/components/Event/EventSearchBar";
import EventModal from "@/components/Event/EventModal";
import EventHeader from "@/components/Event/EventHeader";
import Sidebar from "@/components/Sidebar/page";

const EventsPage: FC = () => {
  const [events, setEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<Evenement | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (name: string = "") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events?name=${name}`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data: Evenement[] = await response.json();
      setEvents(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    await fetchEvents();
  };

  const openModal = (event: Evenement | null = null) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const openDeleteModal = (event: Evenement) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const handleDelete = async () => {
    if (eventToDelete) {
      await fetch(`/api/events/${eventToDelete.id}`, {
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
    fetchEvents(name);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <EventHeader />
          <EventSearchBar onAdd={() => openModal()} onSearch={handleSearch} />
          <EventTable
            events={events}
            onEdit={openModal}
            onDelete={openDeleteModal}
          />
        </div>
        <EventModal
          event={selectedEvent}
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSave}
        />
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl mb-4">Confirmer la suppression</h2>
              <p>
                Êtes-vous sûr de vouloir supprimer l'événement "
                {eventToDelete?.nom}" ?
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  onClick={closeDeleteModal}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
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

export default EventsPage;
