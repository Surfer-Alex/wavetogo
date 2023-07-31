"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { userPrivateStore } from "@/store";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "../../public/images/logo.png";
import headerUserIcon from "../../public/images/icons8-male-user-96.png";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import SearchBar from "./SearchBar";
import { Shrikhand } from "next/font/google";
import MapIcon from "@mui/icons-material/Map";

const inter = Shrikhand({
  subsets: ["latin"],
  weight: "400",
});

const Header = () => {
  const [showLogo, setShowLogo] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setShowLogo(true);
  }, [showLogo]);
  const userIcon = userPrivateStore((state) => state.userInfo?.photoURL);
  const pathname = usePathname();
  const isActive = pathname === "/";
  const homepage = isActive
    ? "bg-transparent absolute w-full text-white"
    : "sticky text-black border-b-2 border-slate-400 bg-[#ffffff]";
  const searchForm = isActive ? "text-black" : "border border-slate-700";

  return (
    <>
      <SearchBar setOpen={setOpen} open={open} />
      <div className={`top-0 z-40 flex h-[80px] text-2xl ${homepage} `}>
        <Link className="flex opacity-90 hover:opacity-100" href="/">
          <div className="relative ml-4 h-full w-[80px] sm:ml-8">
            <Image
              quality={100}
              src={logo}
              fill
              alt="logo"
              className="h-full w-full  rounded-full"
            />
          </div>
          <div
            className={`${inter.className} hidden self-center text-3xl text-teal-500 lg:block`}
          >
            Wavetogo
          </div>
        </Link>
        <Link className="order-1 flex lg:order-none" href="/surf-spot-map">
          <button className="ml-10 hidden self-center  opacity-70 hover:opacity-100 lg:block">
            SURF SPOT MAP
          </button>
          <div className="ml-4 self-center hover:text-teal-500 sm:ml-10 lg:hidden">
            <MapIcon fontSize="large" />
          </div>
        </Link>
        <div className=" ml-4 grow self-center sm:ml-10 lg:ml-auto lg:w-80 lg:grow-0">
          <button
            onClick={() => setOpen(true)}
            className={`flex h-full w-full justify-center rounded-full bg-white px-4 py-2 text-xs text-slate-400 sm:text-base lg:text-2xl ${searchForm}`}
          >
            <div>Search</div>
            <SearchRoundedIcon
              fontSize="inherit"
              className="ml-2 self-center"
            />
          </button>
        </div>
        <div className="lg:order-0 relative order-1 mx-5 h-full max-h-[40px] w-full max-w-[40px] self-center sm:mx-10">
          {showLogo && (
            <Link href="/member">
              <Image
                fill
                alt="member icon"
                src={userIcon || headerUserIcon}
                className="rounded-full hover:border hover:border-teal-800"
                priority={true}
              />
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

{
  /* <button className="self-center ml-10 mr-10  text-white">會員頁</button> */
}
