import { usePlayerContext } from "@/context/player";
import Form from "@/components/Form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { SetStateAction, useEffect, useState, useCallback } from "react";
import { socket } from "@/context/socket";
import { FaGamepad } from "react-icons/fa";
import Link from "next/link";
import QRCode from "qrcode.react";
import { Association } from "@/types/main-types/main";
import toast from "react-hot-toast";

export default function Room() {
  const { player, dispatch } = usePlayerContext();
  const [roomId, setRoomId] = useState("");
  const [associations, setAssociations] = useState<Association[]>([]);
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Replace this with the actual LNbits login URL
  const lnbitsLoginUrl = "https://lnbits.com/login?lnurl=your-lnurl-here";

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Authenticated with LNbits");
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (selectedAssociation && isAuthenticated) {
      socket.emit("player:joinAssociation", { roomId, associationId: selectedAssociation.id });
    } else {
      alert("Please select an association and authenticate with LNbits first.");
    }
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    socket.emit('requestAssociations');

    socket.on('associationsList', (data: Association[]) => {
      setAssociations(data);
      setLoading(false);
    });

    socket.on('game:errorMessage', (message: string) => {
      toast.dismiss();
      toast.error(message.split(' ')[0] === 'Failed' ? 'Failed to load associations.' : message);
      setError(message);
      setLoading(false);
    });

    return () => {
      socket.off('associationsList');
      socket.off('game:errorMessage');
    };
  }, [socket]);

  const handleAssociationSelect = useCallback((association: Association) => {
    setSelectedAssociation(association);
  }, []);

  useEffect(() => {
    socket.on("game:successRoom", (roomId) => {
      dispatch({ type: "JOIN", payload: roomId });
    });

    return () => {
      socket.off("game:successRoom");
    };
  }, [dispatch]);

  const handleQrScanSuccess = () => {
    setIsAuthenticated(true);
  };

  const filteredAssociations = associations.filter((association) =>
    association.nom
  );

  return (
    <Form>
      <div className="flex flex-col items-center justify-center">
        <div className="p-8 rounded-full bg-main">
          <FaGamepad className="text-5xl text-white" />
        </div>
      </div>

      {loading ? (
        <div>Loading associations...</div>
      ) : (
        <div className="relative">
          <button id="dropdownSearchButton" data-dropdown-toggle="dropdownSearch" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
            {selectedAssociation ? selectedAssociation.nom : "Select Association"}
            <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
            </svg>
          </button>
          {JSON.stringify(associations)}
          <div id="dropdownSearch" className="z-10 hidden bg-white rounded-lg shadow w-60 dark:bg-gray-700">
            <div className="p-3">
              <label htmlFor="input-group-search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  id="input-group-search"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search association"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ul className="h-48 px-3 pb-3 overflow-y-auto text-sm text-gray-700 dark:text-gray-200">
              {filteredAssociations.map((association) => (
                <li key={association.id}>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      type="checkbox"
                      checked={selectedAssociation?.id === association.id}
                      onChange={() => handleAssociationSelect(association)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                    />
                    <label className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                      {association.adresseEclairage}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mb-4">
        <div className="flex flex-col items-center">
          <QRCode value={lnbitsLoginUrl} size={128} /> {/* LNbits QR code */}
          <Button
            onClick={handleQrScanSuccess}
            color={isAuthenticated ? "success" : "warning"}
            className="mt-4 w-full"
          >
            {isAuthenticated ? "Authenticated with LNbits" : "Scan QR Code to Login"}
          </Button>
        </div>
      </div>

      <Input
        className="w-full font-bold text-center border-spacing-1 border-1 border-slate-300 focus:text-center"
        onChange={(e: { target: { value: SetStateAction<string> } }) => setRoomId(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Code de la session"
        variant="outlined"
        label="Code de la session"
       // Disable input until authenticated and association is selected
      />
      <Button
        onClick={handleLogin}
        className="w-full mt-4"
      
      >
        Rejoindre
      </Button>

      <Link
        href="/"
        className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-3 font-semibold text-center rounded-md mt-4"
      >
        Retour à l'accueil
      </Link>
    </Form>
  );
}
