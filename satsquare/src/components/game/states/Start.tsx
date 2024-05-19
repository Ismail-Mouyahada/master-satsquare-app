 
import { SFX_BOUMP_SOUND } from "@/constants/db"
import { useSocketContext } from "@/context/socket"
import clsx from "clsx"
import React from "react"
import { useEffect, useState } from "react"
import useSound from "use-sound"
 

export default function Start({ data: { time, subject } }: any) {
  const { socket } = useSocketContext()
  const [showTitle, setShowTitle] = useState(true)
  const [cooldown, setCooldown] = useState(time)

  const [sfxBoump] = useSound(SFX_BOUMP_SOUND, {
    volume: 0.2,
  })

  useEffect(() => {
    socket.on("game:startCooldown", () => {
      sfxBoump()
      setShowTitle(false)
    })

    socket.on("game:cooldown", (sec: any) => {
      sfxBoump()
      setCooldown(sec)
    })

    return () => {
      socket.off("game:startCooldown")
      socket.off("game:cooldown")
    }
  }, [sfxBoump, socket])

  return (
    <section className="relative flex flex-col items-center justify-center flex-1 w-full mx-auto max-w-7xl">
      {showTitle ? (
        <h2 className="text-3xl font-bold text-center text-white anim-show drop-shadow-lg md:text-4xl lg:text-5xl">
          {subject}
        </h2>
      ) : (
        <>
          <div
            className={clsx(
              `anim-show aspect-square h-32 bg-primary transition-all md:h-60`,
            )}
            style={{
              transform: `rotate(${45 * (time - cooldown)}deg)`,
            }}
          ></div>
          <span className="absolute text-6xl font-bold text-white drop-shadow-md md:text-8xl">
            {cooldown}
          </span>
        </>
      )}
    </section>
  )
}
