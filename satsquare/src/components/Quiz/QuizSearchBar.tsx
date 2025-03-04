import { FC, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

interface QuizSearchBarProps {
  onSearch: (name: string) => void;
}

const QuizSearchBar: FC<QuizSearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Trigger search as the user types
  };

  return (
    <div className="flex justify-between mb-4 space-x-2">
      <a
        href="/quizzes/create"
        className="bg-[#EEEEEF] w-2/6 shadow-md text-[#6D6B81] font-bold py-2 pr-4 rounded-md flex flex-row items-center justify-center"
      >
        <span className="p-1.5 mx-2 rounded-full bg-slate-400">
          <FaPlus className="text-white" />
        </span>
        <span className="text-[#737ABA] font-bold mx-3">
          Ajouter un nouveau
        </span>
      </a>
      <div className="bg-[#EEEEEF] w-1/2 flex p-1.3 pl-2 rounded-md shadow-md">
        <input
          type="text"
          placeholder="Chercher un quiz ..."
          className="border-none p-2 rounded-md w-full bg-[#EEEEEF]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default QuizSearchBar;
