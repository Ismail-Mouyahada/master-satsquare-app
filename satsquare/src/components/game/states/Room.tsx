import { useSocketContext } from "@/context/socket";
import { useEffect, useState } from "react";

interface Player {
  id: string;
  username: string;
}

interface Props {
  data: {
    text: string;
    inviteCode: string;
  };
}

export default function Room({ data: { text, inviteCode } }: Props): JSX.Element {
  const { socket } = useSocketContext();
  const [playerList, setPlayerList] = useState<Player[]>([]);

  useEffect(() => {
    const handleNewPlayer = (player: Player) => {
      setPlayerList((prevPlayerList) => [...prevPlayerList, player]);
    };

    const handleRemovePlayer = (playerId: string) => {
      setPlayerList((prevPlayerList) => prevPlayerList.filter((p) => p.id !== playerId));
    };

    const handlePlayerKicked = (playerId: string) => {
      setPlayerList((prevPlayerList) => prevPlayerList.filter((p) => p.id !== playerId));
    };

    socket.on("manager:newPlayer", handleNewPlayer);
    socket.on("manager:removePlayer", handleRemovePlayer);
    socket.on("manager:playerKicked", handlePlayerKicked);

    return () => {
      socket.off("manager:newPlayer", handleNewPlayer);
      socket.off("manager:removePlayer", handleRemovePlayer);
      socket.off("manager:playerKicked", handlePlayerKicked);
    };
  }, [socket]);

  return (
    <section className="relative flex flex-col items-center justify-center flex-1 w-full px-2 mx-auto max-w-7xl">
      <div className="px-6 py-4 mb-10 text-6xl font-extrabold bg-white rounded-md rotate-3">
        {inviteCode}
      </div>

      <h2 className="mb-4 text-4xl font-bold text-white drop-shadow-lg">
        {text}
      </h2>

      <div className="flex flex-wrap gap-3">
        {playerList.map((player) => (
          <div
            key={player.id}
            className="px-4 py-3 font-bold text-white rounded-md cursor-pointer shadow-inset bg-primary"
            onClick={() => socket.emit("manager:kickPlayer", player.id)}
          >
            <span className="text-xl cursor-pointer drop-shadow-md hover:line-through">
              {player.username}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
