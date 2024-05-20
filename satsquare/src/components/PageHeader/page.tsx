import React from 'react';
import { FaCalculator } from 'react-icons/fa';
import EventHeader from '../Event/EventHeader';
import EventSearchBar from '../Event/EventSearchBar';
 

interface DynamicEventComponentProps {
  title: string;
  icon: React.ReactNode;
  onAdd: () => void;
  onSearch: (searchTerm: string) => void;
}

const PageHeader: React.FC<DynamicEventComponentProps> = ({ title, icon, onAdd, onSearch }) => {
  return (
    <div>
      <EventHeader title={title} icon={icon} />
      <EventSearchBar onAdd={onAdd} onSearch={onSearch} />
    </div>
  );
};

export default PageHeader;
