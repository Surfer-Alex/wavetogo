"use client";
import { useEffect, useState } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { SnackbarProvider } from "notistack";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import Image from "next/image";

import SignUp from "@/components/member/SignUp";
import SignInWithNative from "@/components/member/SignInWithNative";
import GoogleIcon from "@mui/icons-material/Google";

function Page() {
  const [signInWithGoogle, user, loading, fbError] = useSignInWithGoogle(auth);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [change, setChange] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <>
      <SnackbarProvider maxSnack={2}>
        <div className="flex w-full">
          <div className="flex h-negativeHeader w-full flex-col items-center justify-center lg:w-1/2">
            <div className="w-2/3 lg:w-3/5">
              <div className="text-center  text-6xl font-black md:text-8xl">
                Hi Surfer!
              </div>
              {change ? (
                <>
                  <button
                    className="mt-4 w-full rounded-full border border-slate-400 px-2 py-2 md:mt-2"
                    onClick={() => signInWithGoogle()}
                  >
                    <GoogleIcon className="mr-2" />
                    Continue with Google
                  </button>
                  <div className="mt-4 flex items-center justify-center">
                    <div className="w-1/3 border-t border-slate-400" />
                    <div className="mx-2 text-center">OR</div>
                    <div className=" w-1/3 border-t border-slate-400" />
                  </div>
                  <SignInWithNative setIsUserLoggedIn={setIsUserLoggedIn} />
                  <button
                    onClick={() => setChange((prev) => !prev)}
                    className=" my-4 "
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <SignUp setIsUserLoggedIn={setIsUserLoggedIn} />
                  <button
                    onClick={() => setChange((prev) => !prev)}
                    className="my-4"
                  >
                    Already have account?
                  </button>
                </>
              )}
            </div>
          </div>
          <div className="hidden h-negativeHeader lg:relative lg:inline-block lg:w-1/2">
            <Image
              src={"https://source.unsplash.com/ChOHCv42flI"}
              alt="signIn campaign"
              fill
              quality={100}
            />
          </div>
        </div>
      </SnackbarProvider>
    </>
  );
}
export default Page;
