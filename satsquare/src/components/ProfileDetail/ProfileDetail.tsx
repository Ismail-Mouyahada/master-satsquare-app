import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { UserDTO } from "@/types/userDto";

const ProfileDetail = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserDTO | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/users?email=${session.user.email}`
          );
          const data: UserDTO = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const sectionStyle =
    "bg-white text-black rounded-lg flex items-center h-16 mb-4";
  const buttonStyle =
    "py-2 px-4 bg-[#f4bd8a] text-[#726e81] rounded flex items-center";
  const inputContainerStyle = "mb-4 flex items-center";
  const inputStyle = "flex-1 p-2 bg-[#ebebeb] rounded border-transparent";

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4">
      <div className="w-full h-full flex-1 bg-[#ebebf8] rounded-lg shadow-lg p-6">
        <div className="flex-1 h-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl font-medium text-[#727ea7] mb-2">
              Détails de compte
            </h2>
            {[
              { label: "Pseudo", value: userData.pseudo },
              { label: "Email", value: userData.email },
              { label: "Role", value: userData.role || "N/A" },
            ].map((item, index) => (
              <div key={index} className={sectionStyle}>
                <span className="ml-2">icon</span>
                <span className="ml-2">{item.label}</span>
                <span className="ml-4">{item.value}</span>
              </div>
            ))}
            <button className={buttonStyle}>
              <span>icon</span>
              <span className="ml-2">Associer portefeuille Lightning</span>
            </button>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-medium text-[#727ea7] mb-2">
              Réinitialiser le mot de passe
            </h2>
            {[
              "Ancien mot de passe",
              "Nouveau mot de passe",
              "Confirmer le mot de passe",
            ].map((label, index) => (
              <div key={index} className={inputContainerStyle}>
                <label className="flex-1 text-gray-600 mb-1">{label}</label>
                <input type="password" className={inputStyle} />
              </div>
            ))}
            <button className={buttonStyle}>
              <span>icon</span>
              <span className="ml-2">Réinitialiser</span>
            </button>
          </div>
        </div>
        <div className="flex mt-6 justify-between">
          <div className="flex">
            <button className={buttonStyle}>
              <span>icon</span>
              <span className="ml-2">Activer le mode sponsor</span>
            </button>
            <button className={`ml-2 ${buttonStyle}`}>
              <span>icon</span>
              <span className="ml-2">Activer le mode caritatif</span>
            </button>
          </div>
          <button className="ml-2 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 flex items-center">
            <span>icon</span>
            <span className="ml-2">Supprimer le compte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
