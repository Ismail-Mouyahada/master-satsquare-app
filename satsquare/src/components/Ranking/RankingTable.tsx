import { FC, useRef } from "react";
import html2canvas from "html2canvas";
import { Score, UserRankingDTO } from "@/types/userRankingDTO";
import { FaCamera } from "react-icons/fa";

interface RankingTableProps {
  usersRanking: Score[];
}

const RoleTable: FC<RankingTableProps> = ({ usersRanking }) => {
  const tableRef = useRef<HTMLDivElement>(null);

  // Sort by date first, then by points
  const sortedRanking = [...usersRanking].sort((a, b) => {
    const dateA = a.dateModification ? new Date(a.dateModification).getTime() : 0;
    const dateB = b.dateModification ? new Date(b.dateModification).getTime() : 0;

    if (dateA !== dateB) {
      return dateB - dateA; // Sort by date (most recent first)
    }

    return b.points - a.points; // Sort by points (highest first)
  });

  const getRankingEmoji = (index: number) => {
    const style = { fontSize: "1.5rem", marginRight: "0.5rem" };
    switch (index) {
      case 0:
        return <span style={style}>🥇</span>;
      case 1:
        return <span style={style}>🥈</span>;
      case 2:
        return <span style={style}>🥉</span>;
      default:
        return "";
    }
  };

  const handleTakeScreenshot = () => {
    if (tableRef.current) {
      html2canvas(tableRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.download = "ranking_table.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      });
    }
  };

  return (
    <div className=" min-h-1/3 bg-[#F3F3FF] p-4 rounded-lg overflow-x-auto text-slate-600">
      <button
        onClick={handleTakeScreenshot}
        className="mb-4 bg-blue-500 text-white p-2 rounded-md float-right"
      >
        <FaCamera className="inline-block mr-2" /> Prendre une capture d'écran
      </button>
      <div
        className="bg-[#F3F3FF] p-4 rounded-lg overflow-x-auto text-slate-600 min-w-full"
        ref={tableRef}
      >
        <table className="min-w-full bg-slate-50 border">
          <thead>
            <tr className="bg-[#EDF2FF]">
              <th className="border px-4 py-2">Classement</th>
              <th className="border px-4 py-2">Pseudo</th>
              <th className="border px-4 py-2">nom de Salle</th>
              <th className="border px-4 py-2">date de quiz</th>
              <th className="border px-4 py-2">Point</th>
            </tr>
          </thead>
          <tbody>
            {sortedRanking.map((userRanking, index) => (
              <tr key={userRanking.id}>
                <td className="border px-4 py-2">
                  {getRankingEmoji(index)} {index + 1}
                </td>
                <td className="border px-4 py-2">{userRanking.username}</td>
                <td className="border px-4 py-2">{userRanking.room}</td>
                <td className="border px-4 py-2">
                  {userRanking.dateModification
                    ? new Date(userRanking.dateModification).toLocaleDateString()
                    : ""}
                </td>
                <td className="border px-4 py-2 text-right font-bold">
                  {userRanking.points} pts
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoleTable;
