import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSocketContext } from '@/context/socket';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';
import debounce from 'lodash.debounce';

interface Quiz {
  id: number;
  subject: string;
}

export default function SelectQuiz() {
  const { socket } = useSocketContext();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    socket.emit('requestQuizzes');

    const handleQuizzesList = (data: Quiz[]) => {
      setQuizzes(data);
      setLoading(false);
    };

    const handleErrorMessage = (message: string) => {
      toast.dismiss();
      toast.error(message.split(' ')[0] === 'Failed' ? 'Failed to load quizzes.' : message);
      setError(message);
      setLoading(false);
    };

    socket.on('quizzesList', handleQuizzesList);
    socket.on('game:errorMessage', handleErrorMessage);

    return () => {
      socket.off('quizzesList', handleQuizzesList);
      socket.off('game:errorMessage', handleErrorMessage);
    };
  }, [socket]);

  const handleQuizSelect = useCallback(
    (quizId: number) => {
      if (!isSelecting) {
        setIsSelecting(true);
        setSelectedQuiz(quizId);
        socket.emit('game:selectQuiz', quizId);

        setTimeout(() => {
          setIsSelecting(false);
        }, 2000); // 2 seconds delay before allowing another selection
      } else {
        toast('Please wait before selecting another quiz', { icon: '⏳' });
      }
    },
    [isSelecting, socket]
  );

  // Memoize the debounced version of handleQuizSelect
  const debouncedHandleQuizSelect = useMemo(
    () => debounce((quizId: number) => handleQuizSelect(quizId), 300),
    [handleQuizSelect] // Dependency array updated to include handleQuizSelect
  );

  useEffect(() => {
    return () => {
      // Cleanup the debounce on unmount
      debouncedHandleQuizSelect.cancel();
    };
  }, [debouncedHandleQuizSelect]);

  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <FaSpinner className="text-5xl text-[#d49d25] animate-spin" />
      </div>
    );
  }

  if (error) {
    toast.dismiss();
    toast.error(error);
    return null;
  }

  return (
    <>
      <select
        id="quiz-select"
        className="text-md text-gray-700 border-gray-300 outline outline-2 outline-none p-2.5 text-center rounded-md"
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          debouncedHandleQuizSelect(Number(e.target.value))
        }
        value={selectedQuiz || ''}
        disabled={isSelecting}
      >
        <option
          className="text-md text-gray-700 border-gray-300 outline outline-2 outline-none p-2.5 text-center rounded-md"
          value=""
          disabled
        >
          Select a quiz
        </option>

        {quizzes.map((quiz: Quiz) => (
          <option
            className="text-md text-gray-700 border-gray-300 outline outline-2 outline-none p-2.5 text-center rounded-md"
            key={quiz.id}
            value={quiz.id}
          >
            {quiz.subject}
          </option>
        ))}
      </select>
    </>
  );
}
