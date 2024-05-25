"use client";
import { FC, useState, useEffect } from "react";

interface AssociationSelectSearchBarProps {
  onSearch: (query: string) => void;
}

const AssociationSelectSearchBar: FC<AssociationSelectSearchBarProps> = ({
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="flex justify-between mb-4 space-x-2">
      <div className="bg-[#EEEEEF] w-1/2 flex p-1.3 pl-2 rounded-md shadow-md">
        <input
          type="text"
          placeholder="Chercher une association ..."
          className="border-none p-2 rounded-md w-full bg-[#EEEEEF]"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
    </div>
  );
};

export default AssociationSelectSearchBar;
