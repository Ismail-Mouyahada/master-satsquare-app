import { FC } from 'react';

const EventHeader: FC = () => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center space-x-2">
        <div className="bg-[#F8D99B] p-2 rounded-md flex items-center">
          <span role="img" aria-label="icon">👥</span>
          <span className="ml-2">Evenements</span>
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
