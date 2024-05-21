import { FC, useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";

interface AssociationSearchBarProps {
  onAdd: () => void;
  onSearch: (name: string) => void;
}

const AssociationSearchBar: FC<AssociationSearchBarProps> = ({
  onAdd,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex justify-between mb-4 space-x-2">
      <button
        className="bg-[#EEEEEF] w-1/6 shadow-md text-[#6D6B81] font-bold py-2 pr-4 rounded-md flex flex-row items-center justify-center"
        onClick={onAdd}
      >
        <span className="p-1.5 mx-2 rounded-full bg-slate-400">
          <FaPlus className="text-white" />
        </span>
        <span className="text-[#737ABA] font-bold mx-3">
          {" "}
          Ajouter une nouvelle
        </span>
      </button>
      <div className="bg-[#EEEEEF] w-1/2 flex p-1.3 pl-2 rounded-md shadow-md">
        <input
          type="text"
          placeholder="Chercher une association ..."
          className="border-none p-2 rounded-md w-full bg-[#EEEEEF]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button
          className="bg-[#F8D99B] w-auto p-3.5 rounded-md"
          onClick={handleSearchClick}
        >
          <FaSearch className="text-[#6D6B81] scale-125" />
        </button>
      </div>
    </div>
  );
};

export default AssociationSearchBar;