"use client";
import { useStore } from "@/store";
import { useEffect } from "react";
import { useAuthState, useIdToken } from "react-firebase-hooks/auth";
import { db, auth } from "@/firebase";
import { UserInfo } from "../../types/userTypes";
import { userPrivateStore } from "@/store";
import { setDoc, doc } from "firebase/firestore";
const DataProvider = () => {
  const getCurrentInfo = useStore((state) => state.fetch);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (loading) return;

    setUserData();
  }, [loading, user]);

  useEffect(() => {
    getCurrentInfo("/api/currentAllSpot");
  }, []);

  const setUserData = async () => {
    try {
      await auth.currentUser?.reload();
      if (user) {
        const { uid } = user.providerData[0];

        const newUser: UserInfo = user.providerData[0];
        await setDoc(doc(db, "users", uid), newUser);

        userPrivateStore.setState({ userInfo: newUser });
      } else {
        userPrivateStore.setState({ userInfo: { isLogin: false } });
      }
    } catch (err) {
      console.error("Error: ", err);
    }
  };

  return null;
};

export default DataProvider;
