
import LogoHeader from "@/components/LogoHeader/LogoHeader"
import React, { createElement } from "react"

export default function Prepared({ data: { totalAnswers, questionNumber } }: any) {
  return (
    <section className="relative flex flex-col items-center justify-center flex-1 w-full mx-auto anim-show max-w-7xl">
      <h2 className="mb-20 text-3xl font-bold text-center text-white anim-show drop-shadow-lg md:text-4xl lg:text-5xl">
        Question #{questionNumber}
      </h2>
      <div style={{ backgroundImage: "url('/imgs/background.webp')", backgroundSize: "cover" }} className="grid grid-cols-1 gap-4 p-5 bg-gray-700 anim-quizz aspect-square w-60 rounded-2xl md:w-60 justify-center items-center ">
        {/* <LogoHeader /> */}
      </div>
    </section>
  )
}
