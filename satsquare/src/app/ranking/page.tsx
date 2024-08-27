"use client";
import { FC, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaChartBar } from "react-icons/fa";
import PageHeader from "@/components/PageHeader/PageHeader";
import { Score } from "@/types/userRankingDTO";
import RankingSearchBar from "@/components/Ranking/RankingSearchBar";
import RankingTable from "@/components/Ranking/RankingTable";

const RankingPage: FC = () => {
  const [usersRanking, setUsersRanking] = useState<Score[]>([]);
  const [initialUsersRanking, setInitialUsersRanking] = useState<Score[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/scores`);
      if (!response.ok) {
        throw new Error("Failed to fetch ranking");
      }
      const data: Score[] = await response.json();
      const scores: Score[] = data.map(({ id, points, ...rest }) => ({
        ...rest,
        id,
        points,
      }));
      setUsersRanking(scores);
      setInitialUsersRanking(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (name: string) => {
    if (name === "") {
      setUsersRanking(initialUsersRanking);
    } else {
      const filteredUsers = initialUsersRanking.filter((user) =>
        user?.username?.toLowerCase().includes(name.toLowerCase())
      );
      setUsersRanking(filteredUsers);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full min-h-screen">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 ml-[4em] bg-slate-50 rounded-lg shadow-md">
          <PageHeader
            title="Classement"
            icon={<FaChartBar className="scale-[1.5]" color="#6D6B81" />}
          />
          <RankingSearchBar onSearch={handleSearch} />
          <RankingTable
            usersRanking={usersRanking.sort((a, b) => b.points - a.points)}
          />
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
