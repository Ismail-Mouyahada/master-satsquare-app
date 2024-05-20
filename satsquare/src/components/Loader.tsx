import loader from "@/assets/logo-loader.png"
import Image from "next/image"

export default function Loader() {
  return <Image className=" animate-spin-slow" src={loader} width={80} height={80} alt="" />
}
