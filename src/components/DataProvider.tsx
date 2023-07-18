'use client';
import { useStore } from '@/store';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '@/firebase';
import { UserInfo } from '@firebase/auth-types';
import { userPrivateStore } from '@/store';
import { setDoc, doc } from 'firebase/firestore';
const DataProvider = () => {
  const getCurrentInfo = useStore((state) => state.fetch);
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    setUserData();
  }, [user]);
  useEffect(() => {
    getCurrentInfo('/api/currentAllSpot');
  }, []);
  useEffect(() => {
    console.log('data提供', user);
  }, [user]);

  const setUserData = async () => {
    try {
      if (user) {
        const { uid, email, displayName, phoneNumber, photoURL, providerId } =
          user.providerData[0];
        // console.log(displayName);
        const newUser: UserInfo = {
          uid: uid,
          email: email,
          displayName: displayName,
          phoneNumber: phoneNumber,
          photoURL: photoURL,
          providerId: providerId,
        };
        await setDoc(doc(db, 'users', uid), newUser, { merge: true });

        userPrivateStore.setState({ userInfo: newUser });
      }
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  return null;
};

export default DataProvider;
