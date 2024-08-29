"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaPlus, FaCopy, FaTrash, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

interface Question {
  id: number;
  text: string;
  answers: string[];
  correctAnswer: number | null;
  imageUrl: string;
}

interface UserDTO {
  id: string;
  email: string;
}

const QuizForm = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserDTO | null>(null);

  const [questions, setQuestions] = useState<Question[]>(
    id === "create"
      ? [
          {
            id: 1,
            text: "",
            answers: ["", "", "", ""],
            correctAnswer: null,
            imageUrl: "",
          },
        ]
      : []
  );

  const [quizName, setQuizName] = useState("");
  const [password, setPassword] = useState(""); // New state for password
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(
    id === "create" ? 1 : null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/users?email=${session.user.email}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }
          const data: UserDTO = await response.json();
          setUserData(data);
        } catch (error: any) {
          console.error(
            "Erreur lors de la récupération des données utilisateur:",
            error
          );
          toast.error(
            "Erreur lors de la récupération des données utilisateur."
          );
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect(() => {
    if (id !== "create") {
      fetchQuiz(id);
    }
  }, [id]);

  const fetchQuiz = async (quizId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch quiz");
      }
      const quiz = await response.json();
      setQuizName(quiz.subject);
      setPassword(quiz.password); // Set the password if it exists
      const loadedQuestions = quiz.questions.map((q: any, index: number) => ({
        id: index + 1,
        text: q.question,
        answers: q.answers,
        correctAnswer: q.solution,
        imageUrl: q.image || "",
      }));
      setQuestions(loadedQuestions);
      setSelectedQuestion(loadedQuestions[0]?.id || null);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: "",
      answers: ["", "", "", ""],
      correctAnswer: null,
      imageUrl: "",
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestion(newQuestion.id);
  };

  const duplicateQuestion = (id: number) => {
    const questionToDuplicate = questions.find((q) => q.id === id);
    if (questionToDuplicate) {
      const newQuestion = {
        ...questionToDuplicate,
        id: questions.length + 1,
      };
      setQuestions([...questions, newQuestion]);
      setSelectedQuestion(newQuestion.id);
    }
  };

  const deleteQuestion = (id: number) => {
    if (questions.length > 1) {
      const newQuestions = questions.filter((q) => q.id !== id);
      setQuestions(newQuestions);
      setSelectedQuestion(newQuestions[0].id);
    } else {
      alert("You must have at least one question.");
    }
  };

  const handleQuizNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuizName(e.target.value);
  };

  const handleQuestionChange = (id: number, text: string) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const handleAnswerChange = (
    questionId: number,
    answerIndex: number,
    text: string
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((a, i) => (i === answerIndex ? text : a)),
            }
          : q
      )
    );
  };

  const handleCorrectAnswerChange = (
    questionId: number,
    answerIndex: number
  ) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, correctAnswer: answerIndex } : q
      )
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestions(
          questions.map((q) =>
            q.id === selectedQuestion
              ? { ...q, imageUrl: reader.result as string }
              : q
          )
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (questionId: number) => {
    setQuestions(
      questions.map((q) => (q.id === questionId ? { ...q, imageUrl: "" } : q))
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!userData?.id) {
      toast.error("User data not loaded yet.");
      setIsLoading(false);
      return;
    }

    const payload = {
      subject: quizName,
      utilisateurId: userData.id,
      password: password, // Include password in the payload
      questions: questions.map((q) => ({
        question: q.text,
        answers: q.answers,
        solution: q.correctAnswer,
        image: q.imageUrl,
      })),
    };

    try {
      const url = id === "create" ? `/api/quizzes` : `/api/quizzes/${id}`;
      const method = id === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save quiz");
      }

      router.push("/quizzes");
    } catch (error) {
      console.error("Error saving quiz:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (id && id !== "create") {
      try {
        const response = await fetch(`/api/quizzes/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete quiz");
        }

        router.push("/quizzes");
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-[#ecedf0]">
      <div className="flex w-full min-h-screen">
        <div className="w-5/6 min-h-screen">
          <div className="w-full rounded-md bg-primary p-7 h-50">
            <div className="flex items-center justify-end gap-3">
              <input
                type="text"
                value={quizName}
                onChange={handleQuizNameChange}
                placeholder="Nom du Quiz"
                className="font-bold text-left border border-none rounded-lg px-4 py-2 w-full bg-transparent text-white "
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="font-bold text-left border border-none rounded-lg px-4 py-2 w-full bg-transparent text-white "
              />
              <a
                href="/quizzes"
                className="px-4 py-2 mt-2 text-white bg-gray-500 rounded-lg"
              >
                Annuler
              </a>
              <button
                className="px-4 py-2 mt-2 text-white bg-orange-500 rounded-lg"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
              {id && (
                <button
                  className="px-4 py-2 mt-2 text-white bg-red-500 rounded-lg"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Supprimer
                </button>
              )}
            </div>
          </div>
          <div className="bg-[#EBEBF8] shadow-md rounded-lg p-8 my-8">
            <div className="bg-[#4960d8] p-8 rounded-md flex flex-col items-center justify-center gap-3">
              <input
                type="text"
                value={questions.find((q) => q.id === selectedQuestion)?.text}
                onChange={(e) =>
                  handleQuestionChange(selectedQuestion!, e.target.value)
                }
                placeholder="Une question dans un sujet de votre choix ?"
                className="w-5/6 p-4 text-xl font-bold text-center border border-gray-300 rounded-lg"
              />
              {!questions.find((q) => q.id === selectedQuestion)?.imageUrl && (
                <div className="relative flex flex-col items-center justify-center gap-3 mt-4 bg-slate-50 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer w-fit p-11">
                  <input
                    type="file"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <span className="text-[#8f97a5] font-bold">
                    Insère un contenu multimédia
                  </span>
                  <FaPlus className="scale-[200%] text-slate-400" />
                </div>
              )}
              {questions.find((q) => q.id === selectedQuestion)?.imageUrl && (
                <div className="relative mt-4">
                  <Image
                    src={
                      questions.find((q) => q.id === selectedQuestion)
                        ?.imageUrl ?? ""
                    }
                    alt="Uploaded content"
                    width={500}
                    height={300}
                    className="object-contain w-full h-auto rounded-md max-h-64"
                  />

                  <button
                    onClick={() => handleImageRemove(selectedQuestion!)}
                    className="absolute p-2 text-white bg-red-500 rounded-full top-2 right-2"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-6 my-6">
              {questions
                .find((q) => q.id === selectedQuestion)
                ?.answers.map((answer, index) => {
                  const correctAnswerIndex = questions.find(
                    (q) => q.id === selectedQuestion
                  )?.correctAnswer;
                  const isCorrectAnswer = correctAnswerIndex === index;

                  return (
                    <div
                      key={index}
                      onClick={() =>
                        handleCorrectAnswerChange(selectedQuestion!, index)
                      }
                      className={`flex items-center cursor-pointer bg-[#FCFCFC] p-8 shadow-md rounded-md ${
                        isCorrectAnswer ? "border-4 border-green-400" : ""
                      } hover:border-green-300`}
                    >
                      <FaBox className="scale-[200%] text-slate-500 mr-4" />
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) =>
                          handleAnswerChange(
                            selectedQuestion!,
                            index,
                            e.target.value
                          )
                        }
                        placeholder={`Ajoute une réponse ${index + 1} ${
                          index < 2 ? "(requis)" : "(facultatif)"
                        }`}
                        className="w-full px-4 py-2 bg-transparent border border-gray-300 rounded-lg"
                        onClick={(e) => e.stopPropagation()} // Prevent div click event when typing
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="w-1/6 p-4 ml-4 rounded-md bg-primary overflow-y-auto min-w-48 h-full max-h-screen">
          <div>
            {questions.map((question, index) => (
              <div
                key={index}
                onClick={() => setSelectedQuestion(question.id)}
                className={`cursor-pointer p-6 rounded-lg mb-2 ${
                  selectedQuestion === question.id
                    ? "bg-action hover:bg-slate-200 hover:text-[#ffffff] font-bold text-[#6C7584]"
                    : "bg-[#ffffff] hover:bg-opacity-100 font-bold text-[#808794]"
                }`}
              >
                <p className="py-2"># Question 0{index + 1}</p>
                <div className="flex flex-row justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateQuestion(question.id);
                    }}
                    className="p-2 text-gray-500 rounded-full bg-slate-300"
                  >
                    <FaCopy />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteQuestion(question.id);
                    }}
                    className="p-2 text-gray-500 rounded-full bg-slate-300"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addQuestion}
            className="flex flex-col items-center justify-center w-full gap-3 p-8 mb-2 bg-slate-50 rounded-lg shadow-md bg-opacity-80"
          >
            <span className="font-bold text-slate-400">Nouvelle question</span>
            <FaPlus className="scale-[150%] text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
