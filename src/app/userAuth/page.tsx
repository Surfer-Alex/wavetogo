'use client';
import { useEffect, useState } from 'react';
import { useSignInWithGoogle, useAuthState } from 'react-firebase-hooks/auth';

import { db, auth } from '@/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { userPrivateStore } from '@/store';
import { UserInfo } from '../../../types/userTypes';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import SignUp from '@/components/member/SignUp';
import SignInWithNative from '@/components/member/SignInWithNative';
import GoogleIcon from '@mui/icons-material/Google';

function Page() {
  const [signInWithGoogle, user, loading, fbError] = useSignInWithGoogle(auth);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  //   const pathname = usePathname();
  //   const isActive = pathname === '/';
  // const isLogin = userStore.getState().uid;
  const [change, setChange] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user]);

  //   const getUserInfo = userPrivateStore((state) => state.userInfo);

  return (
    <>
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
    </>
  );
}
export default Page;
