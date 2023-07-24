'use client';
import { useEffect, useState } from 'react';

import { signOut } from 'firebase/auth';
import { db, auth } from '@/firebase';

import { userPrivateStore } from '@/store';
import { useRouter } from 'next/navigation';

// import { usePathname } from 'next/navigation';
import Image from 'next/image';
import userIcon from '../../../public/images/icons8-male-user-96.png';

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
      router.push('/userAuth');
    }
  }, [isFetchingGlobalState, getUserInfo]);

  async function Logout() {
    await signOut(auth);
    userPrivateStore.setState({ userInfo: null });
    router.push('/userAuth');
  }

  return (
    <>
      <div className="w-3/4 h-3/5 flex justify-center items-center">
        <div className="w-4/5  h-full flex flex-col justify-center items-center bg-gray-100 rounded-xl px-4 py-4">
          <Image
            width={150}
            height={150}
            alt="user icon"
            quality={100}
            src={getUserInfo?.photoURL || userIcon}
            className="rounded-full"
          />
          <div className="text-2xl font-bold mt-4">
            {getUserInfo?.displayName}
          </div>
          <div className="text-xl font-base ">{getUserInfo?.email}</div>
          <button
            className=" bg-black text-white p-2 mt-6 rounded-full"
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
