"use client";
import { FC, useEffect, useState } from "react";
 
import EventTable from "@/components/Event/EventTable";
import EventSearchBar from "@/components/Event/EventSearchBar";
import EventModal from "@/components/Event/EventModal";
import PageHeader from "@/components/PageHeader/PageHeader";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaCalculator } from "react-icons/fa";
import { Evenement } from "@/types/entities-types";

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

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 bg-slate-50 rounded-lg shadow-md">
          <PageHeader
            title="Evenements"
            icon={<FaCalculator className="scale-[1.5]" color="#6D6B81" />}
          />
          <EventSearchBar onAdd={() => openModal()} onSearch={handleSearch} />
          <EventTable
            events={events.map(event => ({
              ...event,
              userId: event.userId ?? null,
              dons: event.dons,
              evenementsQuiz: event.evenementsQuiz
            }))}
            onEdit={(event) => openModal(event as Evenement)}
            onDelete={(event) => openDeleteModal(event as Evenement)}
          />
        </div>
        {selectedEvent && (
          <EventModal
            event={{
              ...selectedEvent,
              userId: selectedEvent.userId ?? null,
            }}
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="p-6 bg-slate-50 rounded-lg shadow-lg text-slate-500">
              <h2 className="mb-4 text-2xl">Confirmer la suppression</h2>
              <p>
                Êtes-vous sûr de vouloir supprimer l'événement "
                {eventToDelete?.nom}" ?
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

export default EventsPage;
