import Image from "next/image"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { SetStateAction, useEffect, useState } from "react"
import logo from "@/assets/logo-header.png"
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast"
import { socket } from "@/context/socket"
import { FaUser, FaUserAltSlash } from "react-icons/fa"

export default function ManagerPassword() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState("")

  const handleCreate = () => {
    socket.emit("manager:createRoom", password)
  }

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleCreate()
    }
  }

  useEffect(() => {
    socket.on("game:errorMessage", (message: Renderable | ValueFunction<Renderable, Toast>) => {
      toast.error(message)
    })

    return () => {
      socket.off("game:errorMessage")
    }
  }, [])

  return (
    <section className="relative flex flex-col items-center justify-center w-full h-screen">
      <div className="absolute w-full h-full overflow-hidden">
        <div className="absolute -left-[15vmin] -top-[15vmin] min-h-[75vmin] min-w-[75vmin] rounded-full bg-primary/15"></div>
        <div className="absolute -bottom-[15vmin] -right-[15vmin] min-h-[75vmin] min-w-[75vmin] rotate-45 bg-primary/15"></div>
      </div>

      <Image src={logo} className="mb-6 " alt="logo" />

      <Form>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-[#4145c1] p-8 rounded-full">
          <FaUser className="text-5xl text-white" />
        </div>
      </div>
        <Input
          type="password"
          onChange={(e: { target: { value: SetStateAction<string> } }) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mot de passe de l'admin"
        />
        <Button onClick={() => handleCreate()}>Submit</Button>
      </Form>
    </section>
  )
}
