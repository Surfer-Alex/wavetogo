'use client';
import { useEffect, useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { db, auth } from '@/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { userStore, userPrivateStore } from '@/store';
import { UserInfo } from '@firebase/auth-types';
import Image from 'next/image';
import userIcon from '../../../public/images/icons8-user.gif' 

function Page() {
  const [signInWithGoogle, user, loading, fbError] = useSignInWithGoogle(auth);

  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean | string>(false);
  const isLogin = userStore.getState().uid;

  useEffect(() => {
    setIsUserLoggedIn(isLogin);
    getUserData(isLogin);
  }, []);

  useEffect(() => {
    setUserData();
    console.log(user);
  }, [user]);

  const getUserInfo = userPrivateStore((state) => state.userInfo);
  // console.log(getUserInfo);

  const setUserData = async () => {
    try {
      if (user) {
        const { uid, email, displayName, phoneNumber, photoURL, providerId } =
          user.user.providerData[0];
        const newUser:UserInfo = {
          uid: uid,
          email: email,
          displayName: displayName,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          providerId: providerId,
        };
        await setDoc(doc(db, 'users', uid), newUser);
        userStore.setState({ uid: uid,photoURL:photoURL||'' });
        userPrivateStore.setState({ userInfo: newUser });
        setIsUserLoggedIn(true);
      }
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  const getUserData = async (uid: string) => {
    try {
      if (uid) {
        const docSnap = await getDoc(doc(db, 'users', uid));
        const userInfo = (await docSnap.data()) as UserInfo;
        userPrivateStore.setState({ userInfo });
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  async function Logout() {
    await signOut(auth);
    userStore.setState({ uid: '',photoURL:''});
    userPrivateStore.setState({ userInfo: null });
    setIsUserLoggedIn(false);
  }

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-[1280px] w-full flex">
        {!isUserLoggedIn && (
          <div className='flex justify-center'>
          <button onClick={() => signInWithGoogle()}>
            Continue with Google
          </button>
          </div>
        )}
        {isUserLoggedIn && (
          <div className="w-1/4 flex flex-col">
            <button className="h-[100px]">個人資訊</button>
            <button className="h-[100px]">收藏浪點</button>
            <button className="h-[100px]">已回報浪況</button>
          </div>
        )}
        
          {isUserLoggedIn && (
            <div className="w-3/4 flex flex-col items-center">
              <Image
                width={100}
                height={100}
                alt="user icon"
                src={getUserInfo?.photoURL || userIcon}
                className='rounded-full'
              />
              <div>{getUserInfo?.displayName}</div>
              <div>{getUserInfo?.email}</div>
              <button className=" bg-slate-600 text-white p-2" onClick={Logout}>
                Sign out
              </button>
            </div>
          )}
        
      </div>
    </div>
  );
}
export default Page;
