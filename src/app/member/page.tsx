'use client';
import { useEffect, useState } from 'react';
import { useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { signOut } from "firebase/auth";
import { db, auth } from '@/firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { userStore, userPrivateStore } from '@/store';
import { UserInfo } from '@firebase/auth-types';


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
        const newUser = {
          uid: uid,
          email: email,
          displayName: displayName,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          providerId: providerId,
        };
        await setDoc(doc(db, 'users', uid), newUser);
        userStore.setState({ uid: uid });
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
    userStore.setState({ uid:'' });
    userPrivateStore.setState({ userInfo: null});
    setIsUserLoggedIn(false);
  }
  

  return (
    <div>
      {!isUserLoggedIn && (
        <button onClick={() => signInWithGoogle()}>Continue with Google</button>
      )}
      {isUserLoggedIn && <div>User:{getUserInfo?.displayName}</div>}
      
      {isUserLoggedIn ? (
          <button
            onClick={Logout}
          >
            Sign out
          </button>
        ) : null}
    </div>
  );
}
export default Page;