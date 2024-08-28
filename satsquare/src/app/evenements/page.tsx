"use client";
import { FC, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaCalendarAlt } from "react-icons/fa";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Evenement } from "@/types/main-types/main";
import EventSearchBar from "@/components/Event/EventSearchBar";
import EventTable from "@/components/Event/EventTable";
import EventModal from "@/components/Event/EventModal";

const EventsPage: FC = () => {
  const [events, setEvents] = useState<Evenement[]>([]);
  const [initialEvents, setInitialEvents] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Evenement | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [eventToDelete, setEventToDelete] = useState<Evenement | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data: Evenement[] = await response.json();
      setEvents(data);
      setInitialEvents(data); // Save the initial list for filtering
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (name: string) => {
    if (name === "") {
      setEvents(initialEvents); // Reset to initial list if search term is empty
    } else {
      const filteredEvents = initialEvents.filter((event) =>
        event.nom.toLowerCase().includes(name.toLowerCase())
      );
      setEvents(filteredEvents);
    }
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
      fetchEvents();
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
            title="Evenements"
            icon={<FaCalendarAlt className="scale-[1.5]" color="#6D6B81" />}
          />
          <EventSearchBar onAdd={() => openModal()} onSearch={handleSearch} />
          <EventTable
            events={events}
            onEdit={openModal}
            onDelete={openDeleteModal}
          />
        </div>
        {isModalOpen && (
          <EventModal
            event={selectedEvent}
            isOpen={isModalOpen}
            onClose={closeModal}
            onSave={fetchEvents}
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
