import * as React from "react";
import { ButtonWrapper, Wrapper } from "./QuestionCard.styles";
import { AnswerObject } from "@/app/quiz/page";


//import styling
 

type Props = {
  question: string;
  answers: string[];
  callback: any;
  userAnswer: AnswerObject | undefined;
  questionNum: number;
  totalQuestions: number;
};

const QuestionCard: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAnswer,
  questionNum,
  totalQuestions
}) => {
  return (
    <Wrapper>
      <p className="my-4 text-3xl font-bold text-white" dangerouslySetInnerHTML={{ __html: question }} />
      <p className="p-4 font-bold rounded-md bg-slate-200 rouned-md text-slate-800"> Question: {questionNum} / {totalQuestions} </p>

     <div className="grid w-full grid-cols-2 gap-3 my-4">
     {answers.map((answer: string) => (
        <ButtonWrapper className="w-full"
          correct={userAnswer?.correctAnswer === answer}
          userClicked={userAnswer?.answer === answer}
          key={answer}
        >
          <button className="w-full px-40 py-6 font-bold bg-slate-200 text-slate-600" disabled={!!userAnswer} value={answer} onClick={callback}>
          { answer}
          </button>
        </ButtonWrapper>
      ))}
     </div>
    </Wrapper>
  );
};

export default QuestionCard;
