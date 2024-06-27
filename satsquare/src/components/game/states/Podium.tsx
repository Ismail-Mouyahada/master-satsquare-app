import React, { useEffect, useState, useCallback, useMemo } from "react";
import clsx from "clsx";
import ReactConfetti from "react-confetti";
import useSound from "use-sound";
import useScreenSize from "@/hook/useScreenSize";
import {
  SFX_PODIUM_THREE,
  SFX_PODIUM_SECOND,
  SFX_SNEAR_ROOL,
  SFX_PODIUM_FIRST,
} from "@/constants/db";
import prisma from "@/db/prisma";

export default function Podium({ data }: any) {
  const [apparition, setApparition] = useState(0);
  const { width, height } = useScreenSize();

  const [sfxtThree] = useSound(SFX_PODIUM_THREE, { volume: 0.2 });
  const [sfxSecond] = useSound(SFX_PODIUM_SECOND, { volume: 0.2 });
  const [sfxRool, { stop: sfxRoolStop }] = useSound(SFX_SNEAR_ROOL, { volume: 0.2 });
  const [sfxFirst] = useSound(SFX_PODIUM_FIRST, { volume: 0.2 });

  useEffect(() => {
    switch (apparition) {
      case 4:
        sfxRoolStop();
        sfxFirst();
        break;
      case 3:
        sfxRool();
        break;
      case 2:
        sfxSecond();
        break;
      case 1:
        sfxtThree();
        break;
      default:
        break;
    }
  }, [apparition, sfxFirst, sfxSecond, sfxtThree, sfxRool, sfxRoolStop]);

  useEffect(() => {
    const top = data?.top || [];
    if (top.length < 3) {
      setApparition(4);
      return;
    }

    const interval = setInterval(() => {
      if (apparition > 4) {
        clearInterval(interval);
        return;
      }
      setApparition((value) => value + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [apparition, data?.top]);

  const subject = data?.subject || "Pas de sujet";
  const top = useMemo(() => data?.top || [], [data?.top]);

  const saveResults = useCallback(async () => {
    try {
      for (let i = 0; i < 3; i++) {
        const user = top[i];
        if (!user) continue;

        await prisma.evenementsQuiz.create({
          data: {
            evenement: { connect: { id: 1 } },
            quiz: { connect: { id: 1 } },
            question_id: 1,
            utilisateur: { connect: { id: user.id } },
            reponse_id: 1, // Adjust this as necessary
            score: user.points ?? 111,
          },
        });
      }
      console.log("Résultats sauvegardés avec succès");
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des résultats :", error);
    }
  }, [top]);

  useEffect(() => {
    if (apparition >= 4) {
      saveResults();
    }
  }, [apparition, saveResults]);

  return (
    <>
      {apparition >= 4 && (
        <ReactConfetti width={width} height={height} className="w-full h-full" />
      )}

      {apparition >= 3 && top.length >= 3 && (
        <div className="absolute w-full min-h-screen overflow-hidden">
          <div className="spotlight"></div>
        </div>
      )}
      <section className="relative flex flex-col items-center justify-between flex-1 w-full mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold text-center text-white anim-show drop-shadow-lg md:text-4xl lg:text-5xl">
          {subject}
        </h2>

        <div className={`grid w-full max-w-[800px] flex-1 grid-cols-3 items-end justify-center justify-self-end overflow-y-hidden overflow-x-visible`}>
          <div
            className={clsx(
              "z-20 flex h-[50%] w-full translate-y-full flex-col items-center justify-center gap-3 opacity-0 transition-all",
              { "!translate-y-0 opacity-100": apparition >= 2 },
            )}
          >
            <p
              className={clsx(
                "overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl",
                { "anim-balanced": apparition >= 4 },
              )}
            >
              {top[1]?.username || "Pas de nom"}
            </p>
            <div className="flex flex-col items-center w-full h-full gap-4 pt-6 text-center shadow-2xl rounded-t-md bg-primary">
              <p className="flex items-center justify-center text-3xl font-bold text-white border-4 rounded-full aspect-square h-14 border-zinc-400 bg-zinc-500 drop-shadow-lg">
                <span className="drop-shadow-md">2</span>
              </p>
              <p className="text-2xl font-bold text-white drop-shadow-lg">
                {top[1]?.points ?? 0}
              </p>
            </div>
          </div>

          <div
            className={clsx(
              "z-30 flex h-[60%] w-full translate-y-full flex-col items-center gap-3 opacity-0 transition-all",
              { "!translate-y-0 opacity-100": apparition >= 3 },
            )}
          >
            <p
              className={clsx(
                "overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white opacity-0 drop-shadow-lg md:text-4xl",
                { "anim-balanced opacity-100": apparition >= 4 },
              )}
            >
              {top[0]?.username || "Pas de nom"}
            </p>
            <div className="flex flex-col items-center w-full h-full gap-4 pt-6 text-center shadow-2xl rounded-t-md bg-primary">
              <p className="flex items-center justify-center text-3xl font-bold text-white border-4 rounded-full aspect-square h-14 border-amber-400 bg-amber-300 drop-shadow-lg">
                <span className="drop-shadow-md">1</span>
              </p>
              <p className="text-2xl font-bold text-white drop-shadow-lg">
                {top[0]?.points ?? 0} 
              </p>
            </div> 
          </div>

          <div
            className={clsx(
              "z-10 flex h-[40%] w-full translate-y-full flex-col items-center gap-3 opacity-0 transition-all",
              { "!translate-y-0 opacity-100": apparition >= 1 },
            )}
          >
            <p
              className={clsx(
                "overflow-visible whitespace-nowrap text-center text-2xl font-bold text-white drop-shadow-lg md:text-4xl",
                { "anim-balanced": apparition >= 4 },
              )}
            >
              {top[2]?.username || "Personne"}
            </p>
            <div className="flex flex-col items-center w-full h-full gap-4 pt-6 text-center shadow-2xl rounded-t-md bg-primary">
              <p className="flex items-center justify-center text-3xl font-bold text-white border-4 rounded-full aspect-square h-14 border-amber-800 bg-amber-700 drop-shadow-lg">
                <span className="drop-shadow-md">3</span>
              </p>
              <p className="text-2xl font-bold text-white drop-shadow-lg">
                {top[2]?.points ?? 0}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
