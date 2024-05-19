'use client'

import { QuestionState, Difficulty, fetchQuestions } from "@/data/ApiQuestions";
import QuestionCard from "../../components/QuestionCard/QuestionCard";
import { useState } from "react";
import './styles.css';
import Image from "next/image";

const LoaderImage = "./images/loading.gif";

const TOTAL_QUESTIONS = 10;

export type AnswerObject = {
  question: string;
  correctAnswer: string;
  answer: string;
  correct: boolean;
};

export default function Quiz() {
  const [loading, setLoading] = useState<boolean>(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(true);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState<number>(0);
  const [complete, setComplete] = useState<boolean>(false);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);

  const startQuiz = async () => {
    setComplete(false);
    setLoading(true);
    const newQuestions = await fetchQuestions(TOTAL_QUESTIONS, difficulty);
    setQuestions(newQuestions);
    setLoading(false);
    setGameOver(false);
    setNumber(0); // Reset question number when starting a new quiz
    setUserAnswers([]); // Clear user answers when starting a new quiz
    setScore(0); // Reset score when starting a new quiz
  };

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correct = questions[number].correct_answer === answer;
      if (correct) setScore((prevScore) => prevScore + 1);
      const answerObject: AnswerObject = {
        question: questions[number].question,
        correctAnswer: questions[number].correct_answer,
        answer,
        correct,
      };
      setUserAnswers((prevAnswers) => [...prevAnswers, answerObject]);
    }
  };

  const handleNext = () => {
    const nextNumber = number + 1;
    setNumber(nextNumber);
    if (nextNumber === TOTAL_QUESTIONS) setComplete(true);
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(e.target.value as unknown as Difficulty);
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-md bg-[#2c2e9f] bg-opacity-80">
      {!gameOver && !complete && <p className="score">Score: {score}</p>}
      {complete && <div className="p-4 bg-white rounded-md complete">Quiz is complete</div>}

      {(gameOver || complete) ? (
        <>
          <button className="btn-primary text-slate-700" onClick={startQuiz}>
            Start Quiz
          </button>
          <p className="p-4 text-slate-700">Selectionner la difficulté </p>
          <select className="w-full p-4 font-bold rounded-md" value={difficulty} onChange={handleDifficultyChange}>
            {Object.keys(Difficulty).map((key) => (
              <option className="font-bold text-slate-700" key={key} value={Difficulty[key as keyof typeof Difficulty]}>
                {key}
              </option>
            ))}
          </select>
        </>
      ) : null}
      {loading && <Image width={150} height={150} src={LoaderImage} alt="loading" />}
      {!loading && !gameOver && !complete && (
        <QuestionCard
          questionNum={number + 1}
          question={questions[number]?.question}
          answers={questions[number]?.answers}
          totalQuestions={TOTAL_QUESTIONS}
          userAnswer={userAnswers[number]}
          callback={checkAnswer}
        />
      )}
      {!loading && !gameOver && !complete && !!userAnswers[number] && (
        <button className="btn-primary" onClick={handleNext}>
         Suivant
        </button>
      )}
    </div>
  );
}
