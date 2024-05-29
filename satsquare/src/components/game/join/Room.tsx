import { usePlayerContext } from "@/context/player"
import Form from "@/components/Form"
import Button from "@/components/Button"
import Input from "@/components/Input"
import { SetStateAction, useEffect, useState } from "react"
import { socket } from "@/context/socket"
import { Card, FloatingLabel } from "flowbite-react"
import { FaGamepad } from "react-icons/fa"

export default function Room() {
  const { player, dispatch } = usePlayerContext()
  const [roomId, setRoomId] = useState("")

  const handleLogin = () => {
    socket.emit("player:checkRoom", roomId)
  }

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  useEffect(() => {
    socket.on("game:successRoom", (roomId) => {
      dispatch({ type: "JOIN", payload: roomId })
    })

    return () => {
      socket.off("game:successRoom")
    }
  }, [dispatch])

  return (
    <Form>
      
        <div className="flex flex-col items-center justify-center">
          <div className="p-8 rounded-full bg-main">
            <FaGamepad className="text-5xl text-white" />
          </div>
        </div>

        <Input className="w-full font-bold text-center border-spacing-1 border-1 border-slate-300 focus:text-center " onChange={(e: { target: { value: SetStateAction<string> } }) => setRoomId(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="PIN Code here" variant="outlined" label="Code de la session" />
        <Button onClick={() => handleLogin()}  >Rejoindre</Button>
   
      {/* <Input
        onChange={(e: { target: { value: SetStateAction<string> } }) => setRoomId(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="PIN Code here"
      />
      <Button onClick={() => handleLogin()}>Submit</Button> */}
    </Form>
  )
}
