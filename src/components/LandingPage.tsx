"use client";
import { Permanent_Marker } from "next/font/google";
import Image from "next/image";
import landing from "../../public/images/landing.jpg";
import { useRef } from "react";
import ExpandCircleDownRoundedIcon from "@mui/icons-material/ExpandCircleDownRounded";
import { userPrivateStore } from "@/store";
import HomePageSpotList from "./HomePageSpotList";

const inter = Permanent_Marker({
  subsets: ["latin"],
  weight: "400",
});
const LandingPage = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const uid = userPrivateStore((state) => state.userInfo?.uid);

  return (
    <>
      <div className=" relative flex items-center justify-center">
        <Image
          src={landing}
          width={1000}
          height={1000}
          quality={100}
          alt="landing"
          className="mask-waves rounded-b-6xl h-screen w-screen object-cover object-left sm:object-fill"
        />
        <div
          className={`absolute mb-20 animate-text break-words bg-gradient-to-r from-white  via-sky-500 to-emerald-500 bg-clip-text p-5 text-center text-8xl text-transparent sm:text-9xl  ${inter.className} -skew-y-12  transform drop-shadow-2xl`}
        >
          WAVE TO GO
        </div>
        <button
          onClick={handleClick}
          className="absolute bottom-0  left-1/2 -translate-x-1/2 transform bg-white text-6xl opacity-70 hover:opacity-100"
        >
          <ExpandCircleDownRoundedIcon
            className="animate-bounce"
            fontSize="inherit"
          />
        </button>
      </div>
      <div ref={ref} className="w-full max-w-[1440px] px-4 sm:px-12">
        <div className="mb-6 flex w-full flex-col">
          <HomePageSpotList uid={uid} />
        </div>
      </div>
    </>
  );
};

export default LandingPage;
