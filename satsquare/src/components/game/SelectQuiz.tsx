import { useEffect, useState, useCallback } from "react";
import { useSocketContext } from "@/context/socket";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import debounce from "lodash.debounce";
import { Association } from "@/types/main-types/main";

interface Quiz {
  id: number;
  subject: string;
}

export default function SelectQuiz() {
  const { socket } = useSocketContext();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [associations, setAssociations] = useState<Association[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [selectedAssociation, setSelectedAssociation] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false); // Track if a quiz is being selected

  useEffect(() => {
    socket.emit('requestQuizzes');

    socket.on('quizzesList', (data: Quiz[]) => {
      setQuizzes(data);
      setLoading(false);
    });

    socket.on('game:errorMessage', (message: string) => {
      toast.dismiss(); // Dismiss any existing toasts
      toast.error(message.split(' ')[0] === 'Failed' ? 'Failed to load quizzes.' : message);
      setError(message);
      setLoading(false);
    });

    return () => {
      socket.off('quizzesList');
      socket.off('game:errorMessage');
    };
  }, [socket]);

  useEffect(() => {
    socket.emit('requestAssociations');

    socket.on('associationsList', (data: Association[]) => {
      setAssociations(data);
      setLoading(false);
    });

    socket.on('game:errorMessage', (message: string) => {
      toast.dismiss(); // Dismiss any existing toasts
      toast.error(message.split(' ')[0] === 'Failed' ? 'Failed to load associations.' : message);
      setError(message);
      setLoading(false);
    });

    return () => {
      socket.off('associationsList');
      socket.off('game:errorMessage');
    };
  }, [socket]);

  const handleQuizSelect = useCallback((quizId: number) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedQuiz(quizId);
      socket.emit('game:selectQuiz', quizId);

      // Prevent further selections for a short period to avoid spamming
      setTimeout(() => {
        setIsSelecting(false);
      }, 2000); // 2 seconds delay before allowing another selection
    } else {
      toast("Please wait before selecting another quiz", { icon: "⏳" });
    }
  }, [isSelecting, socket]);

  const handleAssociationSelect = useCallback((associationIds: number[]) => {
    if (!isSelecting) {
      setIsSelecting(true);
      setSelectedAssociation(associationIds);
      socket.emit('game:selectAssociation', associationIds);

      // Prevent further selections for a short period to avoid spamming
      setTimeout(() => {
        setIsSelecting(false);
      }, 2000); // 2 seconds delay before allowing another selection
    } else {
      toast("Please wait before selecting another association", { icon: "⏳" });
    }
  }, [isSelecting, socket]);

  const debouncedHandleQuizSelect = useCallback(
    debounce(handleQuizSelect, 300), // 300ms debounce delay
    [isSelecting]
  );

  const debouncedHandleAssociationSelect = useCallback(
    debounce(handleAssociationSelect, 300), // 300ms debounce delay
    [isSelecting]
  );

  if (loading) {
    return <div className="w-full h-full flex justify-center items-center"><FaSpinner className="text-5xl text-[#d49d25] animate-spin" /></div>;
  }

  if (error) {
    toast.dismiss(); // Ensure only one error toast is displayed at a time
    toast.error(error);
    return null; // Avoid rendering the select elements if there's an error
  }

  return (
    <>
      <select
        id="quiz-select"
        className="text-md text-gray-700 border-gray-300 outline outline-2 outline-none p-2.5 text-center rounded-md"
        onChange={(e: any) => debouncedHandleQuizSelect(Number(e.target.value))}
        value={selectedQuiz || ""}
        disabled={isSelecting} // Disable while a quiz is being selected
      >
        <option className="text-md text-gray-700 border-gray-300 outline outline-2 outline-none p-2.5 text-center rounded-md" value="" disabled>
          Select a quiz
        </option>

        {quizzes.map((quiz: Quiz) => (
          <option className="text-md text-gray-700 border-gray-300 outline outline-2 outline-none p-2.5 text-center rounded-md" key={quiz.id} value={quiz.id}>
            {quiz.subject}
          </option>
        ))}
      </select>

      <select
        multiple
        id="association-select"
        className="text-md text-gray-700 border-gray-300 outline outline-2 outline-none p-2.5 text-center rounded-md"
        onChange={(e: any) => {
          const selectedOptions = Array.from(e.target.selectedOptions, (option: any) => Number(option.value));
          debouncedHandleAssociationSelect(selectedOptions);
        }}
        value={selectedAssociation.map(String)} // Convert numbers to strings
        disabled={isSelecting} // Disable while a quiz is being selected
      >
        <option className="text-md text-gray-700 border-gray-300 outline outline-2 outline-none p-2.5 text-center rounded-md" value="" disabled>
          Select Associations
        </option>

        {associations.map((association: Association) => (
          <option className="text-md text-black border-gray-300 outline outline-2 outline-none p-6 text-center rounded-md" key={association.id} value={association.id} label={association.nom}>
            {association.nom}
          </option>
        ))}
      </select>
    </>
  );
}
