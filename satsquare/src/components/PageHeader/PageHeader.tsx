import { FC, ReactNode } from "react";

interface EventHeaderProps {
  title: string;
  icon: ReactNode;
}

const PageHeader: FC<EventHeaderProps> = ({ title, icon }) => {
  return (
    <div className="flex items-center justify-between my-3">
      <div className="flex items-center space-x-2 ">
        <div className="bg-[#F8D99B] px-8 py-3 p-2 rounded-md flex items-center">
          <span className="pr-2" role="img" aria-label="icon">
            {icon}
          </span>
          <span className="ml-2 font-bold text-[#6D6B81]">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
