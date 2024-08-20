import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  FaCreativeCommonsSamplingPlus,
  FaDonate,
  FaHeartbeat,
  FaMailBulk,
  FaPassport,
  FaRecycle,
  FaShieldVirus,
  FaUserShield,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { UserDTO } from "@/types/userDto";

const ProfileDetail: React.FC = () => {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<UserDTO | null>(null);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Modal states
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [openPayModal, setOpenPayModal] = useState(false);

  // Transaction states
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>("");
  const [invoice, setInvoice] = useState<string>("");
  const [walletIdInput, setWalletIdInput] = useState<string>(""); // Wallet ID input state
  const [walletDetails, setWalletDetails] = useState<{
    id: string;
    name: string;
    balance: number;
  } | null>(null); // Simplified wallet details state

  const router = useRouter();

  // Fetch user data on component mount
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
          toast.error("Erreur lors de la récupération des données utilisateur.");
        }
      }
    };

    fetchUserData();
  }, [session]);

  // Fetch wallet details whenever the wallet ID changes
  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (userData?.walletId) {
        try {
          const response = await fetch(
            `/api/get-wallet-details?walletId=${userData.walletId}`, // Pass walletId as query param
            {
              method: "GET", // Use GET method
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch wallet details");
          }

          const data = await response.json();
          const balance = BigInt(data.balance) / BigInt(1000); // Convert msat to sat using BigInt

          // Update wallet details state with fetched data
          setWalletDetails({
            id: data.id,
            name: data.name,
            balance: Number(balance), // Convert BigInt to number for display
          });
        } catch (error) {
          console.error("Error fetching wallet details:", error);
          toast.error(
            "Erreur lors de la récupération des détails du portefeuille."
          );
        }
      }
    };

    fetchWalletDetails();
  }, [userData?.walletId]);

  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas.");
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

      toast.success("Mot de passe réinitialisé avec succès.");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la réinitialisation du mot de passe.");
    }
  };

  const handleLightningWallet = useCallback(async () => {
    if (!walletIdInput) {
      toast.error("Please enter a valid Wallet ID.");
      return;
    }

    try {
      // Update the user's wallet ID in the database
      const updateResponse = await fetch("/api/update-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.id,
          walletId: walletIdInput,
        }),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update wallet ID in the database.");
      }

      // Update local state to reflect the new wallet association
      setUserData((prevData) =>
        prevData ? { ...prevData, walletId: walletIdInput } : null
      );

      // Fetch the updated wallet details
      const fetchWalletDetails = async () => {
        if (userData?.walletId) {
          try {
            const response = await fetch(
              `/api/get-wallet-details?walletId=${userData.walletId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch wallet details");
            }

            const data = await response.json();
            const balance = BigInt(data.balance) / BigInt(1000);

            setWalletDetails({
              id: data.id,
              name: data.name,
              balance: Number(balance),
            });
          } catch (error) {
            console.error("Error fetching wallet details:", error);
            toast.error(
              "Erreur lors de la récupération des détails du portefeuille."
            );
          }
        }
      };

      await fetchWalletDetails();

      toast.success("Portefeuille Lightning associé avec succès.");
      setOpenWalletModal(false); // Close the modal after success
    } catch (error: any) {
      console.error("Error associating wallet:", error);
      toast.error(error.message || "Erreur lors de l'association du portefeuille.");
    }
  }, [walletIdInput, userData]);

  const handleCreateInvoice = async () => {
    try {
      const response = await fetch("/api/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount,
          memo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la création de la facture."
        );
      }

      const { payment_request: paymentRequest } = await response.json();
      setInvoice(paymentRequest);
      toast.success(`Facture créée: ${paymentRequest}`);
      setOpenInvoiceModal(false); // Close the modal after creating the invoice
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création de la facture.");
    }
  };

  const handlePayInvoice = async () => {
    try {
      const response = await fetch("/api/pay-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bolt11: invoice,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors du paiement de la facture."
        );
      }

      toast.success("Paiement effectué avec succès.");
      setOpenPayModal(false); // Close the modal after payment
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du paiement de la facture.");
    }
  };

  const handleActivateSponsorMode = () => {
    toast.success("Activer le mode sponsor");
  };

  const handleActivateCharityMode = () => {
    toast.success("Activer le mode caritatif");
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch("/api/users/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: session?.user?.email,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Erreur lors de la suppression du compte."
        );
      }

      signOut();
      router.push("/");
      setOpenDeleteModal(false); // Close the modal after deleting account
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression du compte.");
    }
  };

  const sectionStyle =
    "bg-slate-50 text-black rounded-lg flex items-center h-16 m-6";
  const buttonStyle =
    "p-4 px-8 bg-[#F4BD8A] text-[#726e81] rounded-md flex items-center";
  const inputContainerStyle = "grid grid-cols-2 mb-4";
  const inputStyle =
    "w-full px-8 py-3 text-center border-none rounded-md shadow outline-none bg-slate-100 text-[#6a6b74]";

  if (!userData) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center mt-8 bg-slate-50">
      <Toaster />
      {walletDetails && (
        <div className="fixed top-0 right-0 m-4 p-4 bg-white rounded shadow-lg flex items-center space-x-4">
          <span className="text-lg font-bold">Balance:</span>
          <span className="text-green-600">{walletDetails.balance} sats</span>
        </div>
      )}
      <div className="w-full h-fit flex-1 bg-[#EBEBF8] rounded-lg shadow-md p-10">
        <div className="grid flex-1 h-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-[#727EA7] my-8">
              Détails de compte
            </h2>
            {[
              {
                label: "Pseudo",
                value: userData.pseudo,
                icon: (
                  <FaPassport className="scale-[150%] mx-2 text-[#514F69]" />
                ),
              },
              {
                label: "Email",
                value: userData.email,
                icon: (
                  <FaMailBulk className="scale-[150%] mx-2 text-[#514F69]" />
                ),
              },
              {
                label: "Role",
                value: userData.role || "N/A",
                icon: (
                  <FaUserShield className="scale-[150%] mx-2 text-[#514F69]" />
                ),
              },
              {
                label: "Wallet ID",
                value: userData.walletId || "Non lié",
                icon: (
                  <FaCreativeCommonsSamplingPlus className="scale-[150%] mx-2 text-[#514F69]" />
                ),
              },
            ].map((item, index) => (
              <div key={index} className={sectionStyle}>
                <span className="ml-2">{item.icon}</span>
                <span className="ml-2">{item.label}</span>
                <span className="ml-4">{item.value}</span>
              </div>
            ))}
            {walletDetails && (
              <div className={sectionStyle}>
                <FaDonate className="scale-[150%] mx-2 text-[#514F69]" />
                <div className="ml-2 flex flex-col">
                  <span>Wallet: {walletDetails.name}</span>
                  <span>Balance: {walletDetails.balance} sats</span>
                </div>
              </div>
            )}
            <button
              className={buttonStyle}
              onClick={() => setOpenWalletModal(true)}
              disabled={!!userData.walletId} // Disable button if walletId exists
            >
              <FaCreativeCommonsSamplingPlus className="text-[#514F69] scale-[160%] mx-2" />
              <span className="font-bold">
                {userData.walletId
                  ? "Connected"
                  : "Associer portefeuille Lightning"}
              </span>
            </button>
          </div>

          <div className="px-10 py-8 bg-slate-50 rounded-lg">
            <h2 className="text-2xl font-semibold text-[#727EA7] pb-8">
              Réinitialiser le mot de passe
            </h2>
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
                  <FaUserShield className="scale-[150%] mx-4 mb-3 text-[#514F69]" />
                  <label className="flex-1 mb-1 text-gray-600">
                    {item.label}
                  </label>
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

          <div className="px-10 py-8 bg-slate-50 rounded-lg mt-4">
            <h2 className="text-2xl font-semibold text-[#727EA7] pb-8">
              Gérer les Transactions
            </h2>
            <button
              className={buttonStyle}
              onClick={() => setOpenInvoiceModal(true)}
            >
              <FaDonate className="scale-[150%] mx-2 text-[#514F69]" />
              <span>Créer une Facture</span>
            </button>
            <button
              className={`${buttonStyle} ml-4`}
              onClick={() => setOpenPayModal(true)}
            >
              <FaDonate className="scale-[150%] mx-2 text-[#514F69]" />
              <span>Payer une Facture</span>
            </button>
          </div>
        </div>

        <div className="flex justify-between pt-40 my-6">
          <div className="flex">
            <button className={buttonStyle} onClick={handleActivateSponsorMode}>
              <FaDonate className="scale-[150%] mx-2 text-[#514F69]" />
              <span className="font-bold">Activer le mode sponsor</span>
            </button>
            <button
              className={`ml-2 ${buttonStyle}`}
              onClick={handleActivateCharityMode}
            >
              <FaHeartbeat className="scale-[150%] mx-2 text-[#514F69]" />
              <span className="font-bold">Activer le mode caritatif</span>
            </button>
          </div>
          <button
            className="flex items-center px-4 py-4 ml-2 text-white bg-red-500 rounded hover:bg-red-600"
            onClick={() => setOpenDeleteModal(true)}
          >
            <FaShieldVirus className="scale-[150%] mx-2 text-[#f5f5f7]" />
            <span>Supprimer le compte</span>
          </button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        show={openDeleteModal}
        size="md"
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-red-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Êtes-vous sûr de bien vouloir supprimer votre compte ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteAccount}>
                {"Oui, supprimer le compte"}
              </Button>
              <Button color="gray" onClick={() => setOpenDeleteModal(false)}>
                Non, annuler !
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Wallet Association Modal */}
      <Modal
        show={openWalletModal}
        size="md"
        onClose={() => setOpenWalletModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-blue-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Entrez l'ID de votre portefeuille Lightning
            </h3>
            <input
              type="text"
              className={inputStyle}
              value={walletIdInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setWalletIdInput(e.target.value)
              }
              placeholder="ID du portefeuille Lightning"
            />
            <div className="flex justify-center gap-4 mt-4">
              <Button color="success" onClick={handleLightningWallet}>
                Associer
              </Button>
              <Button color="gray" onClick={() => setOpenWalletModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Invoice Creation Modal */}
      <Modal
        show={openInvoiceModal}
        size="md"
        onClose={() => setOpenInvoiceModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Créer une Facture
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700">Montant (sats)</label>
              <input
                type="number"
                className={inputStyle}
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount(Number(e.target.value))
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mémo</label>
              <input
                type="text"
                className={inputStyle}
                value={memo}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setMemo(e.target.value)
                }
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={handleCreateInvoice}>
                Créer
              </Button>
              <Button color="gray" onClick={() => setOpenInvoiceModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Payment Modal */}
      <Modal
        show={openPayModal}
        size="md"
        onClose={() => setOpenPayModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Payer une Facture
            </h3>
            <div className="mb-4">
              <label className="block text-gray-700">Invoice</label>
              <input
                type="text"
                className={inputStyle}
                value={invoice}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInvoice(e.target.value)
                }
              />
            </div>
            <div className="flex justify-center gap-4">
              <Button color="success" onClick={handlePayInvoice}>
                Payer
              </Button>
              <Button color="gray" onClick={() => setOpenPayModal(false)}>
                Annuler
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfileDetail;
