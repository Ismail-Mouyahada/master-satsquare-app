"use client";
import { FC, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaChartBar, FaShieldAlt } from "react-icons/fa";
import PageHeader from "@/components/PageHeader/PageHeader";
import { UserRankingDTO } from "@/types/userRankingDTO";
import RankingSearchBar from "@/components/Ranking/RankingSearchBar";
import RankingTable from "@/components/Ranking/RankingTable";

const RankingPage: FC = () => {
  const [usersRanking, setUsersRanking] = useState<UserRankingDTO[]>([]);
  const [initialUsersRanking, setInitialUsersRanking] = useState<
    UserRankingDTO[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRanking();
  }, []);

  const fetchRanking = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/ranking`);
      if (!response.ok) {
        throw new Error("Failed to fetch ranking");
      }
      const data: UserRankingDTO[] = await response.json();
      setUsersRanking(data);
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
        user.pseudo.toLowerCase().includes(name.toLowerCase())
      );
      setUsersRanking(filteredUsers);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 bg-white rounded-lg shadow-md">
          <PageHeader
            title="Classement"
            icon={<FaChartBar className="scale-[1.5]" color="#6D6B81" />}
          />
          <RankingSearchBar onSearch={handleSearch} />
          <RankingTable usersRanking={usersRanking} />
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
