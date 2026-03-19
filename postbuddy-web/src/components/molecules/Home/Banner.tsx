import HomeBanner from "@/assets/home.webp"
import Image from "next/image"
export default function Banner() {
  return (
    <div>
        <Image src={HomeBanner} alt='/' className="rounded-2xl scale-90 hover:scale-95 duration-500 hover:blur-sm cursor-pointer"/>
    </div>
  )
}