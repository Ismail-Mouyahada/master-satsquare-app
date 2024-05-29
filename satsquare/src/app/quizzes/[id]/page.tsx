"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaBox, FaPlus, FaCopy, FaTrash, FaTimes } from "react-icons/fa";

interface Question {
  id: number;
  text: string;
  answers: string[];
  correctAnswer: number | null;
  imageUrl: string;
}

const QuizForm = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;
  const [quizName, setQuizName] = useState("");
  const [category, setCategory] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      text: "",
      answers: ["", "", "", ""],
      correctAnswer: null,
      imageUrl: "",
    },
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0].id);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
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
      setQuizName(quiz.titre);
      setCategory(quiz.categorie);
      setQuestions(
        quiz.Questions.map((q: any) => ({
          id: q.id,
          text: q.texte_question,
          answers: q.Reponses.map((r: any) => r.texte_reponse),
          correctAnswer: q.Reponses.findIndex((r: any) => r.est_correcte),
          imageUrl: q.imageUrl,
        }))
      );
      setSelectedQuestion(quiz.Questions[0].id);
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
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
    const payload = {
      titre: quizName,
      categorie: category,
      questions: questions.map((q) => ({
        texte_question: q.text,
        reponses: q.answers.map((a, i) => ({
          texte_reponse: a,
          est_correcte: i === q.correctAnswer,
        })),
        imageUrl: q.imageUrl,
      })),
    };

    try {
      const response = await fetch(`/api/quizzes/${id}`, {
        method: id ? "PUT" : "POST",
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
    if (id) {
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
                placeholder="Nom de Quiz"
                className="text-xl font-bold text-left border border-none rounded-lg px-4 py-2 w-full bg-transparent text-white placeholder-[#e0e1e7]"
              />
              <input
                type="text"
                value={category}
                onChange={handleCategoryChange}
                placeholder="Catégorie"
                className="text-xl font-bold text-left border border-none rounded-lg px-4 py-2 w-full bg-transparent text-white placeholder-[#e0e1e7] mt-2"
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
                  handleQuestionChange(selectedQuestion, e.target.value)
                }
                placeholder="Une question dans un sujet de votre choix ?"
                className="w-5/6 p-4 text-xl font-bold text-center border border-gray-300 rounded-lg"
              />
              {!questions.find((q) => q.id === selectedQuestion)?.imageUrl && (
                <div className="relative flex flex-col items-center justify-center gap-3 mt-4 bg-white border-2 border-gray-300 border-dashed rounded-lg cursor-pointer w-fit p-11">
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
                  <img
                    src={
                      questions.find((q) => q.id === selectedQuestion)?.imageUrl
                    }
                    alt="Uploaded content"
                    className="object-contain w-full h-auto rounded-md max-h-64"
                  />
                  <button
                    onClick={() => handleImageRemove(selectedQuestion)}
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
                ?.answers.map((answer, index) => (
                  <div
                    className="flex items-center bg-[#FCFCFC] p-8 shadow-md rounded-md"
                    key={index}
                  >
                    <FaBox className="scale-[200%] text-slate-500" />
                    <input
                      type="text"
                      value={answer}
                      onChange={(e) =>
                        handleAnswerChange(
                          selectedQuestion,
                          index,
                          e.target.value
                        )
                      }
                      placeholder={`Ajoute une réponse ${index + 1} ${
                        index < 2 ? "(requis)" : "(facultatif)"
                      }`}
                      className="w-full px-4 py-2 bg-transparent border border-gray-300 border-none rounded-lg"
                    />
                    <input
                      type="radio"
                      name={`answer-${selectedQuestion}`}
                      checked={
                        (questions.find((q) => q.id === selectedQuestion)
                          ?.correctAnswer ?? -1) === index
                      }
                      onChange={() =>
                        handleCorrectAnswerChange(selectedQuestion, index)
                      }
                      className="mr-2 bg-transparent border-slate-400 bg-slate-300 scale-[200%] text-[#19ce6a]"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="w-1/6 p-4 ml-4 rounded-md bg-primary scroll-auto min-w-48">
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
            className="flex flex-col items-center justify-center w-full gap-3 p-8 mb-2 bg-white rounded-lg shadow-md bg-opacity-80"
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
