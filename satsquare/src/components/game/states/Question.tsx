import { SFX_SHOW_SOUND } from "@/constants/db";
import React, { useEffect } from "react";
import useSound from "use-sound";
import Image from "next/image";

export default function Question({ data: { question, image, cooldown } }: any) {
  const [sfxShow] = useSound(SFX_SHOW_SOUND, { volume: 0.5 });

  useEffect(() => {
    sfxShow();
  }, [sfxShow]);

  return (
    <section className="relative flex flex-col items-center flex-1 w-full h-full px-4 mx-auto max-w-7xl">
      <div className="flex flex-col items-center justify-center flex-1 gap-5">
        <h2 className="text-3xl font-bold text-center text-white anim-show drop-shadow-lg md:text-4xl lg:text-5xl">
          {question}
        </h2>

        {!!image && (
          <Image 
            src={image} 
            alt="Question related visual" 
            className="w-auto h-48 rounded-md max-h-60"
            width={400}
            height={400}
            layout="responsive"
          />
        )}
      </div>
      <div
        className="self-start h-4 mb-20 rounded-full justify-self-end bg-primary"
        style={{ animation: `progressBar ${cooldown}s linear forwards` }}
      ></div>
    </section>
  );
}
