import React, { useEffect, useState, ChangeEvent, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  FaCreativeCommonsSamplingPlus,
  FaDonate,
  FaFileContract,
  FaHeartbeat,
  FaMailBulk,
  FaPassport,
  FaRecycle,
  FaShieldVirus,
  FaUserShield,
  FaClipboard,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { UserDTO } from "@/types/userDto";
import QRCode from "qrcode.react"; // Import QRCode from the library

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
  const [walletIdInput, setWalletIdInput] = useState<string>("");
  const [walletDetails, setWalletDetails] = useState<{
    id: string;
    name: string;
    balance: number;
  } | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch(
            `/api/users?email=${session.user.email}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }
          const data: UserDTO = await response.json();
          setUserData(data);
        } catch (error: any) {
          console.error(
            "Erreur lors de la récupération des données utilisateur:",
            error
          );
          toast.error(
            "Erreur lors de la récupération des données utilisateur."
          );
        }
      }
    };

    fetchUserData();
  }, [session]);

  useEffect( () => {
    const fetchWalletDetails = async () => {
      if (userData!=null) {
        try {

        
          const response = await fetch(
            `/api/get-wallet-details`,
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
      } else {
        setWalletDetails(null);
      }
    };

    fetchWalletDetails();

 
 
  }, [userData]);

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
      // Optionally, clear password fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast.error(
        error.message || "Erreur lors de la réinitialisation du mot de passe."
      );
    }
  };

  const handleDisassociateWallet = useCallback(async () => {
    try {
      const disassociateResponse = await fetch("/api/disassociate-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userData?.id,
        }),
      });

      if (!disassociateResponse.ok) {
        throw new Error(
          "Échec de la dissociation du portefeuille dans la base de données."
        );
      }

      setUserData((prevData) =>
        prevData ? { ...prevData, walletId: undefined } : null
      );
      setWalletDetails(null); // Réinitialiser les détails du portefeuille dans l'état

      toast.success("Portefeuille Lightning dissocié avec succès.");
    } catch (error: any) {
      console.error("Error disassociating wallet:", error);
      toast.error(
        error.message || "Erreur lors de la dissociation du portefeuille."
      );
    }
  }, [userData]);

  const handleLightningWallet = useCallback(async () => {
    if (!walletIdInput) {
      toast.error("Veuillez entrer un ID de portefeuille valide.");
      return;
    }

    try {
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
        const data = await updateResponse.json();
        throw new Error(
          data.message ||
            "Échec de la mise à jour de l'ID du portefeuille dans la base de données."
        );
      }

      setUserData((prevData) =>
        prevData ? { ...prevData, walletId: walletIdInput } : null
      );

      // Fetch updated wallet details
      const fetchUpdatedWalletDetails = async () => {
        if (walletIdInput) {
          try {
            const response = await fetch(
              `/api/get-wallet-details`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (!response.ok) {
              throw new Error(
                "Échec de la récupération des détails du portefeuille"
              );
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

      await fetchUpdatedWalletDetails();

      toast.success("Portefeuille Lightning associé avec succès.");
      setOpenWalletModal(false);
    } catch (error: any) {
      console.error("Error associating wallet:", error);
      toast.error(
        error.message || "Erreur lors de l'association du portefeuille."
      );
    }
  }, [walletIdInput, userData]);

  const handleCreateInvoice = async () => {
    if (amount <= 0) {
      toast.error("Le montant doit être supérieur à zéro.");
      return;
    }

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
      toast.success("Facture créée avec succès.");
      setOpenInvoiceModal(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la création de la facture.");
    }
  };

  const handlePayInvoice = async () => {
    if (!invoice) {
      toast.error("Veuillez entrer une facture valide.");
      return;
    }

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
      setOpenPayModal(false);
      setInvoice(""); // Optionally, clear the invoice field after payment
    } catch (error: any) {
      toast.error(error.message || "Erreur lors du paiement de la facture.");
    }
  };

  const handleActivateSponsorMode = () => {
    toast.success("Mode sponsor activé.");
  };

  const handleActivateCharityMode = () => {
    toast.success("Mode caritatif activé.");
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
      setOpenDeleteModal(false);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression du compte.");
    }
  };

  const handleCopyInvoice = () => {
    if (invoice) {
      navigator.clipboard
        .writeText(invoice)
        .then(() => {
          toast.success("Invoice copiée dans le presse-papiers !");
        })
        .catch(() => {
          toast.error("Erreur lors de la copie de l'invoice.");
        });
    } else {
      toast.error("Aucune facture à copier.");
    }
  };

  const sectionStyle =
    "bg-slate-50 text-black rounded-lg flex items-center h-16 m-4";
  const buttonStyle =
    "p-2.5 px-6 bg-[#F4BD8A] text-[#726e81] rounded-md flex items-center";
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
        <div className="fixed top-0 right-0 m-4 p-4 bg-opacity-20 bg-yellow-200 rounded-md shadow-lg shadow-slate-300 flex items-center space-x-4">
          <FaDonate className="text-yellow-300 scale-[200%] mx-2" />
          <div className="text-slate-800 font-bold">
            {walletDetails.balance} <span className="font-bold">Sat</span>
          </div>
        </div>
      )}

      <div className="w-full h-fit flex-1 bg-[#EBEBF8] rounded-lg shadow-md p-10">
        <div className="grid flex-1 h-full grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-yellow-500">
              Détails de compte
            </h2>

            {[
              {
                label: "Pseudo",
                value: userData.pseudo,
                icon: (
                  <FaPassport className="scale-[150%] mx-2 text-yellow-500" />
                ),
              },
              {
                label: "Email",
                value: userData.email,
                icon: (
                  <FaMailBulk className="scale-[150%] mx-2 text-yellow-500" />
                ),
              },
              {
                label: "Rôle",
                value: userData.role || "N/A",
                icon: (
                  <FaUserShield className="scale-[150%] mx-2 text-yellow-500" />
                ),
              },
              {
                label: "Wallet ID",
                value: walletDetails ? "Connecté" : "Non lié",
                icon: (
                  <FaCreativeCommonsSamplingPlus className="scale-[150%] mx-2 text-yellow-500" />
                ),
              },
            ].map((item, index) => (
              <div key={index} className={sectionStyle}>
                <span className="ml-2 p-2 text-yellow-500">{item.icon}</span>
                <span className="ml-2 p-2 font-bold text-yellow-500">
                  {item.label}
                </span>
                <span className="ml-4 p-2">{item.value}</span>
              </div>
            ))}

            <button
              className={`w-full h-16 m-4 ${
                walletDetails ? "bg-gray-200" : "bg-[#F4BD8A]"
              } text-[#594e80] rounded-md flex items-center justify-center`}
              onClick={() => setOpenWalletModal(true)}
              disabled={!!walletDetails}
            >
              <FaCreativeCommonsSamplingPlus className="text-[#dac50b] scale-[160%] mx-2" />
              <span className="font-bold">
                {walletDetails
                  ? "Portefeuille lié"
                  : "Associer portefeuille Lightning"}
              </span>
            </button>

            {walletDetails && (
              <button
                className="w-full h-16 m-4 bg-red-500 text-white rounded-md flex items-center justify-center"
                onClick={handleDisassociateWallet}
              >
                <FaShieldVirus className="scale-[160%] mx-2" />
                <span className="font-bold">Dissocier le portefeuille</span>
              </button>
            )}
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
            <div className="flex justify-between gap-4">
              <button
                className={buttonStyle}
                onClick={() => setOpenInvoiceModal(true)}
              >
                <FaFileContract className="scale-[150%] mx-2 text-[#514F69]" />
                <span>Recevoir</span>
              </button>
              <button
                className={`${buttonStyle} ml-4`}
                onClick={() => setOpenPayModal(true)}
              >
                <FaDonate className="scale-[150%] mx-2 text-[#514F69]" />
                <span>Payer</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4 my-6">
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
                Oui, supprimer le compte
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
            <h3 className="my-5 text-lg font-bold text-gray-500 dark:text-gray-400">
              Créer une Facture
            </h3>
            {invoice && (
              <>
                <div className="mb-4 flex justify-center">
                  <QRCode value={invoice} size={256} />
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-center">
                    <span className="block text-gray-700 font-bold mr-2">
                      Copier
                    </span>

                    <button
                      className="ml-2 p-2 bg-gray-200 rounded"
                      onClick={handleCopyInvoice}
                    >
                      <FaClipboard className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </>
            )}
            <div className="mb-4">
              <label className="block text-gray-700">Montant (sats)</label>
              <input
                type="number"
                className={inputStyle}
                value={amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAmount(Number(e.target.value))
                }
                min="1"
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
                placeholder="Description de la facture"
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
              <div className="flex items-center">
                <input
                  type="text"
                  className={inputStyle}
                  value={invoice}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setInvoice(e.target.value)
                  }
                  placeholder="Insérez l'Invoice ici"
                />
                <button
                  className="ml-2 p-2 bg-gray-200 rounded"
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText();
                      setInvoice(text);
                      toast.success(
                        "Invoice collée depuis le presse-papiers !"
                      );
                    } catch (err) {
                      toast.error("Erreur lors du collage du presse-papiers.");
                    }
                  }}
                >
                  <FaClipboard className="text-gray-500" />
                </button>
              </div>
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