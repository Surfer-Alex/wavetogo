"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../../public/images/logo.png";
import React from "react";
import Image from "next/image";
import { Shrikhand } from "next/font/google";
const inter = Shrikhand({
  subsets: ["latin"],
  weight: "400",
});
const Footer = () => {
  const pathname = usePathname();
  const isActive = pathname === "/surf-spot-map";
  if (isActive) {
    return;
  }
  return (
    <div className="bottom-0 flex h-[80px]  w-full bg-[rgb(220,219,219)] text-base text-black sm:text-2xl ">
      <Link className="flex items-center opacity-90 hover:opacity-100" href="/">
        <div className="relative ml-4 h-[50px] w-[50px] sm:ml-8 sm:h-full sm:w-[80px]">
          <Image
            quality={100}
            src={logo}
            fill
            alt="logo"
            className="h-full w-full  rounded-full"
          />
        </div>
        <div
          className={`${inter.className} self-center text-lg text-teal-500 sm:text-3xl lg:block`}
        >
          Wavetogo
        </div>
      </Link>

      <Link
        href="https://github.com/Surfer-Alex/wavetogo"
        className="ml-auto self-center font-medium"
      >
        <button>GITHUB</button>
      </Link>
      <Link
        href="https://www.linkedin.com/in/alex-chen-surfer/"
        className="mx-5 self-center font-medium sm:mx-10"
      >
        <button>LINKEDIN</button>
      </Link>
    </div>
  );
};

export default Footer;
