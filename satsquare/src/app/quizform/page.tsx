"use client";
import { SetStateAction, useState } from "react";
import { FaBox, FaBtc, FaPlus, FaCopy, FaTrash, FaTimes } from "react-icons/fa";

const QuizForm = () => {
  const [quizName, setQuizName] = useState("");
  const [questions, setQuestions] = useState([
    { id: 1, text: "", answers: ["", "", "", ""], correctAnswer: null, imageUrl: "" },
  ]);
  const [selectedQuestion, setSelectedQuestion] = useState(questions[0].id);

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

  const handleQuizNameChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
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
        q.id === questionId ? { ...q, correctAnswer: answerIndex, imageUrl: q.imageUrl } : q
      ) as {
        id: number;
        text: string;
        answers: string[];
        correctAnswer: null;
        imageUrl: string;
      }[]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setQuestions(questions.map((q) =>
          q.id === selectedQuestion ? { ...q, imageUrl: reader.result as string } : q
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = (questionId: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, imageUrl: "" } : q
      )
    );
  };

  return (
    <div className="w-full min-h-screen flex items-start justify-center bg-[#ecedf0]">
      <div className="flex w-full min-h-screen">
        <div className="w-5/6 min-h-screen">
          <div className="bg-primary p-7 w-full h-50 rounded-md">
            <div className="flex items-center justify-end gap-3">
              <FaBtc className="text-[#ffffff] scale-[200%]" />
              <input
                type="text"
                value={quizName}
                onChange={handleQuizNameChange}
                placeholder="Nom de Quiz"
                className="text-xl font-bold text-left border border-none rounded-lg px-4 py-2 w-full bg-transparent text-white placeholder-[#e0e1e7]"
              />
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg">
                Annuler
              </button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg">
                Enregistrer
              </button>
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
                className="text-center text-xl border border-gray-300 rounded-lg p-4 w-5/6 font-bold"
              />
              {!questions.find((q) => q.id === selectedQuestion)?.imageUrl && (
                <div className="bg-slate-50 w-fit border-2 border-dashed border-gray-300 rounded-lg flex flex-col gap-3 items-center justify-center cursor-pointer mt-4 relative p-11">
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
                <div className="mt-4 relative">
                  <img
                    src={questions.find((q) => q.id === selectedQuestion)?.imageUrl}
                    alt="Uploaded content"
                    className="w-full h-auto max-h-64 object-contain rounded-md"
                  />
                  <button
                    onClick={() => handleImageRemove(selectedQuestion)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
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
                      className="border border-gray-300 rounded-lg px-4 py-2 w-full bg-transparent border-none"
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
        <div className="ml-4 w-1/6 bg-primary scroll-auto p-4 rounded-md min-w-48">
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
                  className="bg-slate-300 text-gray-500 p-2 rounded-full"
                >
                  <FaCopy />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteQuestion(question.id);
                  }}
                  className="bg-slate-300 text-gray-500 p-2 rounded-full"
                >
                  <FaTrash />
                </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addQuestion}
            className="bg-slate-50 shadow-md rounded-lg p-8 w-full mb-2 flex flex-col gap-3 items-center justify-center bg-opacity-80"
          >
            <span className="text-slate-400 font-bold">Nouvelle question</span>
            <FaPlus className="scale-[150%] text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
