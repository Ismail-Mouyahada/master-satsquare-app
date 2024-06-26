import { RewardDTO } from "@/types/rewardDTO";
import { FC } from "react";

interface RewardTableProps {
  rewards: RewardDTO[];
}

const RewardTable: FC<RewardTableProps> = ({ rewards }) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg overflow-x-auto text-slate-600">
      <table className="min-w-full bg-slate-50 border">
        <thead>
          <tr className="bg-[#EDF2FF]">
            <th className="border px-4 py-2">Sponsor</th>
            <th className="border px-4 py-2">Montant</th>
            <th className="border px-4 py-2">Portefeuille</th>
          </tr>
        </thead>
        <tbody>
          {rewards.map((reward, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{reward.sponsor}</td>
              <td className="border px-4 py-2">{reward.montant} sat</td>
              <td className="border px-4 py-2">{reward.portefeuille}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RewardTable;
