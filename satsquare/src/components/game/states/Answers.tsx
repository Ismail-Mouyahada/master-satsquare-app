import AnswerButton from "../../AnswerButton";
import { useSocketContext } from "@/context/socket";
import { SetStateAction, Key, useEffect, useState } from "react";
import clsx from "clsx";
import useSound from "use-sound";
import { usePlayerContext } from "@/context/player";
import {
  SFX_ANSWERS_SOUND,
  SFX_RESULTS_SOUND,
  SFX_ANSWERS_MUSIC,
  ANSWERS_COLORS,
  ANSWERS_ICONS,
} from "@/constants/db";
import Image from "next/image";

const calculatePercentages = (objectResponses: any) => {
  const keys = Object.keys(objectResponses);
  const values = Object.values(objectResponses);

  if (!values.length) {
    return [];
  }

  const totalSum: any = values.reduce((accumulator: any, currentValue: any) => accumulator + currentValue, 0);

  let result: any = {};

  keys.map((key: any) => {
    result[key] = ((objectResponses[key] / totalSum) * 100).toFixed() + "%";
  });

  return result;
};

export default function Answers({
  data: { question, answers, image, time, responses, correct },
}: any) {
  const { socket } = useSocketContext();
  const { player } = usePlayerContext();

  const [percentages, setPercentages] = useState([]);
  const [cooldown, setCooldown] = useState(time);
  const [totalAnswer, setTotalAnswer] = useState(0);

  const [sfxPop] = useSound(SFX_ANSWERS_SOUND, {
    volume: 0.1,
  });

  const [sfxResults] = useSound(SFX_RESULTS_SOUND, {
    volume: 0.2,
  });

  const [playMusic, { stop: stopMusic, isPlaying }] : any = useSound(SFX_ANSWERS_MUSIC, {
    volume: 0.2,
  });

  const handleAnswer = (answer: any) => {
    if (!player) {
      return;
    }

    socket.emit("player:selectedAnswer", answer);
    sfxPop();
  };

  useEffect(() => {
    if (!responses) {
      playMusic();
      return;
    }

    stopMusic();
    sfxResults();

    setPercentages(calculatePercentages(responses));
  }, [responses, playMusic, stopMusic, sfxResults]);

  useEffect(() => {
    if (!isPlaying) {
      playMusic();
    }
  }, [isPlaying, playMusic]);

  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, [stopMusic]);

  useEffect(() => {
    socket.on("game:cooldown", (sec: any) => {
      setCooldown(sec);
    });

    socket.on("game:playerAnswer", (count: SetStateAction<number>) => {
      setTotalAnswer(count);
      sfxPop();
    });

    return () => {
      socket.off("game:cooldown");
      socket.off("game:playerAnswer");
    };
  }, [socket, sfxPop]);

  return (
    <div className="flex flex-col justify-between flex-1 h-full">
      <div className="inline-flex flex-col items-center justify-center flex-1 w-full h-full gap-5 mx-auto max-w-7xl">
        <h2 className="text-2xl font-bold text-center text-white drop-shadow-lg md:text-4xl lg:text-5xl">
          {question}
        </h2>

        {!!image && !responses && (
          <Image    width={undefined} height={undefined}  src={image} className="w-auto h-48 rounded-md max-h-60" alt={"Question related"} />
        )}

        {responses && (
          <div className={`grid w-full gap-4 grid-cols-${answers.length} mt-8 h-40 max-w-3xl px-2`}>
            {answers.map((_: any, key: Key | any | undefined) => (
              <div
                key={key}
                className={clsx("flex flex-col justify-end self-end overflow-hidden rounded-md", ANSWERS_COLORS[key])}
                style={{ height: percentages[key] }}
              >
                <span className="w-full text-lg font-bold text-center text-white bg-black/10 drop-shadow-md">
                  {responses[key] || 0}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {!responses && (
          <div className="flex justify-between w-full gap-1 px-2 mx-auto mb-4 text-lg font-bold text-white max-w-7xl md:text-xl">
            <div className="flex flex-col items-center px-4 text-lg font-bold rounded-full bg-black/40">
              <span className="text-sm translate-y-1">Temps</span>
              <span>{cooldown}</span>
            </div>
            <div className="flex flex-col items-center px-4 text-lg font-bold rounded-full bg-black/40">
              <span className="text-sm translate-y-1">Réponses</span>
              <span>{totalAnswer}</span>
            </div>
          </div>
        )}

        <div className="grid w-full grid-cols-2 gap-1 px-2 mx-auto mb-4 text-lg font-bold text-white rounded-full max-w-7xl md:text-xl">
          {answers.map((answer: any, key: any) => (
            <AnswerButton
              key={key}
              className={clsx(ANSWERS_COLORS[key], { "opacity-65": responses && correct !== key })}
              icon={ANSWERS_ICONS[key]}
              onClick={() => handleAnswer(key)}
            >
              {answer}
            </AnswerButton>
          ))}
        </div>
      </div>
    </div>
  );
}
