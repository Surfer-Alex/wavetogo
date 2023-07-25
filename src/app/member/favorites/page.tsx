"use client";
import { useEffect, useState } from "react";
import { useStore, userPrivateStore } from "@/store";
import { Spot } from "@/store";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
function Page() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const { spotData } = useStore();
  const uid = userPrivateStore((state) => state.userInfo?.uid);

  useEffect(() => {
    fetchFavorites();
  }, [spotData, uid]);
  useEffect(() => {
    console.log(spots);
  }, [spots]);

  const fetchFavorites = async () => {
    try {
      const unsub = onSnapshot(doc(db, `users/${uid}`), (doc) => {
        const parsedData = doc.data();
        const spotInfo = spotData.data.spots.filter(
          (spot) => parsedData?.favorites.includes(spot._id),
        );
        setSpots(spotInfo);
      });
      return () => unsub;
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };
  const handleRemoveFromFavorites = async (id: string) => {
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}&id=${id}`, {
        method: "DELETE",
      });
      const parsedData = await data.json();
    } catch (err) {
      console.error("Error delete favorites:", err);
    }
  };
  if (spots.length === 0) {
    return (
      <div className="flex h-3/5 w-3/4 items-center justify-center">
        <div className="flex  h-full w-4/5 flex-col items-center justify-center overflow-y-auto rounded-xl bg-gray-100 p-6">
          <div
            className="inline-block h-14 w-14 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex h-3/5 w-3/4 items-center justify-center">
        <div className="flex  h-full w-4/5 flex-col  items-center overflow-y-auto rounded-xl bg-gray-100 p-6">
          {spots.map((i, idx) => {
            return (
              <div
                key={idx}
                className="mt-6 flex w-4/5 rounded-xl border border-gray-300 p-4"
              >
                <div className="text-xl text-gray-600">{i.name}</div>
                <button
                  onClick={() => handleRemoveFromFavorites(i._id)}
                  className="ml-auto text-xl  text-red-600 opacity-70 hover:opacity-100"
                >
                  REMOVE
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Page;
