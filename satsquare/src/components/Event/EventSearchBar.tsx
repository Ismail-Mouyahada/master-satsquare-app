import { FC, useState } from 'react';

interface EventSearchBarProps {
  onAdd: () => void;
  onSearch: (name: string) => void;
}

const EventSearchBar: FC<EventSearchBarProps> = ({ onAdd, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchTerm);
  };

  return (
    <div className="flex items-center space-x-2 mb-4">
      <button className="bg-[#F8D99B] text-white py-2 px-4 rounded-md" onClick={onAdd}>Ajouter un nouveau</button>
      <input 
        type="text" 
        placeholder="Chercher un événement ..." 
        className="border p-2 rounded-md flex-grow bg-[#EEEEEF]" 
        value={searchTerm} 
        onChange={handleSearchChange} 
      />
      <button className="bg-[#F8D99B] p-2 rounded-md" onClick={handleSearchClick}>🔍</button>
    </div>
  );
};

export default EventSearchBar;
