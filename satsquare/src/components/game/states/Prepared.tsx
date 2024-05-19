import clsx from "clsx"
import { ANSWERS_COLORS, ANSWERS_ICONS } from "constants/db"
 
import React, { createElement } from "react"

export default function Prepared({ data: { totalAnswers, questionNumber } }: any) {
  return (
    <section className="relative flex flex-col items-center justify-center flex-1 w-full mx-auto anim-show max-w-7xl">
      <h2 className="mb-20 text-3xl font-bold text-center text-white anim-show drop-shadow-lg md:text-4xl lg:text-5xl">
        Question #{questionNumber}
      </h2>
      <div className="grid grid-cols-2 gap-4 p-5 bg-gray-700 anim-quizz aspect-square w-60 rounded-2xl md:w-60">
        {[...Array(totalAnswers)].map((_, key) => (
          <div
            key={key}
            className={clsx(
              "button shadow-inset flex aspect-square h-full w-full items-center justify-center rounded-2xl",
              ANSWERS_COLORS[key],
            )}
          >
            {createElement(ANSWERS_ICONS[key], { className: "h-10 md:h-14" })}
          </div>
        ))}
      </div>
    </section>
  )
}
