<<<<<<< HEAD
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";

export default function Evenements() {
=======
"use client"
import { FC, useEffect, useState } from 'react';
import { Evenement } from '@prisma/client';
import EventTable from '@/components/Event/EventTable';
import EventSearchBar from '@/components/Event/EventSearchBar';
import EventModal from '@/components/Event/EventModal';
import EventHeader from '@/components/Event/EventHeader';
>>>>>>> 670891af998a61e5832c443ace6abd6f2bb5654c

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

  const fetchEvents = async (name: string = '') => {
    setLoading(true);
    try {
      const response = await fetch(`/api/events?name=${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
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
    fetchEvents(name);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
<<<<<<< HEAD
    <div className="h-screen bg-[#F3F3FF]  w-full">
      <div className="p-4 bg-white rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-[#F8D99B] p-2 rounded-md flex items-center">
              <span role="img" aria-label="icon">📅</span>
              <span className="px-4 ml-2 font-bold text-amber-800">Événements</span>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-primary">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-[#EDF2FF] text-gray-600">
                <th className="px-4 py-2 border">Nom</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Utilisateur</th>
                <th className="px-4 py-2 border">Commence</th>
                <th className="px-4 py-2 border">Termine</th>
                <th className="px-4 py-2 border">Public</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              {evenements.map((evenement) => (
                <tr key={evenement.id}>
                  <td className="px-4 py-2 border text-inherit"># {evenement.nom}</td>
                  <td className="px-4 py-2 border">{evenement.description}</td>
                  <td className="px-4 py-2 border">{evenement.utilisateur.nom}</td>
                  <td className="px-4 py-2 border">{new Date(evenement.commence_a).toLocaleString()}</td>
                  <td className="px-4 py-2 border">{new Date(evenement.termine_a).toLocaleString()}</td>
                  <td className="px-4 py-2 border">
                    {evenement.est_public ? <span className="text-green-500">✔️</span> : <span className="text-red-500">❌</span>}
                  </td>
                  <td className="px-4 py-2 space-x-2 border">
                    <button className="p-2 bg-green-400 rounded-md"><FaEdit className="text-white"/></button>
                    <button className="bg-[#F8D99B] p-2 rounded-md"><FaEye className="text-white"/></button>
                    <button className="p-2 bg-red-400 rounded-md"><FaTrash className="text-white"/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
=======
    <div className="h-screen bg-[#F3F3FF] p-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <EventHeader />
        <EventSearchBar onAdd={() => openModal()} onSearch={handleSearch} />
        <EventTable events={events} onEdit={openModal} onDelete={openDeleteModal} />
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
            <p>Êtes-vous sûr de vouloir supprimer l'événement "{eventToDelete?.nom}" ?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={closeDeleteModal} className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md">Annuler</button>
              <button onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded-md">Supprimer</button>
            </div>
          </div>
        </div>
      )}
>>>>>>> 670891af998a61e5832c443ace6abd6f2bb5654c
    </div>
  );
};

export default EventsPage;
