import { FC, useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

interface RewardSearchBarProps {
  onSearch: (name: string) => void;
}

const RewardSearchBar: FC<RewardSearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce search input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 300); // Adjust the delay (ms) as needed

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex justify-between mb-4 space-x-2">
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

export default RewardSearchBar;
