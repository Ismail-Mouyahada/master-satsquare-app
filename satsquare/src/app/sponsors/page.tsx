import { FC } from 'react';
import prisma from '@/utils/db';
import { Sponsor } from '@prisma/client';
import SponsorTable from '../components/Sponsor/SponsorTable';
import SponsorSearchBar from '../components/Sponsor/SponsorSearchBar';
import SponsorHeader from '../components/Sponsor/SponsorHeader';

const getSponsors = async (): Promise<Sponsor[]> => {
  return await prisma.sponsor.findMany();
};

const SponsorsPage: FC = async () => {
  const sponsors = await getSponsors();

  return (
    <div className="h-screen bg-[#F3F3FF] p-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <SponsorHeader />
        <SponsorSearchBar />
        <SponsorTable sponsors={sponsors} />
      </div>
    </div>
  );
};

export default SponsorsPage;
