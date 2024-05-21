import { FC, useState, useEffect, FormEvent } from "react";
import { Evenement } from "@prisma/client";

interface QuizModalProps {
  Quiz?: Evenement | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const QuizModal: FC<QuizModalProps> = ({
  Quiz,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    commence_a: "",
    termine_a: "",
    est_public: false,
  });

  useEffect(() => {
    if (Quiz) {
      setFormData({
        nom: Quiz.nom,
        description: Quiz.description,
        commence_a: new Date(Quiz.commence_a).toISOString().substring(0, 16),
        termine_a: new Date(Quiz.termine_a).toISOString().substring(0, 16),
        est_public: Quiz.est_public,
      });
    } else {
      setFormData({
        nom: "",
        description: "",
        commence_a: "",
        termine_a: "",
        est_public: false,
      });
    }
  }, [Quiz]);

  const handleChange = (
    e: React.ChangeQuiz<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.prQuizDefault();
    const payload = {
      ...formData,
      commence_a: new Date(formData.commence_a),
      termine_a: new Date(formData.termine_a),
    };
    const method = Quiz ? "PUT" : "POST";
    const url = Quiz ? `/api/Quizs/${Quiz.id}` : "/api/Quizs";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    onSave();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl mb-4 text-[#8495B0]">
          {Quiz ? "Modifier Événement" : "Ajouter Événement"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Commence à
            </label>
            <input
              type="datetime-local"
              name="commence_a"
              value={formData.commence_a}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Termine à
            </label>
            <input
              type="datetime-local"
              name="termine_a"
              value={formData.termine_a}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded-md"
              required
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="est_public"
              id="est_public"
              checked={formData.est_public}
              onChange={handleChange}
              className="hidden"
            />
            <label
              htmlFor="est_public"
              className="flex items-center space-x-2 cursor-pointer"
            >
              <span
                className={`w-8 h-8 rounded-full border-4 ${formData.est_public ? "bg-black border-gray-300" : "bg-white border-gray-300"}`}
              ></span>
              <span className="text-sm font-medium text-gray-700">Public</span>
            </label>
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
              {Quiz ? "Modifier" : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizModal;
