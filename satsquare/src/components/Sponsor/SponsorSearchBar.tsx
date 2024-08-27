import { FC, useState } from "react";
import { FaPlus } from "react-icons/fa";

interface SponsorSearchBarProps {
  onAdd: () => void;
  onSearch: (name: string) => void;
}

const SponsorSearchBar: FC<SponsorSearchBarProps> = ({ onAdd, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    onSearch(searchTerm); // Trigger search on input change
  };

  return (
    <div className="flex justify-between mb-4 space-x-2">
      <button
        className="bg-[#EEEEEF] w-2/6 shadow-md text-[#6D6B81] font-bold py-2 pr-4 rounded-md flex flex-row items-center justify-center"
        onClick={onAdd}
      >
        <span className="p-1.5 mx-2 rounded-full bg-slate-400">
          <FaPlus className="text-white" />
        </span>
        <span className="text-[#737ABA] font-bold mx-3">
          Ajouter un nouveau
        </span>
      </button>
      <div className="bg-[#EEEEEF] w-1/2 flex p-1.3 pl-2 rounded-md shadow-md">
        <input
          type="text"
          placeholder="Chercher un sponsor ..."
          className="border-none p-2 rounded-md w-full bg-[#EEEEEF]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default SponsorSearchBar;
