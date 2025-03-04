import { usePlayerContext } from "@/context/player";
import Form from "@/components/Form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { SetStateAction, useEffect, useState } from "react";
import { useSocketContext } from "@/context/socket";
import { useRouter } from "next/navigation";
import { FaGamepad } from "react-icons/fa";

export default function Username() {
  const { socket } = useSocketContext();
  const { player, dispatch } = usePlayerContext();
  const router = useRouter(); // Use useRouter hook here correctly
  const [username, setUsername] = useState("");

  const handleJoin = () => {
    socket.emit("player:join", { username: username, room: player.room });
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleJoin();
    }
  };

  useEffect(() => {
    const handleSuccessJoin = () => {
      dispatch({
        type: "LOGIN",
        payload: username,
      });

      router.replace("/game"); // Use replace method for navigation
    };

    socket.on("game:successJoin", handleSuccessJoin);

    return () => {
      socket.off("game:successJoin", handleSuccessJoin);
    };
  }, [username, socket, dispatch, router]);

  return (
    <Form>
      <div className="flex flex-col items-center justify-center">
        <div className="p-8 rounded-full bg-main">
          <FaGamepad className="text-5xl text-white" />
        </div>
      </div>

      <Input
      name="username"
        onChange={(e: { target: { value: SetStateAction<string> } }) => setUsername(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nom d'utilsiateur..."
      />
      <Button  className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-3 font-semibold" onClick={handleJoin}>Soumettre</Button>
      <Button
        href="/"
        className="outline-none ring-[#6a6b74!important] bg-action hover:bg-[#c9aa6c!important] text-[#6a6b74] px-4 py-3 font-semibold"
      >Retour</Button>
    </Form>
  );
}
