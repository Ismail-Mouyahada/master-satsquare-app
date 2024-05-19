import loader from "@/assets/loader.svg"
import Image from "next/image"

export default function Loader({ ...otherProps } : any) {
  return <Image src={loader} width={160} height={160} alt="" />
}
