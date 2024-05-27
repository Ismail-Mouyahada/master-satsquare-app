"use client";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EventCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EventCreationModal: React.FC<EventCreationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuizzes, setSelectedQuizzes] = useState([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [nom, setNom] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [estPublic, setEstPublic] = useState<string>("public");
  const [participation, setParticipation] = useState<string>("free");
  const [satMinimum, setSatMinimum] = useState<number>(0);
  const [recompenseJoueurs, setRecompenseJoueurs] = useState<number>(0);
  const [donAssociation, setDonAssociation] = useState<number>(0);
  const [donPlateforme, setDonPlateforme] = useState<number>(0);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("/api/quizzes");
        const data = await response.json();
        setQuizzes(
          data.map((quiz: any) => ({ value: quiz.id, label: quiz.titre }))
        );
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleSelectChange = (selectedOptions: any) => {
    setSelectedQuizzes(
      selectedOptions ? selectedOptions.map((option: any) => option.value) : []
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const eventData = {
      nom,
      description,
      est_public: estPublic,
      participation,
      sat_minimum: satMinimum,
      recompense_joueurs: recompenseJoueurs,
      don_association: donAssociation,
      don_plateforme: donPlateforme,
      commence_a: startDate,
      termine_a: endDate,
      quizzes: selectedQuizzes,
    };

    try {
      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        console.log("Event created:", newEvent);
        onClose();
      } else {
        console.error("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  if (!isOpen) return null;

  const inputStyle =
    "mt-1 block w-full p-2 rounded-md bg-[#f0f0f5] border-transparent";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-2xl mb-4 text-[#8495B0]">Créer un événement</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-5 gap-6 mb-4">
            <div className="col-span-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Titre de l’événement
                </label>
                <input
                  type="text"
                  className={inputStyle}
                  placeholder="ex: événement caritatif Bitcoin Rouen"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description de l’événement
                </label>
                <textarea
                  className={inputStyle}
                  placeholder="Description détaillée ..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Visibilité :
                </span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      className="mr-1"
                      checked={estPublic === "public"}
                      onChange={(e) => setEstPublic(e.target.value)}
                      required
                    />
                    Public
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      className="mr-1"
                      checked={estPublic === "private"}
                      onChange={(e) => setEstPublic(e.target.value)}
                      required
                    />
                    Privé
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Participation :
                </span>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="participation"
                      value="paid"
                      className="mr-1 to-[#7178b1]"
                      checked={participation === "paid"}
                      onChange={(e) => setParticipation(e.target.value)}
                      required
                    />
                    Payante
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="participation"
                      value="free"
                      className="mr-1"
                      checked={participation === "free"}
                      onChange={(e) => setParticipation(e.target.value)}
                      required
                    />
                    Gratuit
                  </label>
                </div>
              </div>
            </div>
            <div className="col-span-3">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre de Sat minimum pour participer
                </label>
                <input
                  type="number"
                  className={inputStyle}
                  placeholder="0.0000 sat"
                  value={satMinimum}
                  onChange={(e) => setSatMinimum(parseFloat(e.target.value))}
                  required
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Récompense joueurs
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    placeholder="00 %"
                    value={recompenseJoueurs}
                    onChange={(e) =>
                      setRecompenseJoueurs(parseFloat(e.target.value))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Don Association
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    placeholder="00 %"
                    value={donAssociation}
                    onChange={(e) =>
                      setDonAssociation(parseFloat(e.target.value))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Don Plateforme
                  </label>
                  <input
                    type="number"
                    className={inputStyle}
                    placeholder="00 %"
                    value={donPlateforme}
                    onChange={(e) =>
                      setDonPlateforme(parseFloat(e.target.value))
                    }
                    required
                  />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de début
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    className={inputStyle}
                    placeholderText="Sélectionner la date de début"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de fin
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date) => setEndDate(date)}
                    className={inputStyle}
                    placeholderText="Sélectionner la date de fin"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sélectionner les quiz
                </label>
                <Select
                  isMulti
                  name="quizzes"
                  options={quizzes}
                  className={inputStyle}
                  classNamePrefix="select"
                  onChange={handleSelectChange}
                  placeholder="Chercher et sélectionner des quiz..."
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-4 rounded-md"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-yellow-500 text-white py-2 px-4 rounded-md"
            >
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventCreationModal;
