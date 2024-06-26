"use client";
import React, { useState } from "react";
import PageHeader from "@/components/PageHeader/PageHeader";
import Sidebar from "@/components/Sidebar/page";
import { FaCalendarAlt, FaGamepad, FaHome } from "react-icons/fa";
import EventCreationModal from "@/components/EventCreationModal/EventCreationModal";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="w-full bg-[#F3F3FF] flex min-h-screen">
        <Sidebar />

        <div className="p-4 bg-slate-50 rounded-lg shadow-md w-full flex flex-col justify-between">
          <PageHeader
            title="Dashboard"
            icon={<FaHome className="scale-[1.5]" color="#6D6B81" />}
          />
          <div className="bg-[#F3F3FF] rounded-md p-8 h-full flex justify-center items-center">
            <div className="flex item-center justify-around w-full">
              <div className="flex flex-col items-center justify-between p-4">
                <button className="flex items-center p-4 bg-slate-50 rounded-lg shadow-md w-full">
                  <div className="p-4 bg-main rounded-full">
                    <FaGamepad className="text-white scale-[180%]" />
                  </div>
                  <span className="ml-4 font-bold text-[#909db4]">
                    Créer un quiz
                  </span>
                </button>
                <button
                  className="flex items-center p-4 bg-slate-50 rounded-lg shadow-md w-full"
                  onClick={handleOpenModal}
                >
                  <div className="p-4 bg-main rounded-full">
                    <FaCalendarAlt className="text-white scale-[160%]" />
                  </div>
                  <span className="ml-4 font-bold text-[#909db4]">
                    Créer un événement
                  </span>
                </button>
              </div>
              <div className="flex flex-col items-center justify-center px-4 py-2">
                <div className="flex flex-col items-center p-8 bg-slate-50 rounded-lg shadow-md gap-4">
                  <div className="flex flex-row items-center">
                    <div className="p-4 bg-main rounded-full">
                      <FaCalendarAlt className="text-white scale-[160%]" />
                    </div>
                    <span className="ml-4 font-bold text-[#909db4]">
                      Rejoindre un événement
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="Code PIN de l'événement"
                    className="w-full px-8 py-3 border-none shadow bg-slate-100 rounded-md outline-none"
                  />
                  <button className="p-2 bg-action font-bold text-[#6C7584] rounded w-full">
                    Valider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EventCreationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
