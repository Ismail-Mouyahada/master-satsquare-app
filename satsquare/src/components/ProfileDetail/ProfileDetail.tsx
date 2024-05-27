import React, { useEffect, useState, ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { UserDTO } from "@/types/userDTO";
import {
  FaDonate,
  FaHeartbeat,
  FaMailBulk,
  FaRecycle,
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

  const sectionStyle = "bg-white text-black rounded-lg flex items-center h-16 mb-4";
  const buttonStyle = "py-2 px-4 bg-[#f4bd8a] text-[#726e81] rounded flex items-center";
  const inputContainerStyle = "mb-4 flex items-center";
  const inputStyle = "flex-1 p-2 bg-[#ebebeb] rounded border-transparent";

  if (!userData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white">
      <div className="w-full h-full flex-1 bg-[#ebebf8] rounded-lg shadow-lg p-6">
        <div className="grid flex-1 h-full grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-medium text-[#727ea7] mb-2">
              Détails de compte
            </h2>
            {[
              {
                label: "Pseudo",
                value: userData.pseudo,
                icon: <FaUserCheck className="scale-[150%] mx-2 text-[#514F69]" />,
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
              <span className="mx-2">Icon</span>
              <span>Associer portefeuille Lightning</span>
            </button>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h2 className="text-xl font-medium text-[#727ea7] mb-2">
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
                <FaUserShield className="scale-[150%] mx-2 text-[#514F69]" />
                <label className="flex-1 mb-1 text-gray-600">{item.label}</label>
                <input
                  type="password"
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
        <div className="flex justify-between mt-6">
          <div className="flex">
            <button className={buttonStyle}>
              <FaDonate className="scale-[150%] mx-2 text-[#514F69]" />
              <span>Activer le mode sponsor</span>
            </button>
            <button className={`ml-2 ${buttonStyle}`}>
              <FaHeartbeat className="scale-[150%] mx-2 text-[#514F69]" />
              <span>Activer le mode caritatif</span>
            </button>
          </div>
          <button className="flex items-center px-4 py-2 ml-2 text-white bg-red-500 rounded hover:bg-red-600">
            <FaTrashAlt className="scale-[150%] mx-2 text-[#514F69]" />
            <span>Supprimer le compte</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
