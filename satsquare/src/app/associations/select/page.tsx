"use client";
import { FC, useEffect, useState, useCallback } from "react";
import { Association } from "@prisma/client";
import PageHeader from "@/components/PageHeader/PageHeader";
import Sidebar from "@/components/Sidebar/page";
import Loader from "@/components/Loader";
import { FaDonate } from "react-icons/fa";
import AssociationSelectList from "@/components/Association/Select/AssociationSelectList";
import AssociationSelectSearchBar from "@/components/Association/Select/AssociationSelectSearchBar";

const AssociationsSelectPage: FC = () => {
  const [allAssociations, setAllAssociations] = useState<Association[]>([]);
  const [filteredAssociations, setFilteredAssociations] = useState<
    Association[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/associations`);
      if (!response.ok) {
        throw new Error("Failed to fetch associations");
      }
      const data: Association[] = await response.json();
      setAllAssociations(data);
      setFilteredAssociations(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(
    (query: string) => {
      if (!query) {
        setFilteredAssociations(allAssociations);
      } else {
        const filtered = allAssociations.filter((association) =>
          association.nom.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredAssociations(filtered);
      }
    },
    [allAssociations]
  );

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-row w-full">
      <Sidebar />
      <div className="bg-[#F3F3FF] w-full">
        <div className="p-4 bg-slate-50 rounded-lg shadow-md">
          <PageHeader
            title="Selection d'associations"
            icon={<FaDonate className="scale-[1.5]" color="#6D6B81" />}
          />
          <AssociationSelectSearchBar onSearch={handleSearch} />
          <AssociationSelectList associations={filteredAssociations} />
        </div>
      </div>
    </div>
  );
};

export default AssociationsSelectPage;
