'use client';
import { useStore } from '@/store';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '@/firebase';
import { UserInfo } from '../../types/userTypes';
import { userPrivateStore } from '@/store';
import { setDoc, doc } from 'firebase/firestore';
const DataProvider = () => {
  const getCurrentInfo = useStore((state) => state.fetch);
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
    setUserData();
  }, [user, loading]);

  useEffect(() => {
    getCurrentInfo('/api/currentAllSpot');
  }, []);

  const setUserData = async () => {
    try {
      if (user) {
        const { uid, email, displayName, phoneNumber, photoURL, providerId } =
          user.providerData[0];

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
      } else {
        userPrivateStore.setState({ userInfo: { isLogin: false } });
      }
    } catch (err) {
      console.error('Error: ', err);
    }
  };

  return null;
};

export default DataProvider;
