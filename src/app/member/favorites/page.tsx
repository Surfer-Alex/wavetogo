'use client';
import { useEffect, useState } from 'react';
import { useStore, userPrivateStore } from '@/store';
import { Spot } from '@/store';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';
function Page() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const { spotData } = useStore();
  const uid = userPrivateStore((state) => state.userInfo?.uid);

  useEffect(() => {
    fetchFavorites();
  }, [spotData]);

  const fetchFavorites = async () => {
    try {
      const unsub = onSnapshot(doc(db, `users/${uid}`), (doc) => {
        const parsedData = doc.data();
        const spotInfo = spotData.data.spots.filter(
          (spot) => parsedData?.favorites.includes(spot._id)
        );
        setSpots(spotInfo);
      });
      return () => unsub;
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };
  const handleRemoveFromFavorites = async (id: string) => {
    try {
      const data = await fetch(`/api/firebase/favorites/?uid=${uid}&id=${id}`, {
        method: 'DELETE',
      });
      const parsedData = await data.json();
    } catch (err) {
      console.error('Error delete favorites:', err);
    }
  };

  return (
    <>
      <div className="w-3/4 h-3/5 flex justify-center items-center">
        <div className="w-4/5  h-full flex flex-col justify-center items-center bg-gray-100 rounded-xl p-6 overflow-y-auto">
          {spots.map((i, idx) => {
            return (
              <div
                key={idx}
                className="w-4/5 flex border border-gray-300 rounded-xl p-4 mt-6"
              >
                <div className="text-xl text-gray-600">{i.name}</div>
                <button
                  onClick={() => handleRemoveFromFavorites(i._id)}
                  className="text-xl ml-auto  text-red-600 opacity-70 hover:opacity-100"
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
