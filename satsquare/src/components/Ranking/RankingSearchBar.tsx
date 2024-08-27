import { FC, useState } from "react";

interface RankingSearchBarProps {
  onSearch: (name: string) => void;
}

const RankingSearchBar: FC<RankingSearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    onSearch(searchTerm); // Trigger search on input change
  };

  return (
    <div className="flex justify-between mb-4 space-x-2">
      <div className="bg-[#EEEEEF] w-1/2 flex p-1.3 pl-2 rounded-md shadow-md">
        <input
          type="text"
          placeholder="Chercher un utilisateur ..."
          className="border-none p-2 rounded-md w-full bg-[#EEEEEF]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default RankingSearchBar;
