"use client";
import { FC, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaDonate } from "react-icons/fa";
import PageHeader from "@/components/PageHeader/PageHeader";
import { RewardDTO } from "@/types/rewardDTO";
import RewardSearchBar from "@/components/Reward/RewardSearchBar";
import RewardTable from "@/components/Reward/RewardTable";

const RewardsPage: FC = () => {
  const [rewards, setRewards] = useState<RewardDTO[]>([]);
  const [initialRewards, setInitialRewards] = useState<RewardDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/rewards`);
      if (!response.ok) {
        throw new Error("Failed to fetch rewards");
      }
      const data: RewardDTO[] = await response.json();
      setRewards(data);
      setInitialRewards(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (name: string) => {
    if (name === "") {
      setRewards(initialRewards);
    } else {
      const filteredRewards = initialRewards.filter((reward) =>
        reward.sponsor.toLowerCase().includes(name.toLowerCase())
      );
      setRewards(filteredRewards);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 bg-slate-50 rounded-lg shadow-md">
          <PageHeader
            title="Récompenses"
            icon={<FaDonate className="scale-[1.5]" color="#6D6B81" />}
          />
          <RewardSearchBar onSearch={handleSearch} />
          <RewardTable rewards={rewards} />
        </div>
      </div>
    </div>
  );
};

export default RewardsPage;
