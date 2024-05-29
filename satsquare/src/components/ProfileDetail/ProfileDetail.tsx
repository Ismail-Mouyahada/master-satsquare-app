import React, { useEffect, useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { UserDTO } from "@/types/userDTO";
import {
  FaCreativeCommonsSamplingPlus,
  FaDonate,
  FaHeartbeat,
  FaMailBulk,
  FaPassport,
  FaRecycle,
  FaShieldVirus,
  FaTrashAlt,
  FaUserCheck,
  FaUserShield,
} from "react-icons/fa";

const ProfileDetail: React.FC = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserDTO | null>(null);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(`/api/users?email=${session.user.email}`);
          const data: UserDTO = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [session]);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      setError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("/api/users/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
          oldPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la réinitialisation du mot de passe."
        );
      }

      setSuccess("Mot de passe réinitialisé avec succès.");
      setError(null);
    } catch (error: any) {
      setError(error.message);
      setSuccess(null);
    }
  };

  const sectionStyle = "bg-white text-black rounded-lg flex items-center h-16 m-6 ";
  const buttonStyle = "p-4 px-8 bg-[#F4BD8A] text-[#726e81] rounded-md flex items-center";
  const inputContainerStyle = " grid grid-cols-2 mb-4";
  const inputStyle = "w-full px-8 py-3  text-center border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]";

  if (!userData) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-8 bg-white l">
      <div className="w-full h-fit flex-1 bg-[#EBEBF8] rounded-lg  shadow-md p-10  ">

        <div className="grid flex-1 h-full grid-cols-1 gap-4 md:grid-cols-2">

          <div className="p-4">
            <h2 className="text-2xl font-semibold text-[#727EA7] my-8">
              Détails de compte
            </h2>
            {[
              {
                label: "Pseudo",
                value: userData.pseudo,
                icon: <FaPassport className="scale-[150%] mx-2 text-[#514F69]" />,
              },
              {
                label: "Email",
                value: userData.email,
                icon: <FaMailBulk className="scale-[150%] mx-2 text-[#514F69]" />,
              },
              {
                label: "Role",
                value: userData.role || "N/A",
                icon: <FaUserShield className="scale-[150%] mx-2 text-[#514F69]" />,
              },
            ].map((item, index) => (
              <div key={index} className={sectionStyle}>
                <span className="ml-2">{item.icon}</span>
                <span className="ml-2">{item.label}</span>
                <span className="ml-4">{item.value}</span>
              </div>
            ))}
            <button className={buttonStyle}>
              <FaCreativeCommonsSamplingPlus className="text-[#514F69] scale-[160%] mx-2 " />
              <span className="font-bold">Associer portefeuille Lightning</span>
            </button>
          </div>

          <div className="px-10 py-8 bg-white rounded-lg">
            <h2 className="text-2xl  font-semibold text-[#727EA7] pb-8">
              Réinitialiser le mot de passe
            </h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            {[
              {
                label: "Ancien mot de passe",
                value: oldPassword,
                onChange: setOldPassword,
              },
              {
                label: "Nouveau mot de passe",
                value: newPassword,
                onChange: setNewPassword,
              },
              {
                label: "Confirmer le mot de passe",
                value: confirmPassword,
                onChange: setConfirmPassword,
              },
            ].map((item, index) => (
              <div key={index} className={inputContainerStyle}>
                <div className="flex flex-row items-center w-full">
                  <FaUserShield className="scale-[150%] mx-2 text-[#514F69]" />
                  <label className="flex-1 mb-1 text-gray-600">{item.label}</label>
                </div>
                <input
                  type="password"
                  placeholder="****************************************"
                  className={inputStyle}
                  value={item.value}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    item.onChange(e.target.value)
                  }
                />
              </div>
            ))}
            <button className={buttonStyle} onClick={handlePasswordReset}>
              <FaRecycle className="scale-[150%] mx-2 text-[#514F69]" />
              <span>Réinitialiser</span>
            </button>
          </div>

        </div>
        <div className="flex justify-between pt-40 my-6">
          <div className="flex">
            <button className={buttonStyle}>
              <FaDonate className="scale-[150%] mx-2 text-[#514F69]" />
              <span className="font-bold">Activer le mode sponsor</span>
            </button>
            <button className={`ml-2 ${buttonStyle}`}>
              <FaHeartbeat className="scale-[150%] mx-2 text-[#514F69]" />
              <span className="font-bold">Activer le mode caritatif</span>
            </button>
          </div>
          <button className="flex items-center px-4 py-4 ml-2 text-white bg-red-500 rounded px- hover:bg-red-600">
            <FaShieldVirus className="scale-[150%] mx-2 text-[#f5f5f7]  " />
            <span>Supprimer le compte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
