import { Evenement } from "@/types/main-types/main";
import { FC } from "react";

interface EventTableProps {
  events: Evenement[];
  onEdit: (event: Evenement) => void;
  onDelete: (event: Evenement) => void;
}

const EventTable: FC<EventTableProps> = ({ events, onEdit, onDelete }) => {
  return (
    <div className="bg-[#F3F3FF] p-4 rounded-lg overflow-x-auto text-slate-600">
      <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
        <table className="min-w-full bg-slate-50 border">
          <thead>
            <tr className="bg-[#EDF2FF]">
              <th scope="col" className="border px-4 py-2">
                Nom
              </th>
              <th scope="col" className="border px-4 py-2">
                Description
              </th>
              <th scope="col" className="border px-4 py-2">
                Commence à
              </th>
              <th scope="col" className="border px-4 py-2">
                Termine à
              </th>
              <th className="border px-4 py-2">Statut</th>
              <th scope="col" className="border px-4 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                <td className="border px-4 py-2">{event.nom}</td>
                <td className="border px-4 py-2">{event.description}</td>
                <td className="border px-4 py-2">
                  {new Date(event.commenceA).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(event.termineA).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {event.estPublic ? (
                    <span className="text-green-500">✔️</span>
                  ) : (
                    <span className="text-red-500">❌</span>
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    className="bg-action p-2 rounded-md"
                    onClick={() => onEdit(event)}
                  >
                    ✏️
                  </button>
                  <button
                    className="bg-red-400 p-2 rounded-md"
                    onClick={() => onDelete(event)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;
