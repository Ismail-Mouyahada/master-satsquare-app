import { usePlayerContext } from "@/context/player";
import Form from "@/components/Form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useEffect, useState, useCallback } from "react";
import { socket } from "@/context/socket";
import { FaGamepad } from "react-icons/fa";
import Link from "next/link";
import QRCode from "qrcode.react";
import { Association } from "@/types/main-types/main";
import toast from "react-hot-toast";
import Authlight from "@/components/Authlight";

export default function Room() {
  const { player, dispatch } = usePlayerContext();
  const [roomId, setRoomId] = useState<string>("");
  const [associations, setAssociations] = useState<Association[]>([]);
  const [selectedAssociation, setSelectedAssociation] = useState<Association | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    if (isAuthenticated) {
      toast.success('authenfyld login successfully using LNURL auth');
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (selectedAssociation && isAuthenticated) {
      socket.emit("player:joinAssociation", { roomId, associationId: selectedAssociation.id });
    } else {
      alert("Please select an association and authenticate with LNbits first.");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
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
  }, []);

  const handleAssociationSelect = useCallback((association: Association) => {
    setSelectedAssociation(association);
  }, []);

  useEffect(() => {
    socket.on("game:successRoom", (roomId: string) => {
      dispatch({ type: "JOIN", payload: roomId });
    });

    return () => {
      socket.off("game:successRoom");
    };
  }, [dispatch]);

  const handleQrScanSuccess = () => {
    setIsAuthenticated(true);
  };

  const filteredAssociations = associations.filter((association: Association) =>
    association?.nom
  );

  return (
    <div className="w-1/2 justify-center bg-slate-200 rounded p-8 z-40  ">
      <div className="grid grid-cols-2 gap-4   w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center py-4 ">
            <div className="p-8 rounded-full bg-main">
              <FaGamepad className="text-5xl text-white" />
            </div>
          </div>




          <Input
            className="w-full bg-[#f0f0f5!important] py-4 font-bold text-center border-spacing-1 border-1 border-slate-300 focus:text-center"
            onChange={(e: any) => setRoomId(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Code de la session"
            variant="outlined"
            label="Code de la session"
            disabled={!isAuthenticated || !selectedAssociation}
          />
          <Button
            onClick={handleLogin}
            className="w-full mt-4"
            disabled={!isAuthenticated || !selectedAssociation}
          >
            Rejoindre
          </Button>

          <Link
            href="/"
            className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-3 font-semibold text-center rounded-md mt-4"
          >
            Retour à l'accueil
          </Link>
        </div>
       

      </div>


    </div>
  );
}
