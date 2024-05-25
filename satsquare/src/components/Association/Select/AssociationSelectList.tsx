"use client";
import { FC } from "react";
import { Association } from "@prisma/client";

interface AssociationSelectListProps {
  associations: Association[];
}

const AssociationSelectList: FC<AssociationSelectListProps> = ({
  associations,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {associations.map((association) => (
        <div key={association.id} className="bg-white p-4 rounded-lg shadow-md">
          <img
            src={association.logo_url}
            alt={association.nom}
            className="w-full h-32 object-cover rounded-lg"
          />
          <h3 className="mt-2 text-lg font-bold">{association.nom}</h3>
          <p className="text-gray-500">{association.adresse_eclairage}</p>
          <p
            className={`mt-2 ${association.est_confirme ? "text-green-500" : "text-red-500"}`}
          >
            {association.est_confirme ? "Confirmé" : "Non confirmé"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AssociationSelectList;
