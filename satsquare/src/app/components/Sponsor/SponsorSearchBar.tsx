import { FC } from 'react';

const SearchBar: FC = () => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <button className="bg-[#F8D99B] text-white py-2 px-4 rounded-md">Ajouter un nouveau</button>
      <input type="text" placeholder="Chercher un élément ..." className="border p-2 rounded-md flex-grow bg-[#EEEEEF]" />
      <button className="bg-[#F8D99B] p-2 rounded-md">🔍</button>
      <button className="bg-[#F8D99B] p-2 rounded-md">Filtres</button>
    </div>
  );
};

export default SearchBar;
