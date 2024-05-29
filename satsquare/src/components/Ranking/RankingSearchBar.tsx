import { FC, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

interface RankingSearchBarProps {
  onSearch: (name: string) => void;
}

const RankingSearchBar: FC<RankingSearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex justify-between mb-4 space-x-2">
      <div className="bg-[#EEEEEF] w-1/2 flex  p-1.3  pl-2 rounded-md shadow-md ">
        <input
          type="text"
          placeholder="Chercher un utilisateur ..."
          className="border-none p-2 rounded-md  w-full bg-[#EEEEEF]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="bg-action w-auto  p-3.5 rounded-md"
          onClick={handleSearchClick}
        >
          <FaSearch className="text-[#6D6B81] scale-125" />
        </button>
      </div>
    </div>
  );
};

export default RankingSearchBar;
