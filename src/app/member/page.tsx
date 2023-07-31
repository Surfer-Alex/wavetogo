"use client";
import { useEffect, useState } from "react";

import { signOut } from "firebase/auth";
import { db, auth } from "@/firebase";

import { userPrivateStore } from "@/store";
import { useRouter } from "next/navigation";


import Image from "next/image";
import userIcon from "../../../public/images/icons8-male-user-96.png";

function Page() {
  const [isFetchingGlobalState, setIsFetchingGlobalState] =
    useState<boolean>(true);
  const getUserInfo = userPrivateStore((state) => state.userInfo);
  const router = useRouter();

  useEffect(() => {
    if (getUserInfo === null) {
      setIsFetchingGlobalState(true);
    } else {
      setIsFetchingGlobalState(false);
    }
  }, [getUserInfo]);

  useEffect(() => {
    if (isFetchingGlobalState) return;
    if (getUserInfo?.isLogin === false) {
      router.push("/userAuth");
    }
  }, [isFetchingGlobalState, getUserInfo]);

  async function Logout() {
    await signOut(auth);
    userPrivateStore.setState({ userInfo: null });
    router.push("/userAuth");
  }

  return (
    <>
      <div className="flex h-negativeHeaderFooter w-full items-center justify-center  md:h-3/5 md:w-3/4 ">
        <div className="flex  h-full w-full flex-col items-center justify-center bg-gray-100 p-4 md:w-4/5 md:rounded-xl ">
          <Image
            width={150}
            height={150}
            alt="user icon"
            quality={100}
            src={getUserInfo?.photoURL || userIcon}
            className="rounded-full"
          />
          <div className="mt-4 text-2xl font-bold">
            {getUserInfo?.displayName}
          </div>
          <div className="font-base text-xl ">{getUserInfo?.email}</div>
          <button
            className=" mt-6 rounded-full bg-black p-2 text-white"
            onClick={Logout}
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );
}
export default Page;
