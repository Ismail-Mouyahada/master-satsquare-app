import Image from "next/image";
import Form from "@/components/Form";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { useEffect, useState, KeyboardEvent, ChangeEvent } from "react";
import logo from "@/assets/logo-header.png";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { socket } from "@/context/socket";
import { FaUser } from "react-icons/fa";

export default function ManagerPassword() {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState<string>("");

  const handleCreate = () => {
    setLoading(true);
    socket.emit("manager:createRoom", password);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleCreate();
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    const handleErrorMessage = (message: Renderable | ValueFunction<Renderable, Toast>) => {
      toast.error(message);
    };

    socket.on("game:errorMessage", handleErrorMessage);

    return () => {
      socket.off("game:errorMessage", handleErrorMessage);
    };
  }, []);

  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      <Image src={logo} className="mb-6" alt="logo" />

      <Form>
        <div className="flex flex-col items-center justify-center">
          <div className="bg-[#4145c1] p-8 rounded-full">
            <FaUser className="text-5xl text-white" />
          </div>
        </div>
        <Input
          type="password"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Mot de passe de l'admin"
        />
        <Button onClick={handleCreate} disabled={loading}>
          Submit
        </Button>
      </Form>
    </section>
  );
}
