import prisma from "@/db/connect";
import { Sponsor } from "@prisma/client";
import { FC } from "react";
import SponsorHeader from "../components/Sponsor/SponsorHeader";
import SponsorSearchBar from "../components/Sponsor/SponsorSearchBar";
import SponsorTable from "../components/Sponsor/SponsorTable";
import Sidebar from "@/components/Sidebar/page";


const getSponsors = async (): Promise<Sponsor[]> => {
  return await prisma.sponsor.findMany();
};

const SponsorsPage: FC = async () => {
  const sponsors = await getSponsors();

  return (
    <aside className="flex flex-row w-full ">
        <Sidebar/>
      <div className="  bg-[#F3F3FF]  w-full">

        <div className="p-4 bg-white rounded-lg shadow-md">

          <SponsorHeader />
          <SponsorSearchBar />
          <SponsorTable sponsors={sponsors} />
        </div>
      </div>
    </aside>

  );
};

export default SponsorsPage;