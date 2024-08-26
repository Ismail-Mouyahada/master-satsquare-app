"use client";
import { FC } from "react";
import Image from "next/image";
import { Association } from "@/types/main-types/main";

export interface AssociationSelectListProps {
  associations: Association[];
}

const AssociationSelectList: FC<AssociationSelectListProps> = ({
  associations,
}) => {
  return (
    <div>
      <h3 className="mb-5 text-lg font-medium text-gray-900 dark:text-white">
        Choisir une association:
      </h3>
      <ul className="grid w-full gap-6 md:grid-cols-3">
        {associations.map((association) => (
          <li key={association.id}>
            <input
              type="checkbox"
              id={`association-${association.id}`}
              value={association.id}
              className="hidden peer"
            />
            <label
              htmlFor={`association-${association.id}`}
              className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-slate-50 border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <div className="block w-full">
                {/* <Image
                  src={association.log}
                  alt={association.nom}
                  className="mb-2 w-full h-32 object-cover rounded-lg"
                /> */}
                <div className="w-full text-lg font-semibold">
                  {association.nom}
                </div>
                <div className="w-full text-sm">
                  {association.adresseEclairage}
                </div>
                <p
                  className={`mt-2 ${association.estConfirme ? "text-green-500" : "text-red-500"}`}
                >
                  {association.estConfirme ? "Confirmé" : "Non confirmé"}
                </p>
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssociationSelectList;
