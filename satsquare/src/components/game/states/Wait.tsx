import Loader from "@/components/Loader";
import React from "react";
 

interface Props {
  data: {
    text: string;
  };
}

const Wait: React.FC<Props> = ({ data: { text } }) => {
  return (
    <section className="relative flex flex-col items-center justify-center flex-1 w-full mx-auto max-w-7xl">
      <Loader />
      <h2 className="mt-5 text-3xl font-bold text-center text-white drop-shadow-lg md:text-4xl lg:text-5xl">
        {text}
      </h2>
    </section>
  );
};

export default Wait;
