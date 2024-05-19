import CricleCheck from "@/components/icons/CricleCheck";
import CricleXmark from "@/components/icons/CricleXmark";
import { usePlayerContext } from "@/context/player";
import { SFX_RESULTS_SOUND } from "constants/db";
import React, { useEffect } from "react";
import useSound from "use-sound";

export default function Result({
  data: { correct, message, points, myPoints, totalPlayer, rank, aheadOfMe },
}: any) {
  const { dispatch }: any = usePlayerContext();

  const [sfxResults] = useSound(SFX_RESULTS_SOUND, {
    volume: 0.2,
  });

  useEffect(() => {
    dispatch({
      type: "UPDATE",
      payload: { points: myPoints },
    });

    sfxResults();
  }, [dispatch, myPoints, sfxResults]);

  return (
    <section className="relative flex flex-col items-center justify-center flex-1 w-full mx-auto anim-show max-w-7xl">
      {correct ? (
        <CricleCheck className="w-full aspect-square max-h-60" />
      ) : (
        <CricleXmark className="w-full aspect-square max-h-60" />
      )}
      <h2 className="mt-1 text-4xl font-bold text-white drop-shadow-lg">
        {message}
      </h2>
      <p className="mt-1 text-xl font-bold text-white drop-shadow-lg">
        {`Classement : ${rank}` + (aheadOfMe ? ", en retard " + aheadOfMe : "")}
      </p>
      {correct && (
        <span className="px-4 py-2 mt-2 text-2xl font-bold text-white rounded bg-black/40 drop-shadow-lg">
          +{points}
        </span>
      )}
    </section>
  );
}
