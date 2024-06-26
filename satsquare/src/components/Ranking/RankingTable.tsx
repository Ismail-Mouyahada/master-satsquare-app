import { FC } from "react";
import { UserRankingDTO } from "@/types/userRankingDTO";

interface RankingTableProps {
  usersRanking: UserRankingDTO[];
}

const RoleTable: FC<RankingTableProps> = ({ usersRanking }) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg overflow-x-auto text-slate-600">
      <table className="min-w-full bg-slate-50 border">
        <thead>
          <tr className="bg-[#EDF2FF]">
            <th className="border px-4 py-2">Classement</th>
            <th className="border px-4 py-2">Pseudo</th>
            <th className="border px-4 py-2">Participation</th>
            <th className="border px-4 py-2">Nombre de victoire</th>
            <th className="border px-4 py-2">Point</th>
          </tr>
        </thead>
        <tbody>
          {usersRanking.map((userRanking) => (
            <tr key={userRanking.classement}>
              <td className="border px-4 py-2">{userRanking.classement}</td>
              <td className="border px-4 py-2">{userRanking.pseudo}</td>
              <td className="border px-4 py-2">{userRanking.participation}</td>
              <td className="border px-4 py-2">
                {userRanking.nombre_de_victoire}
              </td>
              <td className="border px-4 py-2">{userRanking.point}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleTable;
