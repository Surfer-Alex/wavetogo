'use client';
import { useEffect, useState } from 'react';
import { useSignInWithGoogle, useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { userPrivateStore } from '@/store';
import { UserInfo } from '@firebase/auth-types';
import Image from 'next/image';
import userIcon from '../../../public/images/icons8-user.gif';
import SignUp from '@/components/member/SignUp';
import SignInWithNative from '@/components/member/SignInWithNative';
import GoogleIcon from '@mui/icons-material/Google';

function Page() {
  const [signInWithGoogle, user, loading, fbError] = useSignInWithGoogle(auth);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  // const isLogin = userStore.getState().uid;
  const [change, setChange] = useState(true);

  // useEffect(() => {

  //   getUserData(isLogin);
  // }, []);

  const getUserInfo = userPrivateStore((state) => state.userInfo);
  console.log(getUserInfo);

  async function Logout() {
    await signOut(auth);
    userPrivateStore.setState({ userInfo: null });
  }

  return (
    <>
      {!getUserInfo ? (
        <div className="w-full flex">
          <div className="w-1/2 flex flex-col items-center justify-center">
            <div className="w-3/5">
              <div className="text-8xl font-black text-center">Hi Surfer!</div>
              {change ? (
                <>
                  <button
                    className="mt-2 w-full rounded-full border border-slate-400 px-2 py-2"
                    onClick={() => signInWithGoogle()}
                  >
                    <GoogleIcon className="mr-2" />
                    Continue with Google
                  </button>
                  <div className="flex items-center justify-center mt-4">
                    <div className="border-t border-slate-400 w-1/3" />
                    <div className="mx-2 text-center">OR</div>
                    <div className=" w-1/3 border-t border-slate-400" />
                  </div>
                  <SignInWithNative setIsUserLoggedIn={setIsUserLoggedIn} />
                  <button
                    onClick={() => setChange((prev) => !prev)}
                    className=" mt-4"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <SignUp setIsUserLoggedIn={setIsUserLoggedIn} />
                  <button
                    onClick={() => setChange((prev) => !prev)}
                    className="mt-4"
                  >
                    Already have account?
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="w-1/2 relative h-negativeHeaderFooter">
            <Image
              src={'https://source.unsplash.com/ChOHCv42flI'}
              alt="signIn campaign"
              fill
              quality={100}
            />
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <div className="max-w-[1280px] w-full flex">
            <div className="w-1/4 flex flex-col">
              <button className="h-[100px]">個人資訊</button>
              <button className="h-[100px]">收藏浪點</button>
              <button className="h-[100px]">已回報浪況</button>
            </div>
            <div className="w-3/4 flex flex-col items-center">
              <Image
                width={100}
                height={100}
                alt="user icon"
                src={getUserInfo?.photoURL || userIcon}
                className="rounded-full"
              />
              <div>{getUserInfo?.displayName}</div>
              <div>{getUserInfo?.email}</div>
              <button className=" bg-slate-600 text-white p-2" onClick={Logout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Page;
{
  /* <button onClick={()=>{signOut(auth)}}>logout</button> */
}
